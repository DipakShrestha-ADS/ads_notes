// ============================================
//  ADS Notes — Main Application Script
//  LOCAL-FIRST: Uses local files by default,
//  upgrades to GitHub API only if confirmed online.
// ============================================

(() => {
    'use strict';

    // --- CONFIG ---
    const REPO_OWNER = 'DipakShrestha-ADS';
    const REPO_NAME  = 'ads_notes';
    const API_BASE   = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;
    const RAW_BASE   = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;
    const CACHE_PREFIX = 'ads_notes_';
    const HIDDEN_FILES = ['.DS_Store', '.gitignore', 'LICENSE', '.git'];
    const FOLDER_ICONS = {
        CProgramming : '💻',
        Golang       : '🐹',
        HtmlCssJS    : '🌐',
        'React.JS'   : '⚛️'
    };
    const DEFAULT_FONT_SIZE = 16;
    const FONT_STEP  = 2;
    const MIN_FONT   = 12;
    const MAX_FONT   = 28;
    const PROBE_TIMEOUT = 3000;   // ms — max wait when probing connectivity

    // --- MODE ---
    //  'offline' = local files + manifest   (DEFAULT on startup)
    //  'online'  = GitHub API + raw CDN
    let connectionMode = 'offline';          // ← start offline always!

    // --- ELEMENTS ---
    const $ = id => document.getElementById(id);
    const $sidebar         = $('sidebar');
    const $fileTree        = $('file-tree');
    const $content         = $('content');
    const $markdownBody    = $('markdown-body');
    const $welcome         = $('welcome');
    const $subjectsOverview= $('subjects-overview');
    const $breadcrumb      = $('breadcrumb');
    const $docMeta         = $('doc-meta');
    const $readingTime     = $('reading-time');
    const $searchInput     = $('search-input');
    const $scrollProgress  = $('scroll-progress');
    const $scrollTop       = $('scroll-top');
    const $tocToggle       = $('toc-toggle');
    const $tocPanel        = $('toc-panel');
    const $tocList         = $('toc-list');
    const $tocClose        = $('toc-close');
    const $sidebarToggle   = $('sidebar-toggle');
    const $sidebarOverlay  = $('sidebar-overlay');
    const $fontDecrease    = $('font-decrease');
    const $fontIncrease    = $('font-increase');
    const $fontReset       = $('font-reset');
    const $fullscreenToggle= $('fullscreen-toggle');
    const $offlineBanner   = $('offline-banner');

    // --- STATE ---
    let currentFontSize = DEFAULT_FONT_SIZE;
    let currentFilePath = null;
    let folderDataCache = {};
    let debounceTimer   = null;

    // --- MANIFEST (embedded in index.html <script>) ---
    const MANIFEST = window.ADS_NOTES_MANIFEST || {};

    // ============================================
    //  MARKED — custom renderer for image / link
    // ============================================
    const renderer = new marked.Renderer();

    renderer.image = function (href, title, text) {
        if (typeof href === 'object' && href !== null) {
            title = href.title || ''; text = href.text || href.alt || ''; href = href.href || '';
        }
        href = resolveAssetUrl(href); title = title || ''; text = text || '';
        return `<img src="${esc(href)}" alt="${esc(text)}" title="${esc(title)}" loading="lazy">`;
    };

    renderer.link = function (href, title, text) {
        if (typeof href === 'object' && href !== null) {
            title = href.title || ''; text = href.text || ''; href = href.href || '';
        }
        title = title || ''; text = text || '';

        // Relative .md → in-app navigation
        if (href && !href.startsWith('http') && !href.startsWith('#') && /\.md$/i.test(href)) {
            const resolved = resolveRelativePath(href);
            return `<a href="#${encodeURIComponent(resolved)}" title="${esc(title)}">${text}</a>`;
        }
        // Relative asset → resolve
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            href = resolveAssetUrl(href);
        }
        const ext = href && href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${esc(href)}" title="${esc(title)}"${ext}>${text}</a>`;
    };

    marked.setOptions({
        renderer,
        highlight(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try { return hljs.highlight(code, { language: lang }).value; } catch (_) {}
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true, gfm: true
    });

    // ============================================
    //  UTILITIES
    // ============================================
    function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
    function isMd(n) { return /\.(md|markdown)$/i.test(n); }
    function isHidden(n) { return HIDDEN_FILES.includes(n) || n.startsWith('.'); }
    function fmtName(n) { return n.replace(/\.md$/i, '').replace(/[-_]/g, ' '); }
    function readTime(t) {
        const w = t.trim().split(/\s+/).length;
        return `📖 ${Math.ceil(w / 200)} min read · ${w.toLocaleString()} words`;
    }

    function cacheGet(k) { try { const d = sessionStorage.getItem(CACHE_PREFIX+k); return d ? JSON.parse(d) : null; } catch { return null; } }
    function cacheSet(k,v) { try { sessionStorage.setItem(CACHE_PREFIX+k, JSON.stringify(v)); } catch {} }

    // ============================================
    //  PATH RESOLUTION
    // ============================================
    function resolveRelativePath(rel) {
        if (!currentFilePath) return rel;
        const base = currentFilePath.split('/'); base.pop();
        for (const seg of rel.split('/')) {
            if (seg === '..') base.pop();
            else if (seg !== '.' && seg !== '') base.push(seg);
        }
        return base.join('/');
    }

    function resolveAssetUrl(url) {
        if (!url || /^(https?:\/\/|data:|blob:|#)/i.test(url)) return url;
        const resolved = resolveRelativePath(url);
        if (connectionMode === 'online') {
            return RAW_BASE + '/' + resolved.split('/').map(encodeURIComponent).join('/');
        }
        return resolved;                       // local relative path
    }

    // ============================================
    //  CONNECTIVITY
    // ============================================
    function showBanner(msg, isError) {
        $offlineBanner.textContent = msg || '📡 Offline mode — reading from local files';
        $offlineBanner.style.display = 'flex';
        $offlineBanner.classList.toggle('error-banner', !!isError);
    }
    function hideBanner() { $offlineBanner.style.display = 'none'; }

    /**
     * Fast connectivity probe.
     * Returns true if GitHub API is reachable within PROBE_TIMEOUT ms.
     */
    async function probeOnline() {
        try {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT);
            const res = await fetch(
                `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
                { method: 'HEAD', signal: ctrl.signal, cache: 'no-store' }
            );
            clearTimeout(timer);
            return res.ok || res.status === 403;   // 403 = rate-limit but still "online"
        } catch {
            return false;
        }
    }

    /**
     * Attempt to upgrade to online mode (non-blocking).
     * If successful, rebuild the tree with live data.
     */
    async function tryUpgradeToOnline() {
        if (connectionMode === 'online') return;
        const ok = await probeOnline();
        if (ok) {
            connectionMode = 'online';
            hideBanner();
            console.log('[ADS Notes] Upgraded to ONLINE mode.');
            // Optionally rebuild tree from API for freshest data
            // (folders already loaded will use cache)
        }
    }

    // ============================================
    //  MANIFEST → GitHub-API-shaped array
    // ============================================
    function manifestDir(dirPath) {
        let node = MANIFEST;
        if (dirPath) {
            for (const seg of dirPath.split('/')) {
                node = node && typeof node === 'object' ? node[seg] : undefined;
                if (!node) return [];
            }
        }
        if (!node || typeof node !== 'object') return [];

        const out = [];
        for (const key of Object.keys(node)) {
            if (key === '_files' || key === '_rootFiles') continue;
            out.push({ name: key, path: dirPath ? `${dirPath}/${key}` : key, type: 'dir' });
        }
        const files = node._files || [];
        for (const f of files) out.push({ name: f, path: dirPath ? `${dirPath}/${f}` : f, type: 'file' });

        if (!dirPath && node._rootFiles) {
            for (const f of node._rootFiles) {
                if (!out.find(o => o.name === f)) out.push({ name: f, path: f, type: 'file' });
            }
        }
        return out;
    }

    // ============================================
    //  DATA FETCHING — local-first
    // ============================================

    /** Directory listing */
    async function fetchDir(path) {
        path = path || '';
        const ck = 'dir_' + (path || 'root');
        const cached = cacheGet(ck);
        if (cached) return cached;

        // --- OFFLINE: manifest ---
        if (connectionMode === 'offline') return manifestDir(path);

        // --- ONLINE: API ---
        try {
            const url = path
                ? `${API_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`
                : API_BASE;
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 6000);
            const res = await fetch(url, { signal: ctrl.signal });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            cacheSet(ck, data);
            return data;
        } catch (err) {
            console.warn('[ADS Notes] API fail →', err.message, '→ manifest');
            connectionMode = 'offline';
            showBanner('📡 Offline mode — reading from local files');
            return manifestDir(path);
        }
    }

    /** Markdown file content */
    async function fetchMd(path) {
        const ck = 'file_' + path;
        const cached = cacheGet(ck);
        if (cached) return cached;

        // --- OFFLINE: local fetch ---
        if (connectionMode === 'offline') return fetchLocal(path);

        // --- ONLINE: raw GitHub ---
        try {
            const url = `${RAW_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`;
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 6000);
            const res = await fetch(url, { signal: ctrl.signal });
            clearTimeout(timer);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const txt = await res.text();
            cacheSet(ck, txt);
            return txt;
        } catch (err) {
            console.warn('[ADS Notes] Raw fetch fail →', err.message, '→ local');
            connectionMode = 'offline';
            showBanner('📡 Offline mode — reading from local files');
            return fetchLocal(path);
        }
    }

    /** Local file fetch (relative to index.html) */
    async function fetchLocal(path) {
        const ck = 'file_' + path;
        const cached = cacheGet(ck);
        if (cached) return cached;

        const res = await fetch(path);
        if (!res.ok) throw new Error(`Local file not found: ${path} (${res.status})`);
        const txt = await res.text();
        cacheSet(ck, txt);
        return txt;
    }

    // ============================================
    //  FILE TREE
    // ============================================
    async function buildFileTree() {
        $fileTree.innerHTML = `<div class="sidebar-loading"><div class="neon-spinner"></div><p>Loading notes…</p></div>`;

        try {
            const root = await fetchDir('');
            const folders = root.filter(i => i.type === 'dir'  && !isHidden(i.name)).sort((a,b) => a.name.localeCompare(b.name));
            const files   = root.filter(i => i.type === 'file' && isMd(i.name) && !isHidden(i.name));

            $fileTree.innerHTML = '';
            for (const f of folders) $fileTree.appendChild(mkFolder(f.name, f.path));
            for (const f of files)   $fileTree.appendChild(mkFile(f.name, f.path));

            buildWelcome(folders);

            // Restore hash-based navigation
            if (location.hash) {
                const p = decodeURIComponent(location.hash.slice(1));
                if (p) navigateToFile(p);
            }
        } catch (err) {
            $fileTree.innerHTML = `<div class="content-error"><h2>⚠️ Error</h2><p>${esc(err.message)}</p><button onclick="location.reload()">Retry</button></div>`;
        }
    }

    function mkFolder(name, path) {
        const el = document.createElement('div');
        el.className = 'tree-folder';
        el.dataset.path = path;
        el.dataset.name = name.toLowerCase();
        const icon = FOLDER_ICONS[name] || '📁';
        el.innerHTML = `
            <div class="tree-folder-header" data-path="${esc(path)}">
                <span class="folder-arrow">▶</span>
                <span class="folder-icon">${icon}</span>
                <span class="folder-name">${esc(name)}</span>
                <span class="folder-badge">…</span>
            </div>
            <div class="tree-folder-children" data-path="${esc(path)}"></div>`;
        el.querySelector('.tree-folder-header').addEventListener('click', () => toggleFolder(el, path));
        return el;
    }

    async function toggleFolder(el, path) {
        const hdr = el.querySelector('.tree-folder-header');
        const box = el.querySelector('.tree-folder-children');
        if (hdr.classList.contains('expanded')) {
            hdr.classList.remove('expanded'); box.classList.remove('expanded'); return;
        }
        hdr.classList.add('expanded'); box.classList.add('expanded');

        if (!box.dataset.loaded) {
            box.innerHTML = `<div class="sidebar-loading" style="padding:12px"><div class="neon-spinner" style="width:20px;height:20px;border-width:2px"></div></div>`;
            try {
                const items = await fetchDir(path);
                box.innerHTML = '';
                const subs  = items.filter(i => i.type === 'dir'  && !isHidden(i.name)).sort((a,b) => a.name.localeCompare(b.name));
                const files = items.filter(i => i.type === 'file' && isMd(i.name) && !isHidden(i.name)).sort((a,b) => a.name.localeCompare(b.name));

                for (const s of subs)  box.appendChild(mkFolder(s.name, s.path));
                for (const f of files) box.appendChild(mkFile(f.name, f.path));

                const badge = hdr.querySelector('.folder-badge');
                if (badge) badge.textContent = files.length + subs.length;
                if (!files.length && !subs.length) {
                    box.innerHTML = `<div style="padding:8px 28px;font-size:12px;color:var(--text-muted);">No markdown files</div>`;
                }
                box.dataset.loaded = 'true';
                folderDataCache[path] = { files, subs };
                updateBadge(path, files.length);
            } catch {
                box.innerHTML = `<div style="padding:8px 28px;font-size:12px;color:var(--neon-magenta);">Failed to load</div>`;
            }
        }
    }

    function mkFile(name, path) {
        const el = document.createElement('div');
        el.className = 'tree-file';
        el.dataset.path = path;
        el.dataset.name = name.toLowerCase();
        el.innerHTML = `<span class="file-icon">📄</span><span class="file-name" title="${esc(name)}">${esc(fmtName(name))}</span>`;
        el.addEventListener('click', () => navigateToFile(path));
        return el;
    }

    async function expandTo(path) {
        const parts = path.split('/');
        let cur = '';
        for (let i = 0; i < parts.length - 1; i++) {
            cur = cur ? cur + '/' + parts[i] : parts[i];
            const f = $fileTree.querySelector(`.tree-folder[data-path="${CSS.escape(cur)}"]`);
            if (f) {
                const h = f.querySelector('.tree-folder-header');
                if (!h.classList.contains('expanded')) await toggleFolder(f, cur);
            }
        }
    }

    // ============================================
    //  FILE NAVIGATION
    // ============================================
    async function navigateToFile(path) {
        if (!isMd(path)) return;
        currentFilePath = path;
        location.hash = encodeURIComponent(path);

        document.querySelectorAll('.tree-file.active').forEach(e => e.classList.remove('active'));
        let fe = $fileTree.querySelector(`.tree-file[data-path="${CSS.escape(path)}"]`);
        if (fe) { fe.classList.add('active'); }
        else { await expandTo(path); fe = $fileTree.querySelector(`.tree-file[data-path="${CSS.escape(path)}"]`); if (fe) fe.classList.add('active'); }

        updateBreadcrumb(path);
        $welcome.style.display = 'none';
        $markdownBody.innerHTML = `<div class="content-loading"><div class="neon-spinner"></div><p>Loading note…</p></div>`;
        $docMeta.style.display = 'none';
        $tocToggle.style.display = 'none';

        try {
            const md = await fetchMd(path);
            $markdownBody.innerHTML = `<div class="fade-in">${marked.parse(md)}</div>`;
            addCopyButtons();
            hljs.highlightAll();
            buildTOC();
            $content.scrollTop = 0;
            window.scrollTo(0, 0);
            $readingTime.textContent = readTime(md);
            $docMeta.style.display = 'flex';
            $tocToggle.style.display = 'block';
            closeSidebar();
        } catch (err) {
            $markdownBody.innerHTML = `
                <div class="content-error">
                    <h2>⚠️ Failed to load</h2>
                    <p>${esc(err.message)}</p>
                    <p style="color:var(--text-muted);font-size:13px;margin-top:8px;">
                        Make sure the file exists at: <code>${esc(path)}</code>
                    </p>
                    <button onclick="location.reload()">Retry</button>
                </div>`;
        }
    }

    // ============================================
    //  BREADCRUMB
    // ============================================
    function updateBreadcrumb(path) {
        const parts = path.split('/');
        let html = `<span class="crumb" data-path="">🏠 Home</span>`, cum = '';
        for (let i = 0; i < parts.length; i++) {
            cum = cum ? cum + '/' + parts[i] : parts[i];
            html += `<span class="crumb-sep">›</span>`;
            html += i === parts.length - 1
                ? `<span class="crumb-active">${esc(fmtName(parts[i]))}</span>`
                : `<span class="crumb" data-path="${esc(cum)}">${esc(parts[i])}</span>`;
        }
        $breadcrumb.innerHTML = html;
        $breadcrumb.querySelectorAll('.crumb').forEach(c => c.addEventListener('click', () => { if (!c.dataset.path) showWelcome(); }));
    }

    function showWelcome() {
        currentFilePath = null; location.hash = '';
        $markdownBody.innerHTML = ''; $markdownBody.appendChild($welcome);
        $welcome.style.display = 'block'; $breadcrumb.innerHTML = '';
        $docMeta.style.display = 'none'; $tocToggle.style.display = 'none';
        $tocPanel.classList.add('toc-hidden');
        document.querySelectorAll('.tree-file.active').forEach(e => e.classList.remove('active'));
    }

    // ============================================
    //  CODE BLOCKS — copy button
    // ============================================
    function addCopyButtons() {
        $markdownBody.querySelectorAll('pre').forEach(pre => {
            if (pre.previousElementSibling?.classList.contains('code-block-header')) return;
            const code = pre.querySelector('code'); if (!code) return;
            let lang = '';
            code.classList.forEach(c => { const m = c.match(/^(language-|hljs-)(.+)/); if (m) lang = m[2]; });

            const hdr = document.createElement('div');
            hdr.className = 'code-block-header';
            hdr.innerHTML = `<span>${esc(lang || 'code')}</span><button class="copy-btn" title="Copy code">📋 Copy</button>`;
            const btn = hdr.querySelector('.copy-btn');
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    btn.textContent = '✅ Copied!'; btn.classList.add('copied');
                    setTimeout(() => { btn.textContent = '📋 Copy'; btn.classList.remove('copied'); }, 2000);
                }).catch(() => { btn.textContent = '❌ Failed'; setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000); });
            });
            pre.parentNode.insertBefore(hdr, pre);
        });
    }

    // ============================================
    //  TABLE OF CONTENTS
    // ============================================
    function buildTOC() {
        const hh = $markdownBody.querySelectorAll('h1,h2,h3');
        if (!hh.length) { $tocToggle.style.display = 'none'; return; }
        $tocList.innerHTML = '';
        hh.forEach((h, i) => {
            h.id = 'heading-' + i;
            const a = document.createElement('a');
            a.className = `toc-item toc-${h.tagName.toLowerCase()}`;
            a.textContent = h.textContent; a.href = '#' + h.id;
            a.addEventListener('click', e => { e.preventDefault(); h.scrollIntoView({ behavior:'smooth', block:'start' }); $tocPanel.classList.add('toc-hidden'); });
            $tocList.appendChild(a);
        });
    }

    // ============================================
    //  WELCOME
    // ============================================
    function buildWelcome(folders) {
        $subjectsOverview.innerHTML = '';
        for (const f of folders) {
            const icon = FOLDER_ICONS[f.name] || '📁';
            const card = document.createElement('div');
            card.className = 'subject-card'; card.dataset.path = f.path;
            card.innerHTML = `<div class="card-icon">${icon}</div><div class="card-title">${esc(f.name)}</div><div class="card-count" data-folder="${esc(f.path)}">Click to explore</div>`;
            card.addEventListener('click', async () => {
                const el = $fileTree.querySelector(`.tree-folder[data-path="${CSS.escape(f.path)}"]`);
                if (el) { const h = el.querySelector('.tree-folder-header'); if (!h.classList.contains('expanded')) await toggleFolder(el, f.path); el.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
                openSidebar();
            });
            $subjectsOverview.appendChild(card);
        }
        // pre-fetch counts
        folders.forEach(f => fetchDir(f.path).then(items => {
            const mc = items.filter(i => i.type === 'file' && isMd(i.name) && !isHidden(i.name)).length;
            const sc = items.filter(i => i.type === 'dir' && !isHidden(i.name)).length;
            updateBadge(f.path, mc, sc);
        }).catch(() => {}));
    }

    function updateBadge(fp, fc, sc) {
        const b = $subjectsOverview.querySelector(`[data-folder="${CSS.escape(fp)}"]`);
        if (b) { let t = `${fc} note${fc!==1?'s':''}`; if (sc) t += ` · ${sc} subfolder${sc!==1?'s':''}`; b.textContent = t; }
        const sb = $fileTree.querySelector(`.tree-folder[data-path="${CSS.escape(fp)}"] .folder-badge`);
        if (sb && sb.textContent === '…') sb.textContent = fc;
    }

    // ============================================
    //  SEARCH
    // ============================================
    function doSearch(q) {
        q = q.toLowerCase().trim();
        if (!q) { $fileTree.querySelectorAll('.tree-folder,.tree-file').forEach(e => e.classList.remove('hidden')); return; }

        $fileTree.querySelectorAll('.tree-folder').forEach(folder => {
            const fn = folder.dataset.name || '';
            const ch = folder.querySelector('.tree-folder-children');
            let match = fn.includes(q);
            if (ch?.dataset.loaded) {
                folder.querySelectorAll('.tree-file').forEach(f => {
                    if ((f.dataset.name||'').includes(q)) { f.classList.remove('hidden'); match = true; }
                    else f.classList.add('hidden');
                });
                if (match) { const h = folder.querySelector('.tree-folder-header'); if (!h.classList.contains('expanded')) { h.classList.add('expanded'); ch.classList.add('expanded'); } }
            }
            folder.classList.toggle('hidden', !match && !fn.includes(q));
        });
        $fileTree.querySelectorAll(':scope>.tree-file').forEach(f => f.classList.toggle('hidden', !(f.dataset.name||'').includes(q)));
    }

    // ============================================
    //  SCROLL
    // ============================================
    function onScroll() {
        requestAnimationFrame(() => {
            const st = window.scrollY || document.documentElement.scrollTop;
            const dh = document.documentElement.scrollHeight - window.innerHeight;
            $scrollProgress.style.width = (dh > 0 ? (st/dh)*100 : 0) + '%';
            $scrollTop.style.display = st > 400 ? 'flex' : 'none';
        });
    }

    // ============================================
    //  SIDEBAR
    // ============================================
    function openSidebar()  { $sidebar.classList.add('open'); }
    function closeSidebar() { $sidebar.classList.remove('open'); }

    // ============================================
    //  FONT
    // ============================================
    function setFont(s) {
        currentFontSize = Math.max(MIN_FONT, Math.min(MAX_FONT, s));
        document.documentElement.style.setProperty('--content-font-size', currentFontSize + 'px');
    }

    // ============================================
    //  EVENTS
    // ============================================
    function initEvents() {
        $searchInput.addEventListener('input', () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => doSearch($searchInput.value), 200); });
        window.addEventListener('scroll', onScroll, { passive: true });
        $scrollTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
        $tocToggle.addEventListener('click', () => $tocPanel.classList.toggle('toc-hidden'));
        $tocClose.addEventListener('click', () => $tocPanel.classList.add('toc-hidden'));
        $sidebarToggle.addEventListener('click', () => $sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
        $sidebarOverlay.addEventListener('click', closeSidebar);
        $fontDecrease.addEventListener('click', () => setFont(currentFontSize - FONT_STEP));
        $fontIncrease.addEventListener('click', () => setFont(currentFontSize + FONT_STEP));
        $fontReset.addEventListener('click', () => setFont(DEFAULT_FONT_SIZE));
        $fullscreenToggle.addEventListener('click', () => document.body.classList.toggle('fullscreen'));

        document.addEventListener('keydown', e => {
            if ((e.ctrlKey||e.metaKey) && e.key === 'k') { e.preventDefault(); $searchInput.focus(); $searchInput.select(); }
            if (e.key === 'Escape') { $tocPanel.classList.add('toc-hidden'); document.body.classList.remove('fullscreen'); closeSidebar(); $searchInput.blur(); }
        });

        window.addEventListener('hashchange', () => {
            const p = decodeURIComponent(location.hash.slice(1));
            if (p && p !== currentFilePath) navigateToFile(p);
            else if (!p) showWelcome();
        });

        // Browser online/offline events
        window.addEventListener('online', () => {
            // Don't auto-switch; just silently try upgrade in background
            tryUpgradeToOnline();
        });
        window.addEventListener('offline', () => {
            connectionMode = 'offline';
            showBanner('📡 Offline mode — reading from local files');
        });
    }

    // ============================================
    //  INIT
    // ============================================
    async function init() {
        initEvents();

        // ★ ALWAYS start with local/manifest (instant, no waiting)
        showBanner('📡 Offline mode — reading from local files');
        await buildFileTree();

        // ★ THEN silently probe in the background
        //   If online, future fetches will use GitHub API
        probeOnline().then(ok => {
            if (ok) {
                connectionMode = 'online';
                hideBanner();
                console.log('[ADS Notes] Background probe succeeded → ONLINE mode available for future fetches.');
            } else {
                console.log('[ADS Notes] Background probe failed → staying OFFLINE.');
            }
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
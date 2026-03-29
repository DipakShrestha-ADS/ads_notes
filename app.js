// ============================================
//  ADS Notes — Main Application Script
// ============================================

(() => {
    'use strict';

    // --- CONFIG ---
    const REPO_OWNER = 'DipakShrestha-ADS';
    const REPO_NAME = 'ads_notes';
    const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;
    const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;
    const CACHE_PREFIX = 'ads_notes_';
    const HIDDEN_FILES = ['.DS_Store', '.gitignore', 'LICENSE', '.git'];
    const FOLDER_ICONS = {
        'CProgramming': '💻',
        'Golang': '🐹',
        'HtmlCssJS': '🌐',
        'React.JS': '⚛️'
    };
    const DEFAULT_FONT_SIZE = 16;
    const FONT_STEP = 2;
    const MIN_FONT = 12;
    const MAX_FONT = 28;

    // --- ELEMENTS ---
    const $sidebar = document.getElementById('sidebar');
    const $fileTree = document.getElementById('file-tree');
    const $content = document.getElementById('content');
    const $markdownBody = document.getElementById('markdown-body');
    const $welcome = document.getElementById('welcome');
    const $subjectsOverview = document.getElementById('subjects-overview');
    const $breadcrumb = document.getElementById('breadcrumb');
    const $docMeta = document.getElementById('doc-meta');
    const $readingTime = document.getElementById('reading-time');
    const $searchInput = document.getElementById('search-input');
    const $scrollProgress = document.getElementById('scroll-progress');
    const $scrollTop = document.getElementById('scroll-top');
    const $tocToggle = document.getElementById('toc-toggle');
    const $tocPanel = document.getElementById('toc-panel');
    const $tocList = document.getElementById('toc-list');
    const $tocClose = document.getElementById('toc-close');
    const $sidebarToggle = document.getElementById('sidebar-toggle');
    const $sidebarOverlay = document.getElementById('sidebar-overlay');
    const $fontDecrease = document.getElementById('font-decrease');
    const $fontIncrease = document.getElementById('font-increase');
    const $fontReset = document.getElementById('font-reset');
    const $fullscreenToggle = document.getElementById('fullscreen-toggle');

    // --- STATE ---
    let currentFontSize = DEFAULT_FONT_SIZE;
    let currentFilePath = null;
    let folderDataCache = {};
    let debounceTimer = null;

    // ============================================
    //  MARKED CONFIGURATION
    // ============================================

    // Custom renderer to rewrite relative image/link paths
    const renderer = new marked.Renderer();

    // Store original image renderer
    const originalImage = renderer.image.bind(renderer);
    renderer.image = function (href, title, text) {
        // If href is an object (marked v5+), extract the href string
        if (typeof href === 'object' && href !== null) {
            title = href.title || '';
            text = href.text || href.alt || '';
            href = href.href || '';
        }
        href = resolveAssetUrl(href);
        title = title || '';
        text = text || '';
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" title="${escapeHtml(title)}" loading="lazy">`;
    };

    // Rewrite links to other .md files as in-app navigation; rewrite relative asset links
    const originalLink = renderer.link.bind(renderer);
    renderer.link = function (href, title, text) {
        if (typeof href === 'object' && href !== null) {
            title = href.title || '';
            text = href.text || '';
            href = href.href || '';
        }
        title = title || '';
        text = text || '';

        // If it's a relative .md link, make it navigate within the app
        if (href && !href.startsWith('http') && !href.startsWith('#') && /\.md$/i.test(href)) {
            const resolvedPath = resolveRelativePath(href);
            return `<a href="#${encodeURIComponent(resolvedPath)}" title="${escapeHtml(title)}">${text}</a>`;
        }

        // Relative asset links (e.g., PDFs) — resolve to raw GitHub
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            href = resolveAssetUrl(href);
        }

        const targetAttr = href && href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(href)}" title="${escapeHtml(title)}"${targetAttr}>${text}</a>`;
    };

    marked.setOptions({
        renderer: renderer,
        highlight: function (code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try { return hljs.highlight(code, { language: lang }).value; } catch (_) {}
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    // ============================================
    //  UTILITIES
    // ============================================
    function isMarkdown(name) {
        return /\.(md|markdown)$/i.test(name);
    }

    function isHidden(name) {
        return HIDDEN_FILES.includes(name) || name.startsWith('.');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatFileName(name) {
        return name.replace(/\.md$/i, '').replace(/[-_]/g, ' ');
    }

    function estimateReadingTime(text) {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `📖 ${minutes} min read · ${words.toLocaleString()} words`;
    }

    function cacheGet(key) {
        try {
            const data = sessionStorage.getItem(CACHE_PREFIX + key);
            return data ? JSON.parse(data) : null;
        } catch { return null; }
    }

    function cacheSet(key, data) {
        try {
            sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
        } catch {}
    }

    /**
     * Given the currently open file path and a relative URL from the markdown,
     * resolve it to the full raw.githubusercontent.com URL.
     *
     * Example:
     *   currentFilePath = "CProgramming/unit1- Introduction To Algorithm and C.md"
     *   relativeUrl     = "d-assets/2080.png"
     *   result          = "https://raw.githubusercontent.com/.../CProgramming/d-assets/2080.png"
     */
    function resolveAssetUrl(url) {
        if (!url) return url;
        // Already absolute
        if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
            return url;
        }
        // Anchor-only
        if (url.startsWith('#')) return url;

        const resolved = resolveRelativePath(url);
        // Encode each path segment individually (handles spaces and special chars)
        return RAW_BASE + '/' + resolved.split('/').map(encodeURIComponent).join('/');
    }

    /**
     * Resolve a relative path against the directory of the currently open file.
     * Handles ../ and ./ prefixes.
     */
    function resolveRelativePath(relativePath) {
        if (!currentFilePath) return relativePath;

        // Get the directory of the current file
        const parts = currentFilePath.split('/');
        parts.pop(); // remove filename
        let baseParts = [...parts];

        // Process the relative path
        const relParts = relativePath.split('/');
        for (const segment of relParts) {
            if (segment === '..') {
                baseParts.pop();
            } else if (segment !== '.' && segment !== '') {
                baseParts.push(segment);
            }
        }

        return baseParts.join('/');
    }

    // ============================================
    //  GITHUB API
    // ============================================
    async function fetchDirectoryContents(path) {
        path = path || '';
        const cacheKey = 'dir_' + (path || 'root');
        const cached = cacheGet(cacheKey);
        if (cached) return cached;

        const apiUrl = path
            ? `${API_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`
            : API_BASE;

        const res = await fetch(apiUrl);
        if (!res.ok) {
            if (res.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
            throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        cacheSet(cacheKey, data);
        return data;
    }

    async function fetchMarkdownContent(path) {
        const cacheKey = 'file_' + path;
        const cached = cacheGet(cacheKey);
        if (cached) return cached;

        const url = `${RAW_BASE}/${path.split('/').map(encodeURIComponent).join('/')}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`);

        const text = await res.text();
        cacheSet(cacheKey, text);
        return text;
    }

    // ============================================
    //  FILE TREE RENDERING
    // ============================================
    async function buildFileTree() {
        $fileTree.innerHTML = `<div class="sidebar-loading"><div class="neon-spinner"></div><p>Loading notes…</p></div>`;

        try {
            const rootItems = await fetchDirectoryContents('');
            const folders = rootItems
                .filter(item => item.type === 'dir' && !isHidden(item.name))
                .sort((a, b) => a.name.localeCompare(b.name));

            const rootFiles = rootItems
                .filter(item => item.type === 'file' && isMarkdown(item.name) && !isHidden(item.name));

            $fileTree.innerHTML = '';

            for (const folder of folders) {
                const folderEl = createFolderNode(folder.name, folder.path);
                $fileTree.appendChild(folderEl);
            }

            for (const file of rootFiles) {
                const fileEl = createFileNode(file.name, file.path);
                $fileTree.appendChild(fileEl);
            }

            buildWelcome(folders);

            if (location.hash) {
                const path = decodeURIComponent(location.hash.slice(1));
                if (path) navigateToFile(path);
            }

        } catch (err) {
            $fileTree.innerHTML = `<div class="content-error"><h2>⚠️ Error</h2><p>${escapeHtml(err.message)}</p><button onclick="location.reload()">Retry</button></div>`;
        }
    }

    function createFolderNode(name, path) {
        const el = document.createElement('div');
        el.className = 'tree-folder';
        el.dataset.path = path;
        el.dataset.name = name.toLowerCase();

        const icon = FOLDER_ICONS[name] || '📁';

        el.innerHTML = `
            <div class="tree-folder-header" data-path="${escapeHtml(path)}">
                <span class="folder-arrow">▶</span>
                <span class="folder-icon">${icon}</span>
                <span class="folder-name">${escapeHtml(name)}</span>
                <span class="folder-badge">…</span>
            </div>
            <div class="tree-folder-children" data-path="${escapeHtml(path)}"></div>
        `;

        const header = el.querySelector('.tree-folder-header');
        header.addEventListener('click', () => toggleFolder(el, path));

        return el;
    }

    async function toggleFolder(folderEl, path) {
        const header = folderEl.querySelector('.tree-folder-header');
        const children = folderEl.querySelector('.tree-folder-children');
        const isExpanded = header.classList.contains('expanded');

        if (isExpanded) {
            header.classList.remove('expanded');
            children.classList.remove('expanded');
            return;
        }

        header.classList.add('expanded');
        children.classList.add('expanded');

        if (!children.dataset.loaded) {
            children.innerHTML = `<div class="sidebar-loading" style="padding:12px"><div class="neon-spinner" style="width:20px;height:20px;border-width:2px"></div></div>`;
            try {
                const items = await fetchDirectoryContents(path);
                children.innerHTML = '';

                const subfolders = items
                    .filter(i => i.type === 'dir' && !isHidden(i.name))
                    .sort((a, b) => a.name.localeCompare(b.name));

                // Show markdown files AND other viewable files (exclude asset-only folders' binary files from listing)
                const files = items
                    .filter(i => i.type === 'file' && isMarkdown(i.name) && !isHidden(i.name))
                    .sort((a, b) => a.name.localeCompare(b.name));

                for (const sf of subfolders) {
                    children.appendChild(createFolderNode(sf.name, sf.path));
                }

                for (const f of files) {
                    children.appendChild(createFileNode(f.name, f.path));
                }

                const badge = header.querySelector('.folder-badge');
                if (badge) badge.textContent = files.length + subfolders.length;

                if (files.length === 0 && subfolders.length === 0) {
                    children.innerHTML = `<div style="padding:8px 28px;font-size:12px;color:var(--text-muted);">No markdown files</div>`;
                }

                children.dataset.loaded = 'true';
                folderDataCache[path] = { files, subfolders };
                updateWelcomeBadge(path, files.length);

            } catch (err) {
                children.innerHTML = `<div style="padding:8px 28px;font-size:12px;color:var(--neon-magenta);">Failed to load</div>`;
            }
        }
    }

    function createFileNode(name, path) {
        const el = document.createElement('div');
        el.className = 'tree-file';
        el.dataset.path = path;
        el.dataset.name = name.toLowerCase();

        el.innerHTML = `
            <span class="file-icon">📄</span>
            <span class="file-name" title="${escapeHtml(name)}">${escapeHtml(formatFileName(name))}</span>
        `;

        el.addEventListener('click', () => navigateToFile(path));
        return el;
    }

    async function expandToPath(path) {
        const parts = path.split('/');
        let current = '';
        for (let i = 0; i < parts.length - 1; i++) {
            current = current ? current + '/' + parts[i] : parts[i];
            const folderEl = $fileTree.querySelector(`.tree-folder[data-path="${CSS.escape(current)}"]`);
            if (folderEl) {
                const header = folderEl.querySelector('.tree-folder-header');
                if (!header.classList.contains('expanded')) {
                    await toggleFolder(folderEl, current);
                }
            }
        }
    }

    // ============================================
    //  FILE NAVIGATION
    // ============================================
    async function navigateToFile(path) {
        if (!isMarkdown(path)) return;
        currentFilePath = path;
        location.hash = encodeURIComponent(path);

        document.querySelectorAll('.tree-file.active').forEach(el => el.classList.remove('active'));
        const fileEl = $fileTree.querySelector(`.tree-file[data-path="${CSS.escape(path)}"]`);
        if (fileEl) {
            fileEl.classList.add('active');
        } else {
            await expandToPath(path);
            const el2 = $fileTree.querySelector(`.tree-file[data-path="${CSS.escape(path)}"]`);
            if (el2) el2.classList.add('active');
        }

        updateBreadcrumb(path);

        $welcome.style.display = 'none';
        $markdownBody.innerHTML = `<div class="content-loading"><div class="neon-spinner"></div><p>Loading note…</p></div>`;
        $docMeta.style.display = 'none';
        $tocToggle.style.display = 'none';

        try {
            const markdown = await fetchMarkdownContent(path);

            // Render markdown (the custom renderer handles image/link rewriting)
            const html = marked.parse(markdown);
            $markdownBody.innerHTML = `<div class="fade-in">${html}</div>`;

            // Post-process: add copy buttons, highlight code
            addCodeBlockHeaders();
            hljs.highlightAll();
            buildTOC();
            $content.scrollTop = 0;
            window.scrollTo(0, 0);

            $readingTime.textContent = estimateReadingTime(markdown);
            $docMeta.style.display = 'flex';
            $tocToggle.style.display = 'block';

            closeSidebar();

        } catch (err) {
            $markdownBody.innerHTML = `
                <div class="content-error">
                    <h2>⚠️ Failed to load</h2>
                    <p>${escapeHtml(err.message)}</p>
                    <button onclick="location.reload()">Retry</button>
                </div>`;
        }
    }

    // ============================================
    //  BREADCRUMB
    // ============================================
    function updateBreadcrumb(path) {
        const parts = path.split('/');
        let html = `<span class="crumb" data-path="">🏠 Home</span>`;
        let cumulative = '';

        for (let i = 0; i < parts.length; i++) {
            cumulative = cumulative ? cumulative + '/' + parts[i] : parts[i];
            html += `<span class="crumb-sep">›</span>`;
            if (i === parts.length - 1) {
                html += `<span class="crumb-active">${escapeHtml(formatFileName(parts[i]))}</span>`;
            } else {
                html += `<span class="crumb" data-path="${escapeHtml(cumulative)}">${escapeHtml(parts[i])}</span>`;
            }
        }

        $breadcrumb.innerHTML = html;

        $breadcrumb.querySelectorAll('.crumb').forEach(crumb => {
            crumb.addEventListener('click', () => {
                const p = crumb.dataset.path;
                if (!p) {
                    showWelcome();
                }
            });
        });
    }

    function showWelcome() {
        currentFilePath = null;
        location.hash = '';
        $markdownBody.innerHTML = '';
        $markdownBody.appendChild($welcome);
        $welcome.style.display = 'block';
        $breadcrumb.innerHTML = '';
        $docMeta.style.display = 'none';
        $tocToggle.style.display = 'none';
        $tocPanel.classList.add('toc-hidden');
        document.querySelectorAll('.tree-file.active').forEach(el => el.classList.remove('active'));
    }

    // ============================================
    //  CODE BLOCK ENHANCEMENTS
    // ============================================
    function addCodeBlockHeaders() {
        $markdownBody.querySelectorAll('pre').forEach(pre => {
            // Skip if header already added
            if (pre.previousElementSibling && pre.previousElementSibling.classList.contains('code-block-header')) return;

            const code = pre.querySelector('code');
            if (!code) return;

            let lang = '';
            code.classList.forEach(cls => {
                const match = cls.match(/^(language-|hljs-)(.+)/);
                if (match) lang = match[2];
            });

            const header = document.createElement('div');
            header.className = 'code-block-header';
            header.innerHTML = `
                <span>${escapeHtml(lang || 'code')}</span>
                <button class="copy-btn" title="Copy code">📋 Copy</button>
            `;

            const copyBtn = header.querySelector('.copy-btn');
            copyBtn.addEventListener('click', () => {
                const text = code.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = '✅ Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = '📋 Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(() => {
                    copyBtn.textContent = '❌ Failed';
                    setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
                });
            });

            pre.parentNode.insertBefore(header, pre);
        });
    }

    // ============================================
    //  TABLE OF CONTENTS
    // ============================================
    function buildTOC() {
        const headings = $markdownBody.querySelectorAll('h1, h2, h3');
        if (headings.length === 0) {
            $tocToggle.style.display = 'none';
            return;
        }

        $tocList.innerHTML = '';

        headings.forEach((h, i) => {
            const id = 'heading-' + i;
            h.id = id;

            const item = document.createElement('a');
            item.className = `toc-item toc-${h.tagName.toLowerCase()}`;
            item.textContent = h.textContent;
            item.href = '#' + id;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                $tocPanel.classList.add('toc-hidden');
            });

            $tocList.appendChild(item);
        });
    }

    // ============================================
    //  WELCOME SCREEN
    // ============================================
    function buildWelcome(folders) {
        $subjectsOverview.innerHTML = '';

        for (const folder of folders) {
            const icon = FOLDER_ICONS[folder.name] || '📁';
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.dataset.path = folder.path;
            card.innerHTML = `
                <div class="card-icon">${icon}</div>
                <div class="card-title">${escapeHtml(folder.name)}</div>
                <div class="card-count" data-folder="${escapeHtml(folder.path)}">Click to explore</div>
            `;
            card.addEventListener('click', async () => {
                const folderEl = $fileTree.querySelector(`.tree-folder[data-path="${CSS.escape(folder.path)}"]`);
                if (folderEl) {
                    const header = folderEl.querySelector('.tree-folder-header');
                    if (!header.classList.contains('expanded')) {
                        await toggleFolder(folderEl, folder.path);
                    }
                    folderEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                openSidebar();
            });
            $subjectsOverview.appendChild(card);
        }

        // Pre-fetch folder counts
        folders.forEach(folder => {
            fetchDirectoryContents(folder.path).then(items => {
                const mdCount = items.filter(i => i.type === 'file' && isMarkdown(i.name) && !isHidden(i.name)).length;
                const subCount = items.filter(i => i.type === 'dir' && !isHidden(i.name)).length;
                updateWelcomeBadge(folder.path, mdCount, subCount);
            }).catch(() => {});
        });
    }

    function updateWelcomeBadge(folderPath, fileCount, subfolderCount) {
        const badge = $subjectsOverview.querySelector(`[data-folder="${CSS.escape(folderPath)}"]`);
        if (badge) {
            let text = `${fileCount} note${fileCount !== 1 ? 's' : ''}`;
            if (subfolderCount) text += ` · ${subfolderCount} subfolder${subfolderCount !== 1 ? 's' : ''}`;
            badge.textContent = text;
        }
        const sidebarBadge = $fileTree.querySelector(`.tree-folder[data-path="${CSS.escape(folderPath)}"] .folder-badge`);
        if (sidebarBadge && sidebarBadge.textContent === '…') {
            sidebarBadge.textContent = fileCount;
        }
    }

    // ============================================
    //  SEARCH
    // ============================================
    function handleSearch(query) {
        const q = query.toLowerCase().trim();

        if (!q) {
            $fileTree.querySelectorAll('.tree-folder, .tree-file').forEach(el => {
                el.classList.remove('hidden');
            });
            return;
        }

        $fileTree.querySelectorAll('.tree-folder').forEach(folder => {
            const folderName = folder.dataset.name || '';
            const children = folder.querySelector('.tree-folder-children');
            let hasMatch = folderName.includes(q);

            if (children && children.dataset.loaded) {
                folder.querySelectorAll('.tree-file').forEach(file => {
                    const fileName = file.dataset.name || '';
                    if (fileName.includes(q)) {
                        file.classList.remove('hidden');
                        hasMatch = true;
                    } else {
                        file.classList.add('hidden');
                    }
                });

                if (hasMatch) {
                    const header = folder.querySelector('.tree-folder-header');
                    if (!header.classList.contains('expanded')) {
                        header.classList.add('expanded');
                        children.classList.add('expanded');
                    }
                }
            }

            if (hasMatch || folderName.includes(q)) {
                folder.classList.remove('hidden');
            } else {
                folder.classList.add('hidden');
            }
        });

        $fileTree.querySelectorAll(':scope > .tree-file').forEach(file => {
            const fileName = file.dataset.name || '';
            if (fileName.includes(q)) {
                file.classList.remove('hidden');
            } else {
                file.classList.add('hidden');
            }
        });
    }

    // ============================================
    //  SCROLL HANDLING
    // ============================================
    function updateScrollProgress() {
        requestAnimationFrame(() => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            $scrollProgress.style.width = progress + '%';

            if (scrollTop > 400) {
                $scrollTop.style.display = 'flex';
            } else {
                $scrollTop.style.display = 'none';
            }
        });
    }

    // ============================================
    //  SIDEBAR MOBILE
    // ============================================
    function openSidebar() {
        $sidebar.classList.add('open');
    }

    function closeSidebar() {
        $sidebar.classList.remove('open');
    }

    // ============================================
    //  FONT SIZE
    // ============================================
    function setFontSize(size) {
        currentFontSize = Math.max(MIN_FONT, Math.min(MAX_FONT, size));
        document.documentElement.style.setProperty('--content-font-size', currentFontSize + 'px');
    }

    // ============================================
    //  EVENT LISTENERS
    // ============================================
    function initEvents() {
        $searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                handleSearch($searchInput.value);
            }, 200);
        });

        window.addEventListener('scroll', updateScrollProgress, { passive: true });

        $scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        $tocToggle.addEventListener('click', () => {
            $tocPanel.classList.toggle('toc-hidden');
        });

        $tocClose.addEventListener('click', () => {
            $tocPanel.classList.add('toc-hidden');
        });

        $sidebarToggle.addEventListener('click', () => {
            if ($sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        $sidebarOverlay.addEventListener('click', closeSidebar);

        $fontDecrease.addEventListener('click', () => setFontSize(currentFontSize - FONT_STEP));
        $fontIncrease.addEventListener('click', () => setFontSize(currentFontSize + FONT_STEP));
        $fontReset.addEventListener('click', () => setFontSize(DEFAULT_FONT_SIZE));

        $fullscreenToggle.addEventListener('click', () => {
            document.body.classList.toggle('fullscreen');
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                $searchInput.focus();
                $searchInput.select();
            }

            if (e.key === 'Escape') {
                $tocPanel.classList.add('toc-hidden');
                if (document.body.classList.contains('fullscreen')) {
                    document.body.classList.remove('fullscreen');
                }
                closeSidebar();
                $searchInput.blur();
            }
        });

        window.addEventListener('hashchange', () => {
            const path = decodeURIComponent(location.hash.slice(1));
            if (path && path !== currentFilePath) {
                navigateToFile(path);
            } else if (!path) {
                showWelcome();
            }
        });
    }

    // ============================================
    //  INITIALIZATION
    // ============================================
    function init() {
        initEvents();
        buildFileTree();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const nodeDir = path.resolve(scriptDir, '..');
const projectDir = path.join(nodeDir, 'projects', 'campus-store-api');
const expectedLessonPlanHash = '42d0f72c98e009ec664faa7e30e9a42a0a9120f0c7231da23bc2d68bda2ad82d';
const requiredStoryHeadings = [
  '### Story So Far',
  '### Today’s Project Level',
  '### Guided Upgrade',
  '### Completed Level',
  '### Use This in Your Assigned Project',
  '### Next Level',
];

const errors = [];
function fail(message) {
  errors.push(message);
}

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function listFiles(root) {
  const files = [];
  function visit(directory, prefix = '') {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute, relative);
      else files.push(relative);
    }
  }
  visit(root);
  return files.sort();
}

function listFolders(root) {
  const folders = [];
  function visit(directory, prefix = '') {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      folders.push(relative);
      visit(path.join(directory, entry.name), relative);
    }
  }
  visit(root);
  return folders.sort();
}

function sameRecord(left = {}, right = {}) {
  return JSON.stringify(Object.entries(left).sort()) === JSON.stringify(Object.entries(right).sort());
}

const lessonPlanPath = path.join(nodeDir, 'lesson-plan.md');
if (sha256(lessonPlanPath) !== expectedLessonPlanHash) {
  fail('NodeJS/lesson-plan.md changed. Restore it to the protected source-of-truth version.');
}

const notes = fs.readdirSync(nodeDir)
  .filter(name => /^Day\d+-.*\.md$/.test(name))
  .sort((left, right) => Number(left.match(/\d+/)[0]) - Number(right.match(/\d+/)[0]));

if (notes.length !== 25) fail(`Expected 25 daily notes, found ${notes.length}.`);

for (const noteName of notes) {
  const day = Number(noteName.match(/^Day(\d+)/)[1]);
  const markdown = fs.readFileSync(path.join(nodeDir, noteName), 'utf8');
  for (const heading of requiredStoryHeadings) {
    if (!markdown.includes(heading)) fail(`${noteName} is missing "${heading}".`);
  }
  const storyMatches = markdown.match(/^## Campus Store Storyline Project - Level \d+$/gm) || [];
  if (storyMatches.length !== 1) fail(`${noteName} must contain exactly one storyline project section.`);
  const story = markdown.slice(markdown.indexOf(storyMatches[0]));
  if (day > 1 && story.includes('For Level 1, create a new folder')) {
    fail(`${noteName} contains the Day 1 creation instruction in a later checkpoint.`);
  }
  const actionRows = [...story.matchAll(/^\| (Create|Edit|Replace|Delete|Keep|Review|Generate|Regenerate) \| `([^`]+)` \|/gm)];
  for (const [, action, filePath] of actionRows) {
    if (!story.includes(`— ${action} \`${filePath}\``)) {
      fail(`${noteName} does not provide a guided step for ${action} ${filePath}.`);
    }
  }
  const guidedCodeBlocks = [...story.matchAll(/^~~~([a-z0-9_-]+)\n/gm)];
  for (const block of guidedCodeBlocks) {
    const precedingText = story.slice(Math.max(0, block.index - 180), block.index);
    if (!/\*\*File: `[^`]+`\*\*\s*$/.test(precedingText)) {
      fail(`${noteName} has a Guided Upgrade code block without an exact file path immediately before it.`);
    }
    const closingFence = story.indexOf('\n~~~', block.index + block[0].length);
    const followingText = closingFence === -1 ? '' : story.slice(closingFence + 4, closingFence + 220);
    if (!followingText.includes('This is the complete Level')) {
      fail(`${noteName} has a Guided Upgrade code block without an immediate explanation.`);
    }
  }

  const normalizedHeadings = [...markdown.matchAll(/^## \d+\. (.+)$/gm)]
    .map(match => match[1].trim().toLowerCase());
  const duplicates = normalizedHeadings.filter((heading, index) =>
    normalizedHeadings.indexOf(heading) !== index);
  if (duplicates.length) fail(`${noteName} repeats numbered heading "${duplicates[0]}".`);

  if (/\bstudents?\b/i.test(markdown)) {
    fail(`${noteName} refers to "student"; the instructor convention requires direct reader language.`);
  }
  if (/localhost:3000|PORT=3000|node --watch|module\.exports|docker compose (up|down)/.test(markdown)) {
    fail(`${noteName} contains a conflicting project convention.`);
  }

  if (day < 25) {
    const next = notes.find(name => Number(name.match(/^Day(\d+)/)[1]) === day + 1);
    if (!markdown.includes(`(<${next}>)`)) fail(`${noteName} does not link to Day ${day + 1}.`);
  }
}

const manifestPath = path.join(projectDir, 'snapshots.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail('Snapshot manifest schemaVersion must be 1.');
if (manifest.days?.length !== 25) fail('Snapshot manifest must contain 25 days.');

for (const checkpoint of manifest.days || []) {
  const root = path.join(projectDir, `day-${String(checkpoint.day).padStart(2, '0')}`);
  if (!fs.existsSync(root)) {
    fail(`Day ${checkpoint.day} snapshot folder is missing.`);
    continue;
  }
  const actualFiles = listFiles(root);
  const manifestFiles = checkpoint.files.map(file => file.path).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(manifestFiles)) {
    fail(`Day ${checkpoint.day} snapshot files do not match snapshots.json.`);
  }
  if (JSON.stringify(listFolders(root)) !== JSON.stringify(checkpoint.folders || [])) {
    fail(`Day ${checkpoint.day} snapshot folders do not match snapshots.json.`);
  }
  for (const file of checkpoint.files) {
    const actualSize = fs.statSync(path.join(root, file.path)).size;
    if (actualSize !== file.size) fail(`Day ${checkpoint.day} has an incorrect size for ${file.path}.`);
  }
  if (checkpoint.day === 1 && actualFiles.join('|') !== 'app.js') {
    fail('Day 1 must contain only the introductory app.js file.');
  }
  if (checkpoint.day >= 2 && !actualFiles.includes('package-lock.json')) {
    fail(`Day ${checkpoint.day} is missing package-lock.json.`);
  }

  if (checkpoint.day >= 2) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
    const lockedRoot = lock.packages?.[''] || {};
    if (!sameRecord(packageJson.dependencies, lockedRoot.dependencies)) {
      fail(`Day ${checkpoint.day} package-lock runtime dependencies do not match package.json.`);
    }
    if (!sameRecord(packageJson.devDependencies, lockedRoot.devDependencies)) {
      fail(`Day ${checkpoint.day} package-lock development dependencies do not match package.json.`);
    }
  }
}

const dependencyIntroductions = [
  [2, 'dependencies', 'dotenv'],
  [2, 'devDependencies', 'nodemon'],
  [4, 'dependencies', 'express'],
  [10, 'dependencies', 'pg'],
  [11, 'dependencies', '@prisma/adapter-pg'],
  [11, 'dependencies', '@prisma/client'],
  [11, 'devDependencies', 'prisma'],
  [12, 'dependencies', 'zod'],
  [14, 'dependencies', 'bcrypt'],
  [14, 'dependencies', 'jsonwebtoken'],
  [17, 'dependencies', 'multer'],
  [18, 'dependencies', 'swagger-jsdoc'],
  [18, 'dependencies', 'swagger-ui-express'],
  [19, 'dependencies', 'cors'],
  [19, 'dependencies', 'helmet'],
  [19, 'dependencies', 'express-rate-limit'],
  [20, 'dependencies', 'morgan'],
  [20, 'dependencies', 'winston'],
  [21, 'devDependencies', 'jest'],
  [21, 'devDependencies', 'supertest'],
];

for (const [introducedDay, group, dependency] of dependencyIntroductions) {
  for (const checkpoint of manifest.days.filter(day => day.day >= 2)) {
    const packageJson = JSON.parse(fs.readFileSync(
      path.join(projectDir, `day-${String(checkpoint.day).padStart(2, '0')}`, 'package.json'),
      'utf8',
    ));
    const exists = Boolean(packageJson[group]?.[dependency]);
    if (checkpoint.day < introducedDay && exists) {
      fail(`${dependency} appears on Day ${checkpoint.day}, before its Day ${introducedDay} lesson.`);
    }
    if (checkpoint.day >= introducedDay && !exists) {
      fail(`${dependency} is missing from Day ${checkpoint.day} after its introduction.`);
    }
  }
}

const introducedFiles = [
  [2, 'src/server.js'],
  [3, 'docs/api-plan.md'],
  [6, 'src/middlewares/requestLogger.js'],
  [7, 'src/controllers/productController.js'],
  [8, 'src/middlewares/fileLogger.js'],
  [9, 'docker-compose.yaml'],
  [11, 'prisma/schema.prisma'],
  [12, 'src/schemas/productSchemas.js'],
  [13, 'src/routes/userRoutes.js'],
  [14, 'src/routes/authRoutes.js'],
  [15, 'src/middlewares/authorize.js'],
  [17, 'src/middlewares/uploadProductImage.js'],
  [18, 'src/config/swagger.js'],
  [19, 'src/config/security.js'],
  [20, 'src/config/logger.js'],
  [21, 'src/app.js'],
  [21, 'tests/health.test.js'],
  [22, 'Dockerfile'],
  [23, 'render.yaml'],
  [24, 'src/routes/orderRoutes.js'],
  [25, 'README.md'],
];

for (const [introducedDay, filePath] of introducedFiles) {
  for (const checkpoint of manifest.days) {
    const exists = checkpoint.files.some(file => file.path === filePath);
    if (checkpoint.day < introducedDay && exists) {
      fail(`${filePath} appears on Day ${checkpoint.day}, before its Day ${introducedDay} lesson.`);
    }
    if (checkpoint.day >= introducedDay && !exists) {
      fail(`${filePath} is missing from Day ${checkpoint.day} after its introduction.`);
    }
  }
}

for (const checkpoint of manifest.days) {
  const hasRawPool = checkpoint.files.some(file => file.path === 'src/db/pool.js');
  if (hasRawPool !== (checkpoint.day === 10)) {
    fail('src/db/pool.js must exist only on Day 10 before Prisma replaces it.');
  }
}

for (const javaScriptFile of listFiles(projectDir).filter(file => file.endsWith('.js'))) {
  execFileSync(process.execPath, ['--check', path.join(projectDir, javaScriptFile)], {
    stdio: 'pipe',
  });
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Campus Store course validation passed.');
console.log('Protected lesson plan, 25 notes, 25 snapshots, manifest, sequencing, and JavaScript syntax are valid.');

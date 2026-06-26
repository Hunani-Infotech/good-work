/**
 * Remove unused files under public/assets.
 * Keeps files referenced from src/ plus CSS/font dependency chains.
 * Run: node scripts/prune-public-assets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'public/assets');

const SKIP_DIRS = new Set(['node_modules', 'dist', 'legacy', '.git']);

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else files.push(full);
  }
  return files;
}

function scanSources(dir, refs = new Set()) {
  if (!fs.existsSync(dir)) return refs;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      scanSources(full, refs);
    } else if (/\.(js|jsx|ts|tsx|scss|css|html|json|mjs|md)$/.test(entry.name)) {
      const text = fs.readFileSync(full, 'utf8');
      const assetRoots = new Set();
      const rootRe = /const\s+[A-Z]\s*=\s*['"](\/assets\/[^'"]+)['"]/g;
      let rm;
      while ((rm = rootRe.exec(text)) !== null) assetRoots.add(rm[1]);

      const patterns = [
        /\/assets\/[A-Za-z0-9_./-]+/g,
        /['"]assets\/[A-Za-z0-9_./-]+['"]/g,
        /\$\{A\}\/[A-Za-z0-9_./-]+/g,
      ];
      for (const re of patterns) {
        let m;
        while ((m = re.exec(text)) !== null) {
          let raw = m[0].replace(/^['"]|['"]$/g, '');
          if (raw.startsWith('${A}/')) raw = raw.replace('${A}', [...assetRoots][0] ?? '/assets/isak/images');
          const normalized = raw.startsWith('/') ? raw.slice(1) : raw;
          if (normalized.startsWith('assets/')) refs.add(normalized);
        }
      }
    }
  }
  return refs;
}

function toAssetPath(ref) {
  const clean = ref.replace(/^\/+/, '');
  return path.join(ROOT, 'public', clean);
}

function resolveUrlsFromCss(cssPath, used) {
  const text = fs.readFileSync(cssPath, 'utf8');
  const dir = path.dirname(cssPath);
  const urlRe = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
  let m;
  while ((m = urlRe.exec(text)) !== null) {
    let target = m[1].split('?')[0].split('#')[0].trim();
    if (!target || target.startsWith('data:') || /^https?:/i.test(target)) continue;
    const resolved = path.normalize(path.join(dir, target));
    if (resolved.startsWith(ASSETS) && fs.existsSync(resolved)) {
      const rel = path.relative(path.join(ROOT, 'public'), resolved).replace(/\\/g, '/');
      if (!used.has(rel)) {
        used.add(rel);
        if (resolved.endsWith('.css')) resolveUrlsFromCss(resolved, used);
      }
    }
  }
  const importRe = /@import\s+url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
  while ((m = importRe.exec(text)) !== null) {
    let target = m[1].split('?')[0].split('#')[0].trim();
    if (!target || /^https?:/i.test(target)) continue;
    const resolved = path.normalize(path.join(dir, target));
    if (resolved.startsWith(ASSETS) && fs.existsSync(resolved)) {
      const rel = path.relative(path.join(ROOT, 'public'), resolved).replace(/\\/g, '/');
      if (!used.has(rel)) {
        used.add(rel);
        resolveUrlsFromCss(resolved, used);
      }
    }
  }
}

const entryRefs = scanSources(ROOT);
const used = new Set();

for (const ref of entryRefs) {
  const filePath = toAssetPath(ref);
  if (!fs.existsSync(filePath)) continue;
  used.add(ref);
  if (filePath.endsWith('.css')) resolveUrlsFromCss(filePath, used);
}

const allFiles = walkFiles(ASSETS);
const toDelete = allFiles.filter((file) => {
  const rel = path.relative(path.join(ROOT, 'public'), file).replace(/\\/g, '/');
  return !used.has(rel);
});

console.log(`Used: ${used.size} files`);
console.log(`Deleting: ${toDelete.length} files`);

for (const file of toDelete) {
  fs.unlinkSync(file);
}

function pruneEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) pruneEmptyDirs(path.join(dir, entry.name));
  }
  if (dir !== ASSETS && fs.readdirSync(dir).length === 0) {
    try {
      fs.rmdirSync(dir);
    } catch {
      // Windows may lock empty dirs briefly — safe to ignore.
    }
  }
}

pruneEmptyDirs(ASSETS);

const remaining = walkFiles(ASSETS);
console.log(`Remaining: ${remaining.length} files`);
for (const rel of [...used].sort()) console.log(`  keep: ${rel}`);

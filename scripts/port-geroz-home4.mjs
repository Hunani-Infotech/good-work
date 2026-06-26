/**
 * Port Geroz home-4 from Next.js template into GoodWork Vite app.
 * Run: node scripts/port-geroz-home4.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(
  'C:/Users/Hunani Infotech/Downloads/geroz-creative-personal-portfolio-nextjs-template-2026-05-24-18-54-02-utc/geroz-nextjs'
);
const DEST = path.join(ROOT, 'src/geroz');

const COMPONENT_FILES = [
  'components/about/AboutSection4.tsx',
  'components/cta/CtaSection3.tsx',
  'components/expert/ExpertSection.tsx',
  'components/hero/HeroSection4.tsx',
  'components/video/VideoSection.tsx',
  'components/modal/VideoModal.tsx',
  'components/utils/BackToTopBtn.tsx',
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function toRelativeImport(fromFile, targetPath) {
  const rel = path.relative(path.dirname(fromFile), targetPath).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function rewriteImports(content, destFile) {
  const gerozRoot = path.join(DEST);
  const contextPath = path.join(gerozRoot, 'context/GerozContext.jsx');
  const dataPath = path.join(gerozRoot, 'data/home4Data.js');
  const actionsPath = path.join(gerozRoot, 'utils/formActions.js');

  let out = content;

  out = out.replace(/from ["']@\/context\/context["']/g, () =>
    `from '${toRelativeImport(destFile, contextPath)}'`
  );
  out = out.replace(/from ["']@\/data["']/g, () =>
    `from '${toRelativeImport(destFile, dataPath)}'`
  );
  out = out.replace(/from ["']@\/actions\/formActions["']/g, () =>
    `from '${toRelativeImport(destFile, actionsPath)}'`
  );

  out = out.replace(
    /from ["']@\/components\/([^"']+)["']/g,
    (_, sub) => {
      const target = path.join(gerozRoot, 'components', `${sub}.tsx`);
      const jsxTarget = path.join(gerozRoot, 'components', `${sub}.jsx`);
      const resolved = fs.existsSync(target) || fs.existsSync(jsxTarget)
        ? toRelativeImport(destFile, path.join(gerozRoot, 'components', sub))
        : toRelativeImport(destFile, path.join(gerozRoot, 'components', sub));
      return `from '${resolved}.jsx'`;
    }
  );

  return out;
}

function transformTsxToJsx(content, destFile) {
  let out = content;

  out = out.replace(/^["']use client["'];\s*/gm, '');
  out = out.replace(/^["']use server["'];\s*/gm, '');
  out = out.replace(/import type \{[^}]+\} from [^;]+;\s*/g, '');
  out = out.replace(/import type [^;]+;\s*/g, '');
  out = out.replace(/export const metadata[\s\S]*?};\s*/g, '');

  out = out.replace(/import Image from ["']next\/image["'];\s*/g, '');
  out = out.replace(/import Link from ["']next\/link["'];\s*/g, "import { Link } from 'react-router-dom';\n");

  out = out.replace(
    /<Image\s+([^>]*?)\/>/gs,
    (match, attrs) => {
      const width = attrs.match(/width=\{(\d+)\}/)?.[1];
      const height = attrs.match(/height=\{(\d+)\}/)?.[1];
      let rest = attrs
        .replace(/width=\{\d+\}\s*/g, '')
        .replace(/height=\{\d+\}\s*/g, '');
      if (width) rest += ` width="${width}"`;
      if (height) rest += ` height="${height}"`;
      return `<img ${rest.trim()} />`;
    }
  );

  out = out.replace(
    /import dynamic from ["']next\/dynamic["'];\s*[\s\S]*?const (\w+) = dynamic\(\(\) => import\(["']\.\/([^"']+)["']\),[\s\S]*?\);\s*/g,
    "import $1 from './$2.jsx';\n"
  );

  out = out.replace(/interface \w+Props[\s\S]*?\}\s*/g, '');
  out = out.replace(/interface Props[\s\S]*?\}\s*/g, '');
  out = out.replace(/interface \w+[\s\S]*?\}\s*/g, '');
  out = out.replace(/: React\.FC<\w+>/g, '');
  out = out.replace(/: ReactNode/g, '');
  out = out.replace(/: React\.ReactNode/g, '');
  out = out.replace(/: MouseEvent/g, '');
  out = out.replace(/: Event/g, '');
  out = out.replace(/: HTMLElement/g, '');
  out = out.replace(/: Element/g, '');
  out = out.replace(/: HTMLDivElement/g, '');
  out = out.replace(/: HTMLFormElement/g, '');
  out = out.replace(/: HTMLHeadingElement/g, '');
  out = out.replace(/: HTMLInputElement \| HTMLTextAreaElement/g, '');
  out = out.replace(/: string/g, '');
  out = out.replace(/: boolean/g, '');
  out = out.replace(/: number/g, '');
  out = out.replace(/<FormResult>/g, '');
  out = out.replace(/useRef<[^>]+>/g, 'useRef');
  out = out.replace(/useState<[^>]+>/g, 'useState');
  out = out.replace(/Array<[^>]+>/g, 'Array');

  out = rewriteImports(out, destFile);

  return out;
}

function copyComponent(relPath) {
  const srcFile = path.join(SRC, 'src', relPath);
  const destFile = path.join(DEST, relPath.replace(/\.tsx$/, '.jsx'));
  const raw = fs.readFileSync(srcFile, 'utf8');
  const transformed = transformTsxToJsx(raw, destFile);
  ensureDir(destFile);
  fs.writeFileSync(destFile, transformed);
  console.log('  component:', relPath);
}

function copyStyles() {
  const styleSrc = path.join(SRC, 'src/styles');
  const styleDest = path.join(DEST, 'styles');
  fs.cpSync(styleSrc, styleDest, { recursive: true });
  console.log('  styles copied');
}

function copyPublicAssets() {
  const vendorDest = path.join(ROOT, 'public/assets/geroz');
  fs.mkdirSync(vendorDest, { recursive: true });
  fs.copyFileSync(
    path.join(SRC, 'src/styles/css/bootstrap.min.css'),
    path.join(vendorDest, 'bootstrap.min.css')
  );
  fs.copyFileSync(
    path.join(SRC, 'src/styles/css/font-awesome.css'),
    path.join(vendorDest, 'font-awesome.css')
  );

  const fontsSrc = path.join(SRC, 'src/styles/fonts');
  if (fs.existsSync(fontsSrc)) {
    fs.cpSync(fontsSrc, path.join(vendorDest, 'fonts'), { recursive: true });
  }
  console.log('  public assets copied');
}

function extractData() {
  const indexSrc = fs.readFileSync(path.join(SRC, 'src/data/index.ts'), 'utf8');
  const names = [
    'casesData',
  ];

  const blocks = names.map((name) => {
    const re = new RegExp(`const ${name} = \\[[\\s\\S]*?\\n\\];`);
    const match = indexSrc.match(re);
    if (!match) throw new Error(`Missing data block: ${name}`);
    return match[0];
  });

  const out = `${blocks.join('\n\n')}\n\nexport {\n  ${names.join(',\n  ')},\n};\n`;
  const destFile = path.join(DEST, 'data/home4Data.js');
  ensureDir(destFile);
  fs.writeFileSync(destFile, out);
  console.log('  data extracted');
}

console.log('Porting Geroz home-4...');
fs.rmSync(DEST, { recursive: true, force: true });
COMPONENT_FILES.forEach(copyComponent);
copyStyles();
copyPublicAssets();
console.log('Done.');

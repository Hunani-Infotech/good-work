import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const workHtml = fs.readFileSync(path.join(root, '../test/work.html'), 'utf8');

const navItems = [];
const navRegex = /<a href="#([^"]+)"[^>]*>[\s\S]*?<div>([^<]+)<\/div><img[^>]+src="([^"]+)"/g;
let navMatch;
while ((navMatch = navRegex.exec(workHtml)) !== null) {
  navItems.push({ id: navMatch[1], navLabel: navMatch[2].trim(), navThumb: navMatch[3] });
}

const projects = [];
const blocks = workHtml.split(/<div id="([^"]+)" class="main-project-wrapper">/).slice(1);

for (let i = 0; i < blocks.length; i += 2) {
  const id = blocks[i];
  const block = blocks[i + 1] || '';
  const titleMatch = block.match(/<h3 class="headline-project">([\s\S]*?)<\/h3>/);
  const yearMatch = block.match(/<div class="pill-year">([^<]+)<\/div>/);
  const challengeMatch = block.match(/Challenge:<\/p>\s*<p class="body-copy black">([\s\S]*?)<\/p>/);
  const roleMatch = block.match(/Role:<\/p>\s*<p class="body-copy black">([\s\S]*?)<\/p>/);
  const liveMatch = block.match(/cont-cta-work[\s\S]*?href="(https?:[^"]+)"/);
  const services = [...block.matchAll(/<div class="pill-service">([^<]+)<\/div>/g)].map((x) => x[1]);
  const galleryMatch = block.match(/class="cont-project-imgs ([^"]+)"/);
  const titleHtml = titleMatch ? titleMatch[1].trim() : '';
  const titleParts = titleHtml.split(/<br\s*\/?>/i).map((s) => s.replace(/&amp;/g, '&').trim());
  const nav = navItems.find((n) => n.id === id) || { navLabel: titleParts[0], navThumb: '' };

  const mediaHtml = block.split('class="cont-project-imgs')[1] || '';
  const media = [];
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*class="img-project([^"]*)"/g;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(mediaHtml)) !== null) {
    const extra = imgMatch[2] || '';
    media.push({
      type: 'image',
      src: imgMatch[1],
      variant: extra.includes('hide') ? 'hide' : extra.includes('small') ? 'small' : 'default',
    });
  }
  const videoRegex = /<video[^>]*>[\s\S]*?<data-src src="([^"]+)"[\s\S]*?poster="([^"]+)"/g;
  let videoMatch;
  while ((videoMatch = videoRegex.exec(mediaHtml)) !== null) {
    media.push({ type: 'video', src: videoMatch[1], poster: videoMatch[2], variant: 'default' });
  }

  projects.push({
    id,
    titleLine1: titleParts[0] || '',
    titleLine2: titleParts[1] || '',
    year: yearMatch ? yearMatch[1].trim() : '',
    challenge: challengeMatch ? challengeMatch[1].replace(/&quot;/g, '"').trim() : '',
    role: roleMatch ? roleMatch[1].replace(/&quot;/g, '"').trim() : '',
    services,
    liveUrl: liveMatch ? liveMatch[1] : null,
    liveCtaLabel: liveMatch ? 'See it live' : null,
    navLabel: nav.navLabel,
    navThumb: nav.navThumb,
    galleryLayoutClass: galleryMatch ? galleryMatch[1].trim() : id,
    media,
  });
}

const out = { projects, count: projects.length };
fs.writeFileSync(path.join(root, 'src/data/projects.extracted.json'), JSON.stringify(out, null, 2));
console.log('Extracted', projects.length, 'projects');

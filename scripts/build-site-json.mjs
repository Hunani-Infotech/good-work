import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const extracted = JSON.parse(fs.readFileSync(path.join(root, 'src/data/projects.extracted.json'), 'utf8'));
const existing = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site.json'), 'utf8'));

const NAV_LABELS = {
  ampli: 'Ampli',
  'top-trader': 'Top Trader',
  maps: 'Google Maps',
  apechain: 'Ape Chain',
  alena: 'Alena App',
  googleai: 'Google AI',
  lotm: 'Yuga Labs',
  cryptopunks: 'CryptoPunks',
  'google-photos': 'Google Photos',
  rappi: 'Rappi',
  'google-shopping': 'Google Shopping',
  'dino-runner-ar': 'Google AR',
};

const projects = extracted.projects.map((p) => ({
  ...p,
  navLabel: NAV_LABELS[p.id] || p.navLabel,
}));

const site = {
  ...existing,
  work: {
    ...existing.work,
    projects,
  },
};

fs.writeFileSync(path.join(root, 'src/data/site.json'), JSON.stringify(site, null, 2));
console.log('Wrote site.json with', projects.length, 'projects');

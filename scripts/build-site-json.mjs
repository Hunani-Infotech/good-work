import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const extracted = JSON.parse(fs.readFileSync(path.join(root, 'src/data/projects.extracted.json'), 'utf8'));

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
  site: {
    brand: { firstName: 'Juan', lastName: 'Mora' },
    meta: {
      homeTitle: 'Juan Mora | Design Director - Web and Brand Design Specialist',
      workTitle: 'Work - Juan Mora | Web and Brand Design Specialist',
      description:
        'Design Director who helps companies succeed on projects like Websites & landing pages, Visual Branding, Product Design Enhancement, and Webflow & Framer Development.',
      favicon: 'https://juanmora.co/images/favicon.png',
    },
    contact: {
      email: 'juan@morable.co',
      emailDisplay: 'Juan@morable.co',
      mailtoSubjectNav: 'Hey Juan Mora!',
      mailtoSubjectFooter: 'Hey Juan!',
    },
    social: {
      nav: [
        { label: 'Email', href: 'mailto:juan@morable.co?subject=Hey%20Juan%20Mora!', external: false },
        { label: 'in', href: 'https://www.linkedin.com/in/juanmmora/', external: true },
        { label: 'x', href: 'https://x.com/ByMorable', external: true },
        { label: 'Be', href: 'https://www.behance.net/juanmora2', external: true },
      ],
      footer: [
        { label: 'Email', href: 'mailto:juan@morable.co?subject=Hey%20Juan!', external: false },
        { label: 'Linkedin', href: 'https://www.linkedin.com/in/juanmmora/', external: true },
        { label: 'X', href: 'https://x.com/ByMorable', external: true },
        { label: 'Behance', href: 'https://www.behance.net/juanmora2', external: true },
      ],
    },
    footer: {
      builtWith: ['Figma', 'Webflow', 'GSAP', 'AE/Lottie', 'Lennis Scroll'],
      tagline: 'Freelance Design Director',
      year: '2026',
      studio: 'Morable Design Studio',
      studioNote: '[Coming Soon]',
      logoSrc: 'https://picsum.photos/seed/jm36/800/600',
      video: {
        poster: 'https://juanmora.co/portfolio2025/video/juan-video-loading.jpg',
        src: 'https://juanmora.co/videos-work/desk_jm3.mp4',
      },
    },
    assets: {
      navLottie: '/documents/icon-jm.json',
      arrowGrey: 'https://juanmora.co/images/arrow-grey.svg',
      arrowGreyOut: 'https://juanmora.co/images/arrow-grey-out.svg',
      checkMark: 'https://juanmora.co/images/check-mark-icon.svg',
      videoPosterHome: 'https://juanmora.co/videos-work/juan-video-loading.jpg',
      folderFront: 'https://juanmora.co/images/folder-icon-front.png',
      folderProjects: 'https://juanmora.co/images/projects-folder.png',
      folderBack: 'https://juanmora.co/images/folder-icon-back.png',
    },
  },
  home: {
    hero: {
      heading: 'Brand & Web\nDesign Specialist',
      subtitle: 'Freelance Design Director',
      lottie: 'documents/juan-name-mouse.json',
    },
    clickScroll: {
      lines: ['16 years', 'making users', 'click and scroll my designs'],
      highlightWord: 'scroll',
      hoverWord: 'test',
      clickWord: 'click',
      scrollWord: 'scroll',
      lottie: 'documents/ll-scroll.json',
      shapes: [
        { className: 'pill-scroll', src: 'https://picsum.photos/seed/jm1/800/600', sizes: '(max-width: 729px) 100vw, 729px' },
        { className: 'circle-left-scroll', src: 'https://picsum.photos/seed/jm2/800/600', sizes: '(max-width: 661px) 100vw, 661px' },
        { className: 'hex-scroll', src: 'https://picsum.photos/seed/jm3/800/600', sizes: '(max-width: 563px) 100vw, 563px' },
        { className: 'circle-center-scroll', src: 'https://picsum.photos/seed/jm4/800/600', sizes: '(max-width: 980px) 100vw, 980px' },
        { className: 'circle-plus-scroll', src: 'https://picsum.photos/seed/jm5/800/600', sizes: '(max-width: 532px) 100vw, 532px' },
        { className: 'square-scroll', src: 'https://picsum.photos/seed/jm6/800/600', sizes: '(max-width: 607px) 100vw, 607px' },
        { className: 'blue-circle', src: 'https://picsum.photos/seed/jm7/800/600' },
        { className: 'blue-pill', src: 'https://picsum.photos/seed/jm8/800/600' },
        { className: 'blue-hex', src: 'https://picsum.photos/seed/jm9/800/600' },
      ],
    },
    services: {
      tag: 'Design Expert',
      headline: 'I help companies to succeed on projects like:',
      items: [
        {
          id: 'websites',
          title: 'Websites & Landing pages',
          description: 'Creating high-end and beautiful websites built to perform and convert.',
          media: [
            { type: 'image', src: 'https://picsum.photos/seed/jm10/800/600' },
            { type: 'video', src: 'https://juanmora.co/videos-work/home/home-ampli.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/jm11/800/600' },
            { type: 'video', src: 'https://juanmora.co/videos-work/home/home-shopping.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/jm12/800/600', hidden: true },
          ],
        },
        {
          id: 'branding',
          title: 'Visual Branding',
          description: 'Helping brands find a distinctive visual language that truly stands out.',
          media: [
            { type: 'video', src: 'https://juanmora.co/videos-work/home/home-ampli-brand.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/jm13/800/600' },
            { type: 'video', src: 'https://juanmora.co/videos-work/home/home-brudget1.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/jm14/800/600' },
            { type: 'image', src: 'https://picsum.photos/seed/jm15/800/600', hidden: true },
          ],
        },
        {
          id: 'product',
          title: 'Product Design Enhancement',
          description:
            'Bringing fresh ideas to turn complex products into intuitive experiences with an elevated visual layer.',
          media: [
            { type: 'image', src: 'https://picsum.photos/seed/jm16/800/600', hidden: true },
            { type: 'video', src: 'https://juanmora.co/videos-work/home/home-alena.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/jm17/800/600' },
            { type: 'image', src: 'https://picsum.photos/seed/jm18/800/600' },
            { type: 'video', src: 'https://juanmora.co/videos-work/home/home-apechain.mp4' },
          ],
        },
      ],
    },
    workCta: {
      topWords: ['Curious?...', 'Check', 'out', 'my'],
      bottomWords: ['Or', 'keep', 'scrolling'],
      bigText: { w: 'W', rk: 'rk' },
    },
    benefits: {
      step1: {
        line1: 'Good design',
        line2: 'takes time',
        line3: 'and working with me saves it',
        silhouette: 'https://juanmora.co/images/home-about-jm-2-p-1600.png',
      },
      step2: {
        headline1: 'Companies partner with me because of my',
        headline2: 'perspective +<br>sharp instincts',
        bullets: [
          'I bring a premium and unique visual direction that makes your brand stand out.',
          'I care about the craft, from concept to final product.',
          'I define scalable design systems that keep your brand consistent.',
          'I align your goals with my experience to make the right design decisions for your brand.',
        ],
        ctaLabel: 'Learn more about me',
        darkImage: 'https://juanmora.co/images/home-about-jm-1-p-1600.jpg',
        lightImage: 'https://juanmora.co/images/home-about-jm-3-p-1600.jpg',
      },
    },
    cta: {
      headline: "Let's build something people remember",
      subheadline: 'from global tech companies to growing startups.',
      buttonLabel: "Let's talk",
      tooltip: 'Copy my Email',
    },
  },
  work: {
    headlinePrefix: 'T--.',
    headline: 'Passionate about the craft and little details',
    folderImage: 'https://juanmora.co/images/folder-juanmora.png',
    cta: {
      headline: "If you're still here is for a good reason",
      subheadline: 'I help make your projects clear and hard to forget.',
      buttonLabel: "Let's talk",
      tooltip: 'Copy my Email',
    },
    projects,
  },
};

fs.writeFileSync(path.join(root, 'src/data/site.json'), JSON.stringify(site, null, 2));
console.log('Wrote site.json with', projects.length, 'projects');

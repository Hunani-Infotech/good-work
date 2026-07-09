/**
 * Tidal Copper template scroll animations (/cv/tidal-copper)
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollPageController } from './scrollPageBoot.js';
import { getLenis, refreshScrollTriggers } from './scrollRuntime.js';
import {
  SCROLL_REVERSE,
  initEyebrowClipReveal,
  initNarrativeWordRevealOnce,
  rollParagraphOnce,
  splitWordsSimple,
} from './gsapTextHelpers.js';

const EASE = 'power3.out';
const EASE_IO = 'power3.inOut';
const page = createScrollPageController();

function initCvScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  gsap.to(bar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0 },
  });
}

function initCvIntro(prefersReduced) {
  const hero = document.querySelector('.cv-hero-screen');
  if (!hero) return;

  const photo = hero.querySelector('.hero-photo-wrapper');
  const name = hero.querySelector('.hero-name-inner');
  const role = hero.querySelector('.hero-role');
  const scrollCue = hero.querySelector('.hero-scroll-cue');
  const orbs = hero.querySelectorAll('.orb');
  const bg = hero.querySelector('.hero-bg');

  [photo, name, role, scrollCue, ...orbs].filter(Boolean).forEach((el) => {
    gsap.set(el, { visibility: 'visible', opacity: 1 });
  });

  if (prefersReduced) {
    if (name) gsap.set(name, { y: 0 });
    if (role) gsap.set(role, { clipPath: 'inset(0 0% 0 0)' });
    return;
  }

  orbs.forEach((orb, i) => {
    gsap.fromTo(orb, { opacity: 0, scale: 0.82 }, {
      opacity: [0.5, 0.42, 0.32][i] ?? 0.4,
      scale: 1,
      duration: 1.2,
      delay: 0.1 + i * 0.1,
      ease: 'power2.out',
    });
  });

  if (photo) {
    gsap.fromTo(photo, { y: 36, scale: 0.86, opacity: 0 }, {
      y: 0, scale: 1, opacity: 1, duration: 1, delay: 0.15, ease: 'back.out(1.4)',
    });
    gsap.to(photo, {
      y: '-5vh',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 },
    });
  }

  if (name) {
    gsap.fromTo(name, { y: '110%' }, { y: 0, duration: 0.85, delay: 0.35, ease: 'back.out(1.3)' });
  }

  if (role) {
    gsap.to(role, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, delay: 0.6, ease: EASE_IO });
  }

  if (scrollCue) {
    gsap.fromTo(scrollCue, { opacity: 0, y: 10 }, { opacity: 0.7, y: 0, duration: 0.55, delay: 1 });
    gsap.to(scrollCue, { y: 6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.2 });
  }

  if (bg) {
    gsap.to(bg, {
      y: '-10vh',
      scale: 1.06,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.55 },
    });
  }
}

function initCvWhat(prefersReduced) {
  const section = document.querySelector('.cv-what-screen');
  if (!section) return;

  const panel = section.querySelector('#whatPanel');
  const header = section.querySelector('#whatHeader');
  const statement = section.querySelector('#whatStatement');
  const cta = section.querySelector('#whatCta');

  if (prefersReduced) {
    if (panel) gsap.set(panel, { opacity: 1, y: 0 });
    if (cta) gsap.set(cta, { opacity: 1, y: 0 });
    return;
  }

  if (panel) {
    gsap.to(panel, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: EASE,
      scrollTrigger: { trigger: panel, start: 'top 88%', toggleActions: SCROLL_REVERSE },
    });
  }

  if (header) {
    const words = splitWordsSimple(header, 'word');
    gsap.set(words, { y: '115%' });
    gsap.to(words, {
      y: 0,
      stagger: 0.04,
      duration: 0.75,
      ease: EASE,
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: SCROLL_REVERSE },
    });
  }

  if (statement) {
    rollParagraphOnce(statement, statement, 'top 88%', prefersReduced);
  }

  if (cta) {
    gsap.to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: EASE,
      scrollTrigger: { trigger: cta, start: 'top 90%', toggleActions: SCROLL_REVERSE },
    });
  }
}

function initCvNarrative(prefersReduced) {
  const section = document.querySelector('.cv-narrative-screen');
  if (!section) return;

  const eyebrow = section.querySelector('#narrEyebrow');
  const content = section.querySelector('.narrative-content');
  const skyline = section.querySelector('.skyline-deco');

  initEyebrowClipReveal(eyebrow, section, { start: 'top 86%', prefersReduced });

  initNarrativeWordRevealOnce(content, {
    trigger: section.querySelector('.cv-narrative-screen__inner') || section,
    start: 'top 85%',
    stagger: 0.02,
    prefersReduced,
  });

  if (skyline && !prefersReduced) {
    gsap.fromTo(skyline, { y: 40 }, {
      y: -48,
      x: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }
}

function initCvCapabilities(prefersReduced) {
  const section = document.querySelector('.cv-capabilities-screen');
  if (!section) return;

  const eyebrow = section.querySelector('#capEyebrow');
  const items = section.querySelectorAll('.cap-item');

  initEyebrowClipReveal(eyebrow, section, { start: 'top 86%', prefersReduced });

  items.forEach((item, i) => {
    const num = item.querySelector('.cap-item__num-inner');
    const text = item.querySelector('.cap-item__text-inner');

    if (prefersReduced) {
      gsap.set(item, { visibility: 'visible', opacity: 1, x: 0 });
      if (num) gsap.set(num, { y: 0 });
      if (text) gsap.set(text, { y: 0 });
      return;
    }

    gsap.set(item, { visibility: 'visible' });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: SCROLL_REVERSE },
    });

    tl.to(item, { opacity: 1, x: 0, duration: 0.75, ease: EASE }, 0)
      .to(num, { y: 0, duration: 0.55, ease: 'back.out(1.4)' }, 0.06 + i * 0.02)
      .to(text, { y: 0, duration: 0.8, ease: EASE }, 0.14 + i * 0.02);
  });
}

function initCvConnect(prefersReduced) {
  const section = document.querySelector('.cv-connect-screen');
  if (!section) return;

  const panel = section.querySelector('#connectPanel');
  const eyebrow = section.querySelector('#connectEyebrow');
  const header = section.querySelector('#connectHeader');
  const statement = section.querySelector('#connectStatement');
  const cta = section.querySelector('#connectCta');

  if (prefersReduced) {
    if (panel) gsap.set(panel, { opacity: 1, y: 0 });
    if (cta) gsap.set(cta, { opacity: 1, y: 0 });
    return;
  }

  if (panel) {
    gsap.to(panel, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: EASE,
      scrollTrigger: { trigger: panel, start: 'top 88%', toggleActions: SCROLL_REVERSE },
    });
  }

  if (eyebrow) {
    gsap.fromTo(
      eyebrow,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: EASE,
        scrollTrigger: { trigger: eyebrow, start: 'top 90%', toggleActions: SCROLL_REVERSE },
      },
    );
  }

  if (header) {
    const words = splitWordsSimple(header, 'word');
    gsap.set(words, { y: '115%' });
    gsap.to(words, {
      y: 0,
      stagger: 0.04,
      duration: 0.75,
      ease: EASE,
      scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: SCROLL_REVERSE },
    });
  }

  if (statement) {
    rollParagraphOnce(statement, statement, 'top 88%', prefersReduced);
  }

  if (cta) {
    gsap.to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      ease: EASE,
      scrollTrigger: { trigger: cta, start: 'top 90%', toggleActions: SCROLL_REVERSE },
    });
  }
}

function initCvScrollAnimations(prefersReduced) {
  initCvScrollProgress();
  initCvIntro(prefersReduced);
  initCvWhat(prefersReduced);
  initCvNarrative(prefersReduced);
  initCvCapabilities(prefersReduced);
  initCvConnect(prefersReduced);

  refreshScrollTriggers();
  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshScrollTriggers);
  }
}

export function scrollToTidalCopperConnect() {
  const target = document.getElementById('connect');
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.1 });
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function destroyTidalCopperAnimations() {
  page.destroy({ keepSiteReady: true });
}

export function initTidalCopperAnimations() {
  return page.boot({ onReady: initCvScrollAnimations });
}

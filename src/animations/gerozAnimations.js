/**
 * Geroz CV — per-section luxury animations (Lenis + GSAP ScrollTrigger).
 * Each section uses a distinct motion language for layers and text.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollPageController } from './scrollPageBoot.js';
import { getLenis, refreshScrollTriggers } from './scrollRuntime.js';
import {
  GEROZ_EASE,
  GEROZ_EASE_IO,
  GEROZ_EASE_LUX,
  GEROZ_SCROLL_TOGGLE,
  drawSvgStroke,
  initCapabilitiesShutterHover,
  revealBlurUp,
  revealChars,
  revealClipX,
  revealEyebrowPill,
  revealGoldAccent,
  revealLines,
  revealWords,
  refreshAfterImagesLoad,
  scrubParallax,
  setReducedState,
  splitCharsIntoMasks,
  splitLinesIntoMasks,
  splitWordsIntoMasks,
  wrapLineMask,
} from './gerozTextHelpers.js';

const page = createScrollPageController();
let anchorCleanup = null;
let layoutSyncHandler = null;
let capabilitiesShutterCleanup = null;

function gzScroll(trigger, start = 'top 86%') {
  return {
    trigger,
    start,
    toggleActions: GEROZ_SCROLL_TOGGLE,
    invalidateOnRefresh: true,
  };
}

const GEROZ_SCROLL_OFFSET = -72;
const GEROZ_SCROLL_EASE = (t) => Math.min(1, 1.001 - (2 ** (-10 * t)));

export function scrollGerozToHash(href) {
  if (!href?.startsWith('#')) return;
  const target = document.querySelector(href);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: GEROZ_SCROLL_OFFSET,
      duration: 1.35,
      easing: GEROZ_SCROLL_EASE,
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initGerozSmoothAnchors() {
  if (anchorCleanup) anchorCleanup();

  const links = document.querySelectorAll('.geroz-cv-main a[href^="#"]');
  const onClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || href === '#') return;
    if (!document.querySelector(href)) return;

    event.preventDefault();
    scrollGerozToHash(href);
  };

  links.forEach((link) => link.addEventListener('click', onClick));
  anchorCleanup = () => links.forEach((link) => link.removeEventListener('click', onClick));
}

function getHeroNameRevealEnd(firstNameEl, lastNameEl) {
  const charDelay = 0.05;
  const charDuration = 0.5;
  const firstText = firstNameEl?.getAttribute('aria-label') || '';
  const lastText = lastNameEl?.getAttribute('aria-label') || '';
  const lastStart = firstText.length * charDelay + 0.15;
  const lastEnd = lastStart + Math.max(lastText.length - 1, 0) * charDelay + charDuration;
  return lastEnd + 0.12;
}

function playHeroNameSideSlide(nameEl, startDelay = 0) {
  const chars = nameEl?.querySelectorAll('.gz-hero__char');
  if (!chars?.length) return startDelay;

  const charDelay = 0.05;
  const stepDuration = 0.5;

  gsap.set(chars, {
    opacity: 0,
    x: -300,
    scale: 0,
    color: '#3d2a1c',
    force3D: true,
    transformOrigin: '50% 50%',
  });

  chars.forEach((char, index) => {
    gsap.timeline({ delay: startDelay + index * charDelay })
      .to(char, {
        x: 20,
        scale: 1,
        opacity: 1,
        duration: stepDuration * 0.6,
        ease: 'power2.out',
      })
      .to(char, {
        x: 20,
        duration: stepDuration * 0.2,
        ease: 'none',
      })
      .to(char, {
        x: 0,
        scale: 1.2,
        color: '#c9a06c',
        duration: stepDuration * 0.19,
        ease: 'power2.inOut',
      })
      .to(char, {
        scale: 1,
        color: '#3d2a1c',
        duration: stepDuration * 0.21,
        ease: 'power2.out',
      });
  });

  const text = nameEl.getAttribute('aria-label') || '';
  return startDelay + Math.max(text.length - 1, 0) * charDelay + stepDuration;
}

function resetHeroNameChars(nameEl) {
  const chars = nameEl?.querySelectorAll('.gz-hero__char');
  if (!chars?.length) return;
  gsap.set(chars, { opacity: 1, x: 0, scale: 1, color: '#3d2a1c', clearProps: 'transform' });
}

/* ── Hero: side-slide name chars + portrait curtain ── */
function initGerozHero(prefersReduced) {
  const hero = document.querySelector('.gz-hero');
  if (!hero) return;

  const copy = hero.querySelector('.gz-hero__copy');
  const firstName = hero.querySelector('.gz-hero__firstname');
  const lastName = hero.querySelector('.gz-hero__lastname');
  const accentLine = hero.querySelector('.gz-hero__accent-line');
  const accentDot = hero.querySelector('.gz-hero__accent-dot');
  const subtitle = hero.querySelector('.gz-hero__subtitle');
  const subtitleRule = hero.querySelector('.gz-hero__subtitle-rule');
  const portraitWrap = hero.querySelector('.gz-hero__portrait');
  const portraitFrame = hero.querySelector('.gz-hero__portrait-frame');
  const portraitImg = hero.querySelector('.gz-hero__portrait-img');
  const portraitCorner = hero.querySelector('.gz-hero__portrait-corner');

  const targets = [
    copy, firstName, lastName, accentLine, accentDot,
    subtitle, subtitleRule, portraitWrap, portraitFrame, portraitImg, portraitCorner,
  ];
  targets.forEach((el) => el && gsap.set(el, { visibility: 'visible' }));

  if (prefersReduced) {
    setReducedState(targets);
    resetHeroNameChars(firstName);
    resetHeroNameChars(lastName);
    if (portraitFrame) gsap.set(portraitFrame, { clipPath: 'inset(0% 0 0 0)' });
    return;
  }

  playHeroNameSideSlide(firstName, 0.1);
  if (lastName) {
    const lastStart = (firstName?.getAttribute('aria-label')?.length || 0) * 0.05 + 0.15;
    playHeroNameSideSlide(lastName, lastStart);
  }

  const subtitleInner = subtitle ? wrapLineMask(subtitle) : null;
  const accentStart = getHeroNameRevealEnd(firstName, lastName);

  if (accentLine) gsap.set(accentLine, { scaleX: 0, transformOrigin: 'left center' });
  if (accentDot) gsap.set(accentDot, { scale: 0, opacity: 0 });
  if (subtitleRule) gsap.set(subtitleRule, { scaleX: 0, transformOrigin: 'left center' });
  if (subtitleInner) gsap.set(subtitleInner, { y: '100%', letterSpacing: '0.35em' });
  if (portraitWrap) gsap.set(portraitWrap, { opacity: 0, x: 48, rotation: 2 });
  if (portraitFrame) gsap.set(portraitFrame, { clipPath: 'inset(100% 0 0 0)' });
  if (portraitImg) gsap.set(portraitImg, { scale: 1.14 });
  if (portraitCorner) gsap.set(portraitCorner, { opacity: 0, scale: 0.85, rotation: -8 });

  const tl = gsap.timeline({ defaults: { ease: GEROZ_EASE }, delay: 0.1 });

  if (accentLine) tl.to(accentLine, { scaleX: 1, duration: 1, ease: GEROZ_EASE_IO }, accentStart);
  if (accentDot) tl.to(accentDot, { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, accentStart + 0.16);
  if (subtitleRule) tl.to(subtitleRule, { scaleX: 1, duration: 0.8, ease: GEROZ_EASE_IO }, accentStart + 0.2);
  if (subtitleInner) {
    tl.to(subtitleInner, { y: 0, letterSpacing: '0.2em', duration: 1.1, ease: GEROZ_EASE }, accentStart + 0.26);
  }
  if (portraitWrap) tl.to(portraitWrap, { opacity: 1, x: 0, rotation: 0, duration: 1.25, ease: GEROZ_EASE_IO }, 0.2);
  if (portraitFrame) tl.to(portraitFrame, { clipPath: 'inset(0% 0 0 0)', duration: 1.45, ease: GEROZ_EASE_IO }, 0.28);
  if (portraitImg) tl.to(portraitImg, { scale: 1, duration: 1.6, ease: GEROZ_EASE_IO }, 0.35);
  if (portraitCorner) tl.to(portraitCorner, { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: GEROZ_EASE }, 0.62);

  if (copy) {
    scrubParallax(copy, hero, { y: 24, start: 'top top', end: 'bottom top', scrub: 1 });
  }
  if (portraitWrap) {
    scrubParallax(portraitWrap, hero, { y: 32, start: 'top top', end: 'bottom top', scrub: 1 });
  }
}

/* ── Expertise: panel lift, portrait wipe, sentence lines, author cascade ── */
function initGerozExpertise(prefersReduced) {
  const section = document.querySelector('.gz-expertise');
  if (!section) return;

  const panel = section.querySelector('.gz-expertise__panel');
  const wash = section.querySelector('.gz-expertise__backdrop-wash');
  const noise = section.querySelector('.gz-expertise__backdrop-noise');
  const eyebrow = section.querySelector('.gz-expertise__eyebrow');
  const statement = section.querySelector('.gz-expertise__statement');
  const cta = section.querySelector('.gz-expertise__cta');
  const author = section.querySelector('.gz-expertise__author');
  const authorLine = section.querySelector('.gz-expertise__author-line');
  const authorName = section.querySelector('.gz-expertise__author-name');
  const authorRole = section.querySelector('.gz-expertise__author-role');
  const portrait = section.querySelector('.gz-expertise__portrait');
  const portraitCorner = section.querySelector('.gz-expertise__portrait-corner');
  const portraitFrame = section.querySelector('.gz-expertise__portrait-frame');
  const portraitImg = section.querySelector('.gz-expertise__portrait-img');
  const decor = section.querySelectorAll('.gz-expertise__decor');

  revealEyebrowPill(eyebrow, section, prefersReduced, { start: 'top 84%', variant: 'slide' });

  if (prefersReduced) {
    setReducedState([
      panel, wash, noise, statement, cta, author, authorLine, authorName, authorRole,
      portrait, portraitCorner, portraitFrame, portraitImg, ...decor,
    ]);
    return;
  }

  if (wash) {
    gsap.set(wash, { opacity: 0 });
    gsap.to(wash, {
      opacity: 1,
      duration: 1.1,
      ease: GEROZ_EASE_IO,
      scrollTrigger: gzScroll(section, 'top 90%'),
    });
    scrubParallax(wash, section, { y: 20, scrub: 1 });
  }
  if (noise) scrubParallax(noise, section, { y: 12, scrub: 1 });

  if (panel) {
    gsap.fromTo(panel, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.15,
      ease: GEROZ_EASE_IO,
      scrollTrigger: gzScroll(section, 'top 88%'),
    });
  }

  if (statement) {
    const lines = splitLinesIntoMasks(statement, 7);
    revealLines(lines, statement, { start: 'top 82%', stagger: 0.14, duration: 0.95, y: '120%' });
  }

  if (portrait) {
    gsap.fromTo(portrait, { opacity: 0, x: -40 }, {
      opacity: 1,
      x: 0,
      duration: 1.15,
      ease: GEROZ_EASE_IO,
      scrollTrigger: gzScroll(portrait, 'top 86%'),
    });
  }
  if (portraitCorner) {
    gsap.fromTo(portraitCorner, { opacity: 0, scale: 0.7, rotation: 12 }, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.95,
      ease: GEROZ_EASE,
      scrollTrigger: gzScroll(portrait, 'top 86%'),
    });
  }
  if (portraitFrame) {
    gsap.fromTo(portraitFrame, { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.25,
      ease: GEROZ_EASE_IO,
      scrollTrigger: gzScroll(portrait, 'top 86%'),
    });
  }
  if (portraitImg) {
    scrubParallax(portraitImg, portrait, { y: 16, scrub: 1 });
  }

  decor.forEach((el, index) => {
    const motion = [
      { rotation: 24, y: 14, scale: 0.92 },
      { y: 18, scale: 0.94 },
      { rotation: -18, x: 10, scale: 0.93 },
    ][index % 3];

    gsap.fromTo(el, { opacity: 0, ...motion }, {
      opacity: 1,
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.1,
      delay: index * 0.06,
      ease: GEROZ_EASE,
      scrollTrigger: gzScroll(section, 'top 80%'),
    });
  });

  if (cta) revealClipX(cta, cta, { start: 'top 92%', from: 'inset(0 100% 0 0)' });

  if (author) {
    const tl = gsap.timeline({ scrollTrigger: gzScroll(author, 'top 92%') });
    if (authorLine) {
      gsap.set(authorLine, { scaleY: 0, transformOrigin: 'top center' });
      tl.to(authorLine, { scaleY: 1, duration: 0.75, ease: GEROZ_EASE_IO }, 0);
    }
    if (authorName) {
      gsap.set(authorName, { opacity: 0, x: -16 });
      tl.to(authorName, { opacity: 1, x: 0, duration: 0.8, ease: GEROZ_EASE }, 0.12);
    }
    if (authorRole) {
      gsap.set(authorRole, { opacity: 0, letterSpacing: '0.32em' });
      tl.to(authorRole, { opacity: 1, letterSpacing: '0.18em', duration: 0.9, ease: GEROZ_EASE }, 0.22);
    }
  }
}

/* ── About: split columns, line heading, arrow draw, mixed paragraph styles ── */
function initGerozAbout(prefersReduced) {
  const section = document.querySelector('.gz-about');
  if (!section) return;

  const wash = section.querySelector('.gz-about__backdrop-wash');
  const photoBg = section.querySelector('.gz-about__photo-bg');
  const scrim = section.querySelector('.gz-about__scrim');
  const eyebrow = section.querySelector('.gz-about__eyebrow');
  const headerCol = section.querySelector('.gz-about__header-col');
  const bodyCol = section.querySelector('.gz-about__body-col');
  const heading = section.querySelector('.gz-about__heading');
  const accentLine = section.querySelector('.gz-about__accent-line');
  const accentDot = section.querySelector('.gz-about__accent-dot');
  const arrowWrap = section.querySelector('.gz-about__arrow');
  const arrowPath = section.querySelector('.gz-about__arrow-path');
  const leadPara = section.querySelector('.gz-about__para--lead');
  const bodyParas = section.querySelectorAll('.gz-about__para--body');

  revealEyebrowPill(eyebrow, section, prefersReduced, { variant: 'scale' });
  revealGoldAccent(accentLine, accentDot, heading || section, { lineOrigin: 'left center' });

  if (prefersReduced) {
    setReducedState([wash, photoBg, scrim, headerCol, bodyCol, heading, arrowWrap, leadPara, ...bodyParas]);
    if (arrowPath) gsap.set(arrowPath, { strokeDashoffset: 0 });
    return;
  }

  if (photoBg) {
    gsap.fromTo(photoBg, { scale: 1.05 }, {
      scale: 1,
      duration: 1.35,
      ease: GEROZ_EASE_IO,
      scrollTrigger: { ...gzScroll(section, 'top 92%'), once: true },
    });
  }

  if (wash) scrubParallax(wash, section, { y: 12, scrub: 1 });

  if (headerCol) {
    gsap.fromTo(headerCol, { opacity: 0, y: 36 }, {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: GEROZ_EASE,
      scrollTrigger: gzScroll(headerCol, 'top 86%'),
    });
  }
  if (bodyCol) {
    gsap.fromTo(bodyCol, { opacity: 0, x: 48 }, {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: GEROZ_EASE_IO,
      scrollTrigger: gzScroll(bodyCol, 'top 86%'),
    });
  }

  if (heading) {
    const lines = splitLinesIntoMasks(heading, 4);
    revealLines(lines, heading, { start: 'top 84%', stagger: 0.16, duration: 1, y: '118%' });
  }

  if (arrowWrap) {
    gsap.fromTo(arrowWrap, { opacity: 0, rotation: -12, x: 20 }, {
      opacity: 1,
      rotation: 0,
      x: 0,
      duration: 1.1,
      ease: GEROZ_EASE_IO,
      scrollTrigger: gzScroll(arrowWrap, 'top 84%'),
    });
  }
  drawSvgStroke(arrowPath, section, { start: 'top 80%', duration: 1.8 });

  if (leadPara) {
    const words = splitWordsIntoMasks(leadPara, 'geroz-word geroz-word--lead');
    revealWords(words, leadPara, {
      start: 'top 88%',
      stagger: 0.032,
      duration: 0.95,
      y: '115%',
      toggleActions: 'play none none none',
    });
  }

  bodyParas.forEach((para, index) => {
    const inner = wrapLineMask(para);
    gsap.fromTo(inner, { y: '110%', opacity: 0.5 }, {
      y: 0,
      opacity: 1,
      duration: 0.95,
      ease: GEROZ_EASE,
      scrollTrigger: {
        trigger: para,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
      delay: index * 0.06,
    });
  });
}

/* ── Capabilities: calm header reveal + batched list entrance ── */
function initGerozCapabilities(prefersReduced) {
  const section = document.querySelector('.gz-capabilities');
  if (!section) return;

  const wash = section.querySelector('.gz-capabilities__backdrop-wash');
  const eyebrow = section.querySelector('.gz-capabilities__eyebrow');
  const accentLines = section.querySelectorAll('.gz-capabilities__accent-line');
  const accentDot = section.querySelector('.gz-capabilities__accent-dot');
  const title = section.querySelector('.gz-capabilities__title');
  const description = section.querySelector('.gz-capabilities__description');
  const list = section.querySelector('.gz-capabilities__list');
  const items = section.querySelectorAll('.gz-capabilities__item');
  const dividers = section.querySelectorAll('.gz-capabilities__divider');

  revealEyebrowPill(eyebrow, section, prefersReduced, { start: 'top 88%', variant: 'fade' });

  if (prefersReduced) {
    setReducedState([wash, title, description, ...items, ...dividers]);
    return;
  }

  if (accentLines.length) {
    const accentTl = gsap.timeline({
      scrollTrigger: { ...gzScroll(eyebrow || section, 'top 88%'), once: true },
    });
    if (accentDot) {
      gsap.set(accentDot, { scale: 0, opacity: 0 });
      accentTl.to(accentDot, { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.12);
    }
    accentLines.forEach((line, index) => {
      gsap.set(line, { scaleX: 0, transformOrigin: index === 0 ? 'right center' : 'left center' });
      accentTl.to(line, { scaleX: 1, duration: 0.85, ease: GEROZ_EASE_IO }, 0.18 + index * 0.06);
    });
  }

  if (title) {
    const inner = wrapLineMask(title);
    gsap.fromTo(inner, { y: '105%' }, {
      y: 0,
      duration: 1,
      ease: GEROZ_EASE,
      scrollTrigger: { ...gzScroll(title, 'top 88%'), once: true },
    });
  }

  if (description) {
    gsap.fromTo(description, { opacity: 0, y: 14 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: GEROZ_EASE,
      scrollTrigger: { ...gzScroll(description, 'top 90%'), once: true },
    });
  }

  if (list && items.length) {
    gsap.set(items, { y: 18 });
    if (dividers.length) {
      gsap.set(dividers, { scaleX: 0, transformOrigin: 'left center' });
    }

    const listTl = gsap.timeline({
      scrollTrigger: { ...gzScroll(list, 'top 82%'), once: true },
    });

    listTl.to(items, {
      y: 0,
      duration: 0.75,
      stagger: 0.06,
      ease: GEROZ_EASE,
      clearProps: 'transform',
    });

    if (dividers.length) {
      listTl.to(
        dividers,
        {
          scaleX: 1,
          duration: 0.65,
          stagger: 0.06,
          ease: GEROZ_EASE_IO,
        },
        0.08,
      );
    }
  }

  if (capabilitiesShutterCleanup) {
    capabilitiesShutterCleanup();
    capabilitiesShutterCleanup = null;
  }
  capabilitiesShutterCleanup = initCapabilitiesShutterHover(items, { prefersReduced });
}

/* ── Footer: layered depth, blur logo, clip email, signature bloom ── */
function initGerozFooter(prefersReduced) {
  const footer = document.querySelector('.gz-footer');
  if (!footer) return;

  const bgImage = footer.querySelector('.gz-footer__bg');
  const gradient = footer.querySelector('.gz-footer__gradient');
  const wash = footer.querySelector('.gz-footer__backdrop-wash');
  const logo = footer.querySelector('.gz-footer__logo');
  const email = footer.querySelector('.gz-footer__email');
  const nameBand = footer.querySelector('.gz-footer__name-band');
  const name = footer.querySelector('.gz-footer__name');
  const accentLines = footer.querySelectorAll('.gz-footer__accent-line');
  const accentDot = footer.querySelector('.gz-footer__accent-dot');
  const copy = footer.querySelector('.gz-footer__copy');

  if (prefersReduced) {
    setReducedState([bgImage, gradient, wash, logo, email, nameBand, name, copy]);
    return;
  }

  if (bgImage) {
    gsap.fromTo(bgImage, { scale: 1.12, opacity: 0 }, {
      scale: 1,
      opacity: 0.14,
      duration: 1.4,
      ease: GEROZ_EASE_IO,
      scrollTrigger: { trigger: footer, start: 'top 95%', toggleActions: GEROZ_SCROLL_TOGGLE },
    });
    scrubParallax(bgImage, footer, { y: 24, scrub: 1 });
  }
  if (gradient) {
    gsap.fromTo(gradient, { opacity: 0.6 }, {
      opacity: 1,
      duration: 1,
      scrollTrigger: { trigger: footer, start: 'top 95%', toggleActions: GEROZ_SCROLL_TOGGLE },
    });
  }
  if (wash) {
    gsap.fromTo(wash, { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: GEROZ_EASE,
      scrollTrigger: { trigger: footer, start: 'top 94%', toggleActions: GEROZ_SCROLL_TOGGLE },
    });
  }

  const enterTl = gsap.timeline({ scrollTrigger: gzScroll(footer, 'top 92%') });

  if (logo) {
    gsap.set(logo, { opacity: 0, y: 20, filter: 'blur(8px)' });
    enterTl.to(logo, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: GEROZ_EASE }, 0);
  }
  if (email) {
    gsap.set(email, { clipPath: 'inset(0 100% 0 0)' });
    enterTl.to(email, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: GEROZ_EASE_IO }, 0.12);
  }
  if (copy) {
    gsap.set(copy, { opacity: 0, y: 12 });
    enterTl.to(copy, { opacity: 1, y: 0, duration: 0.75, ease: GEROZ_EASE }, 0.28);
  }

  if (nameBand && name) {
    gsap.set(nameBand, { opacity: 0 });
    gsap.set(name, { opacity: 0, scale: 0.96, filter: 'blur(6px)' });
    if (accentDot) gsap.set(accentDot, { scale: 0, opacity: 0 });
    accentLines.forEach((line) => gsap.set(line, { scaleX: 0, transformOrigin: 'center center' }));

    const nameTl = gsap.timeline({ scrollTrigger: gzScroll(nameBand, 'top 90%') });

    nameTl.to(nameBand, { opacity: 1, duration: 0.35 }, 0);
    if (accentLines[0]) nameTl.to(accentLines[0], { scaleX: 1, duration: 0.85, ease: GEROZ_EASE_IO }, 0.08);
    if (accentDot) nameTl.to(accentDot, { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.18);
    if (accentLines[1]) nameTl.to(accentLines[1], { scaleX: 1, duration: 0.85, ease: GEROZ_EASE_IO }, 0.18);
    nameTl.to(name, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: GEROZ_EASE_IO }, 0.3);
  }
}

function initGerozScrollAnimations(prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ overwrite: 'auto' });
  ScrollTrigger.config({ limitCallbacks: true });

  initGerozSmoothAnchors();
  initGerozHero(prefersReduced);
  initGerozExpertise(prefersReduced);
  initGerozAbout(prefersReduced);
  initGerozCapabilities(prefersReduced);
  initGerozFooter(prefersReduced);

  const syncLayout = () => refreshScrollTriggers();

  refreshAfterImagesLoad(
    ['.gz-about__photo-bg', '.gz-hero__portrait-img', '.gz-expertise__portrait-img', '.gz-footer__bg'],
    syncLayout,
  );

  syncLayout();
  if (document.fonts?.ready) {
    document.fonts.ready.then(syncLayout);
  }
  layoutSyncHandler = syncLayout;
  window.addEventListener('load', layoutSyncHandler, { once: true });
}

export function destroyGerozAnimations() {
  if (capabilitiesShutterCleanup) {
    capabilitiesShutterCleanup();
    capabilitiesShutterCleanup = null;
  }
  if (anchorCleanup) {
    anchorCleanup();
    anchorCleanup = null;
  }
  if (layoutSyncHandler) {
    window.removeEventListener('load', layoutSyncHandler);
    layoutSyncHandler = null;
  }
  page.destroy({ keepSiteReady: true });
}

export function initGerozAnimations() {
  return page.boot({
    onReady: initGerozScrollAnimations,
    lenisOptions: {
      lerp: 0.085,
      duration: 1.25,
      wheelMultiplier: 0.92,
    },
  });
}

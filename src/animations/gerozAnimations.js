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
  GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE,
  drawSvgStroke,
  initCapabilitiesShutterHover,
  revealClipX,
  revealEyebrowPill,
  revealGoldAccent,
  revealLines,
  refreshAfterImagesLoad,
  scrubParallax,
  setReducedState,
  splitCharsIntoMasks,
  splitLinesIntoMasks,
  wrapLineMask,
} from './gerozTextHelpers.js';
import {
  destroyGerozAboutAnimations,
  initGerozAboutAnimations,
  refreshGerozAboutAnimations,
  revealAllGerozAboutText,
} from './gerozAboutAnimations.js';

const page = createScrollPageController();
let anchorCleanup = null;
let layoutSyncHandler = null;
let capabilitiesShutterCleanup = null;

function gzScroll(trigger, start = 'top 86%') {
  return {
    trigger,
    start,
    toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE,
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
  const portraitRule = hero.querySelector('.gz-hero__portrait-rule');
  const portraitAura = hero.querySelector('.gz-hero__portrait-aura');
  const portraitCard = hero.querySelector('.gz-hero__portrait-card');
  const portraitImg = hero.querySelector('.gz-hero__portrait-img');

  const targets = [
    copy, firstName, lastName, accentLine, accentDot,
    subtitle, subtitleRule, portraitWrap, portraitRule, portraitAura,
    portraitCard, portraitImg,
  ];
  targets.forEach((el) => el && gsap.set(el, { visibility: 'visible' }));

  if (prefersReduced) {
    setReducedState(targets);
    resetHeroNameChars(firstName);
    resetHeroNameChars(lastName);
    if (portraitCard) gsap.set(portraitCard, { clipPath: 'inset(0% 0 0 0)', scale: 1, opacity: 1, y: 0 });
    if (portraitAura) gsap.set(portraitAura, { scale: 1, opacity: 1 });
    if (portraitRule) gsap.set(portraitRule, { scaleY: 1, opacity: 1 });
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
  if (portraitWrap) gsap.set(portraitWrap, { opacity: 0, x: 36 });
  if (portraitRule) gsap.set(portraitRule, { scaleY: 0, opacity: 0, transformOrigin: 'top center' });
  if (portraitAura) gsap.set(portraitAura, { opacity: 0, scale: 0.88 });
  if (portraitCard) gsap.set(portraitCard, { opacity: 0, y: 24, clipPath: 'inset(12% 0 0 0)' });
  if (portraitImg) gsap.set(portraitImg, { scale: 1.07 });

  const tl = gsap.timeline({ defaults: { ease: GEROZ_EASE }, delay: 0.1 });

  if (accentLine) tl.to(accentLine, { scaleX: 1, duration: 1, ease: GEROZ_EASE_IO }, accentStart);
  if (accentDot) tl.to(accentDot, { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, accentStart + 0.16);
  if (subtitleRule) tl.to(subtitleRule, { scaleX: 1, duration: 0.8, ease: GEROZ_EASE_IO }, accentStart + 0.2);
  if (subtitleInner) {
    tl.to(subtitleInner, { y: 0, letterSpacing: '0.2em', duration: 1.1, ease: GEROZ_EASE }, accentStart + 0.26);
  }
  if (portraitWrap) tl.to(portraitWrap, { opacity: 1, x: 0, duration: 1.1, ease: GEROZ_EASE_IO }, 0.22);
  if (portraitRule) tl.to(portraitRule, { scaleY: 1, opacity: 1, duration: 1.05, ease: GEROZ_EASE_IO }, 0.28);
  if (portraitAura) tl.to(portraitAura, { opacity: 1, scale: 1, duration: 1.25, ease: GEROZ_EASE_IO }, 0.26);
  if (portraitCard) {
    tl.to(portraitCard, { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: GEROZ_EASE_IO }, 0.34);
  }
  if (portraitImg) tl.to(portraitImg, { scale: 1, duration: 1.45, ease: GEROZ_EASE_IO }, 0.4);

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
    const isMobileLayout = window.matchMedia('(max-width: 1023px)').matches;

    if (isMobileLayout) {
      const inner = wrapLineMask(statement);
      if (inner) {
        gsap.set(inner, { y: '108%', opacity: 0.85 });
        gsap.to(inner, {
          y: 0,
          opacity: 1,
          duration: 0.95,
          ease: GEROZ_EASE,
          scrollTrigger: gzScroll(statement, 'top 82%'),
        });
      }
    } else {
      const lines = splitLinesIntoMasks(statement, 7);
      revealLines(lines, statement, { start: 'top 82%', stagger: 0.14, duration: 0.95, y: '120%' });
    }
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

  revealEyebrowPill(eyebrow, section, prefersReduced, { variant: 'scale' });
  revealGoldAccent(accentLine, accentDot, heading || section, { lineOrigin: 'left center' });

  if (prefersReduced) {
    setReducedState([wash, photoBg, scrim, headerCol, bodyCol, heading, arrowWrap]);
    revealAllGerozAboutText();
    if (arrowPath) gsap.set(arrowPath, { strokeDashoffset: 0 });
    return;
  }

  if (photoBg) {
    gsap.fromTo(photoBg, { scale: 1.05 }, {
      scale: 1,
      duration: 1.35,
      ease: GEROZ_EASE_IO,
      scrollTrigger: { ...gzScroll(section, 'top 92%') },
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
    gsap.set(bodyCol, { opacity: 1, x: 0 });
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
      scrollTrigger: gzScroll(eyebrow || section, 'top 88%'),
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
      scrollTrigger: gzScroll(title, 'top 88%'),
    });
  }

  if (description) {
    gsap.fromTo(description, { opacity: 0, y: 14 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: GEROZ_EASE,
      scrollTrigger: gzScroll(description, 'top 90%'),
    });
  }

  if (list && items.length) {
    gsap.set(items, { y: 18 });
    if (dividers.length) {
      gsap.set(dividers, { scaleX: 0, transformOrigin: 'left center' });
    }

    const listTl = gsap.timeline({
      scrollTrigger: gzScroll(list, 'top 82%'),
    });

    listTl.to(items, {
      y: 0,
      duration: 0.75,
      stagger: 0.06,
      ease: GEROZ_EASE,
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
  const brandCopy = footer.querySelector('.gw-footer-brand__copy');
  const email = footer.querySelector('.gz-footer__email');
  const nameBand = footer.querySelector('.gz-footer__name-band');
  const name = footer.querySelector('.gz-footer__name');
  const accentLines = footer.querySelectorAll('.gz-footer__accent-line');
  const accentDot = footer.querySelector('.gz-footer__accent-dot');
  const copy = brandCopy;

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
      scrollTrigger: { trigger: footer, start: 'top 95%', toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE },
    });
    scrubParallax(bgImage, footer, { y: 24, scrub: 1 });
  }
  if (gradient) {
    gsap.fromTo(gradient, { opacity: 0.6 }, {
      opacity: 1,
      duration: 1,
      scrollTrigger: { trigger: footer, start: 'top 95%', toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE },
    });
  }
  if (wash) {
    gsap.fromTo(wash, { opacity: 0, y: 30 }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: GEROZ_EASE,
      scrollTrigger: { trigger: footer, start: 'top 94%', toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE },
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

function initGerozCvCta(prefersReduced) {
  const section = document.querySelector('.gz-cta');
  if (!section) return;

  const orbs = section.querySelectorAll('.gz-cta__orb');
  const decorShapes = section.querySelectorAll('.gz-cta__decor-shape');
  const watermark = section.querySelector('.gz-cta__watermark');
  const sectionTag = section.querySelector('.gz-cta__section-tag');
  const eyebrowWrap = section.querySelector('.gz-cta__eyebrow-wrap');
  const accentLines = section.querySelectorAll('.gz-cta__accent-line');
  const accentDot = section.querySelector('.gz-cta__accent-dot');
  const content = section.querySelector('.gz-cta__content');
  const lines = section.querySelectorAll('.gz-cta__line-inner');
  const statement = section.querySelector('.gz-cta__statement');
  const choices = section.querySelector('.gz-cta__choices');
  const button = section.querySelector('.gz-cta__button');
  const email = section.querySelector('.gz-cta__email');

  if (prefersReduced) {
    gsap.set(
      [
        watermark,
        sectionTag,
        eyebrowWrap,
        content,
        statement,
        choices,
        button,
        email,
        ...orbs,
        ...decorShapes,
        ...accentLines,
        accentDot,
        ...lines,
      ].filter(Boolean),
      { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'transform' },
    );
    lines.forEach((line) => {
      line.style.transform = 'none';
    });
    return;
  }

  if (orbs.length) {
    gsap.to(orbs, {
      y: -36,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  }

  if (watermark) {
    gsap.set(watermark, { opacity: 0, scale: 0.96 });
    gsap.to(watermark, {
      opacity: 1,
      scale: 1,
      duration: 1.4,
      ease: GEROZ_EASE,
      scrollTrigger: { trigger: section, start: 'top 90%', toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE },
    });
    gsap.to(watermark, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.65,
      },
    });
  }

  decorShapes.forEach((shape, index) => {
    gsap.set(shape, { opacity: 0, scale: 0.82, y: 24 });
    gsap.to(shape, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.9,
      delay: index * 0.08,
      ease: GEROZ_EASE_IO,
      scrollTrigger: { trigger: section, start: 'top 88%', toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE },
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 86%',
      toggleActions: GEROZ_BIDIRECTIONAL_SCROLL_TOGGLE,
    },
  });

  if (sectionTag) {
    gsap.set(sectionTag, { opacity: 0, y: 14 });
    tl.to(sectionTag, { opacity: 1, y: 0, duration: 0.7, ease: GEROZ_EASE }, 0);
  }

  if (eyebrowWrap) {
    gsap.set(eyebrowWrap, { opacity: 0, y: 20 });
    tl.to(eyebrowWrap, { opacity: 1, y: 0, duration: 0.8, ease: GEROZ_EASE }, 0.06);
  }

  accentLines.forEach((line, index) => {
    gsap.set(line, { scaleX: 0, transformOrigin: index === 0 ? 'right center' : 'left center' });
    tl.to(line, { scaleX: 1, duration: 0.75, ease: GEROZ_EASE_IO }, 0.12 + index * 0.06);
  });

  if (accentDot) {
    gsap.set(accentDot, { scale: 0, opacity: 0 });
    tl.to(accentDot, { scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.2);
  }

  if (content) {
    gsap.set(content, { opacity: 0, y: 32 });
    tl.to(content, { opacity: 1, y: 0, duration: 0.95, ease: GEROZ_EASE }, 0.18);
  }

  if (lines.length) {
    gsap.set(lines, { y: '112%' });
    tl.to(lines, { y: 0, duration: 0.9, stagger: 0.1, ease: GEROZ_EASE_IO }, 0.32);
  }

  if (statement) {
    gsap.set(statement, { opacity: 0, y: 18 });
    tl.to(statement, { opacity: 1, y: 0, duration: 0.8, ease: GEROZ_EASE }, 0.48);
  }

  if (choices) {
    gsap.set(choices, { opacity: 0, y: 20 });
    tl.to(choices, { opacity: 1, y: 0, duration: 0.8, ease: GEROZ_EASE }, 0.58);
  }

  if (button) {
    gsap.set(button, { opacity: 0, y: 12 });
    tl.to(button, { opacity: 1, y: 0, duration: 0.7, ease: GEROZ_EASE }, 0.64);
  }

  if (email) {
    gsap.set(email, { opacity: 0, y: 12 });
    tl.to(email, { opacity: 1, y: 0, duration: 0.7, ease: GEROZ_EASE }, 0.7);
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
  initGerozAboutAnimations(document, prefersReduced);
  initGerozCapabilities(prefersReduced);
  initGerozCvCta(prefersReduced);
  initGerozFooter(prefersReduced);

  const syncLayout = () => {
    refreshScrollTriggers();
    refreshGerozAboutAnimations();
  };

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
  destroyGerozAboutAnimations();
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

/**
 * Meridian CV — Dennis Snellenberg portfolio scroll motion.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollPageController } from './scrollPageBoot.js';
import {
  destroyMeridianHeroMarquee,
  initMeridianHeroMarquee,
  remeasureMeridianHeroMarquee,
} from './meridianMarquee.js';
import {
  destroyMeridianFooterCurve,
  initMeridianFooterCurve,
} from './meridianFooterCurve.js';
import { getLenis, syncScrollLayout } from './scrollRuntime.js';
import {
  GEROZ_EASE,
  GEROZ_EASE_IO,
  GEROZ_SCROLL_TOGGLE,
  setReducedState,
  wrapLineMask,
} from './gerozTextHelpers.js';

const page = createScrollPageController();
let anchorCleanup = null;
let layoutSyncHandler = null;
let magneticCleanups = [];

const SCROLL_OFFSET = -72;
const SCROLL_EASE = (t) => Math.min(1, 1.001 - (2 ** (-10 * t)));

function meridianScroll(trigger, start = 'top 88%') {
  return {
    trigger,
    start,
    toggleActions: GEROZ_SCROLL_TOGGLE,
    invalidateOnRefresh: true,
  };
}

export function scrollMeridianToHash(href) {
  if (!href?.startsWith('#')) return;
  const target = document.querySelector(href);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: SCROLL_OFFSET,
      duration: 1.35,
      easing: SCROLL_EASE,
    });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initMeridianSmoothAnchors() {
  if (anchorCleanup) anchorCleanup();

  const links = document.querySelectorAll('.meridian-cv-main a[href^="#"]');
  const onClick = (event) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || href === '#') return;
    if (!document.querySelector(href)) return;

    event.preventDefault();
    scrollMeridianToHash(href);
  };

  links.forEach((link) => link.addEventListener('click', onClick));
  anchorCleanup = () => links.forEach((link) => link.removeEventListener('click', onClick));
}

function initMeridianHero(prefersReduced) {
  const hero = document.querySelector('.meridian-hero');
  if (!hero) return;

  const portraitWrap = hero.querySelector('.meridian-hero__portrait-wrap');
  const portraitHalo = hero.querySelector('.meridian-hero__portrait-halo');
  const portraitRing = hero.querySelector('.meridian-hero__portrait-ring');
  const portraitShell = hero.querySelector('.meridian-hero__portrait-shell');
  const portraitImg = hero.querySelector('.meridian-hero__portrait');
  const marquee = hero.querySelector('.meridian-hero__marquee-track');
  const role = hero.querySelector('.meridian-hero__role');

  if (prefersReduced) {
    setReducedState([portraitWrap, role]);
    return;
  }

  if (marquee) {
    initMeridianHeroMarquee(marquee);
  }

  const haloTargets = [portraitHalo, portraitRing].filter(Boolean);
  if (haloTargets.length) {
    gsap.fromTo(haloTargets, { opacity: 0, scale: 0.94 }, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: GEROZ_EASE_IO,
      delay: 0.05,
      stagger: 0.08,
    });
    gsap.to(haloTargets, {
      y: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  if (portraitShell) {
    gsap.fromTo(portraitShell, { y: 28, scale: 1.03 }, {
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: GEROZ_EASE_IO,
      delay: 0.1,
    });
  }

  if (portraitImg) {
    gsap.to(portraitImg, {
      y: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  if (role) {
    gsap.fromTo(role, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: GEROZ_EASE,
      delay: 0.25,
    });
  }
}

function initMeridianManifesto(prefersReduced) {
  const section = document.querySelector('.meridian-manifesto');
  if (!section) return;

  const heading = section.querySelector('.meridian-manifesto__heading');
  const body = section.querySelector('.meridian-manifesto__body');

  if (prefersReduced) {
    setReducedState([heading, body]);
    return;
  }

  if (heading) {
    const inner = wrapLineMask(heading);
    gsap.fromTo(inner, { y: '108%' }, {
      y: 0,
      duration: 1.1,
      ease: GEROZ_EASE_IO,
      scrollTrigger: meridianScroll(heading, 'top 86%'),
    });
  }

  if (body) {
    gsap.fromTo(body, { opacity: 0, y: 24 }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: GEROZ_EASE,
      scrollTrigger: meridianScroll(body, 'top 88%'),
    });
  }

}

function initMeridianAbout(prefersReduced) {
  const section = document.querySelector('.meridian-about');
  if (!section) return;

  const paragraphs = section.querySelectorAll('.meridian-about__paragraph');
  if (prefersReduced) {
    setReducedState(paragraphs);
    return;
  }

  paragraphs.forEach((para, index) => {
    gsap.fromTo(para, { opacity: 0, y: 28 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: GEROZ_EASE,
      delay: index * 0.08,
      scrollTrigger: meridianScroll(para, 'top 92%'),
    });
  });
}

function initMeridianCapabilities(prefersReduced) {
  const section = document.querySelector('.meridian-capabilities');
  if (!section) return;

  const eyebrow = section.querySelector('.meridian-capabilities__eyebrow');
  const items = section.querySelectorAll('.meridian-capabilities__item');
  const cta = section.querySelector('.meridian-capabilities__cta');

  if (prefersReduced) {
    setReducedState([eyebrow, ...items, cta]);
    return;
  }

  if (eyebrow) {
    gsap.fromTo(eyebrow, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: GEROZ_EASE,
      scrollTrigger: meridianScroll(eyebrow, 'top 90%'),
    });
  }

  items.forEach((item, index) => {
    gsap.fromTo(item, { opacity: 0, y: 24 }, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: GEROZ_EASE,
      delay: index * 0.04,
      scrollTrigger: meridianScroll(item, 'top 94%'),
    });
  });

  if (cta) {
    gsap.fromTo(cta, { opacity: 0, scale: 0.96 }, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: GEROZ_EASE_IO,
      scrollTrigger: meridianScroll(cta, 'top 92%'),
    });
  }
}

function bindMeridianMagnetic(element) {
  const strength = Number(element.dataset.magneticStrength) || 0.35;
  const labelStrength = Number(element.dataset.magneticLabelStrength) || 0.12;
  const wobble = element.hasAttribute('data-magnetic-wobble');
  const returnEase = wobble ? 'elastic.out(1, 0.55)' : 'power3.out';
  const returnDuration = wobble ? 0.7 : 0.3;
  const moveDuration = wobble ? 0.5 : 0.3;
  const shell = element.querySelector('[data-magnetic-inner]') || element;
  const label = element.querySelector('[data-magnetic-text]');

  gsap.set(shell, { x: 0, y: 0, force3D: true });
  if (label) gsap.set(label, { x: 0, y: 0, force3D: true });

  const onMove = (event) => {
    const rect = element.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;

    gsap.to(shell, {
      x: relX * strength,
      y: relY * strength,
      duration: moveDuration,
      ease: 'power2.out',
    });

    if (label) {
      gsap.to(label, {
        x: relX * labelStrength,
        y: relY * labelStrength,
        duration: moveDuration,
        ease: 'power2.out',
      });
    }
  };

  const onLeave = () => {
    gsap.to(shell, {
      x: 0,
      y: 0,
      duration: returnDuration,
      ease: returnEase,
    });

    if (label) {
      gsap.to(label, {
        x: 0,
        y: 0,
        duration: returnDuration,
        ease: returnEase,
      });
    }
  };

  element.addEventListener('mousemove', onMove);
  element.addEventListener('mouseleave', onLeave);

  return () => {
    element.removeEventListener('mousemove', onMove);
    element.removeEventListener('mouseleave', onLeave);
    gsap.set(shell, { clearProps: 'transform' });
    if (label) gsap.set(label, { clearProps: 'transform' });
  };
}

function initMeridianMagnetic(prefersReduced) {
  magneticCleanups.forEach((cleanup) => cleanup());
  magneticCleanups = [];

  if (prefersReduced || !window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('.meridian-magnetic').forEach((element) => {
    magneticCleanups.push(bindMeridianMagnetic(element));
  });
}

function initMeridianScrollAnimations(prefersReduced) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ overwrite: 'auto' });
  ScrollTrigger.config({ limitCallbacks: true });

  initMeridianSmoothAnchors();
  initMeridianHero(prefersReduced);
  initMeridianManifesto(prefersReduced);
  initMeridianAbout(prefersReduced);
  initMeridianCapabilities(prefersReduced);
  initMeridianFooterCurve({ prefersReduced });
  initMeridianMagnetic(prefersReduced);

  const syncLayout = () => {
    initMeridianFooterCurve({ prefersReduced });
    initMeridianMagnetic(prefersReduced);
    syncScrollLayout();
    remeasureMeridianHeroMarquee();
  };
  syncLayout();
  if (document.fonts?.ready) {
    document.fonts.ready.then(syncLayout);
  }
  layoutSyncHandler = syncLayout;
  window.addEventListener('load', layoutSyncHandler, { once: true });
}

export function destroyMeridianAnimations() {
  destroyMeridianHeroMarquee();
  destroyMeridianFooterCurve();
  if (magneticCleanups.length) {
    magneticCleanups.forEach((cleanup) => cleanup());
    magneticCleanups = [];
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

export function initMeridianAnimations() {
  return page.boot({
    onReady: initMeridianScrollAnimations,
    lenisOptions: {
      lerp: 0.085,
      duration: 1.25,
      wheelMultiplier: 0.92,
    },
  });
}

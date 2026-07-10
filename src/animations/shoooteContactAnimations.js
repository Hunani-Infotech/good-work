/**
 * Shooote connect section — line-mask reveals.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GEROZ_EASE,
  GEROZ_EASE_IO,
  setReducedState,
  splitCharsIntoMasks,
  wrapLineMask,
} from './gerozTextHelpers.js';

gsap.registerPlugin(ScrollTrigger);

function getShoooteConnectSection(root = document) {
  return root.querySelector('.shooote-connect');
}

export function clearShoootePageSectionFilters(root = document) {
  root.querySelectorAll('.cv-page-screens > *').forEach((pageSection) => {
    gsap.set(pageSection, { opacity: 1, filter: 'none', clearProps: 'opacity,filter' });
  });

  const header = document.querySelector('.shooote-header');
  if (header) {
    gsap.set(header, { opacity: 1, clearProps: 'opacity,filter' });
  }
}

export function destroyShoooteContactAnimations() {
  clearShoootePageSectionFilters();
  document.querySelectorAll('[data-shooote-connect-init]').forEach((el) => {
    delete el.dataset.shoooteConnectInit;
  });
}

function initShoooteContactReveal(root = document, prefersReduced = false) {
  const section = getShoooteConnectSection(root);
  if (!section || section.dataset.shoooteConnectInit) return;
  section.dataset.shoooteConnectInit = '1';

  const eyebrow = section.querySelector('.shooote-connect__eyebrow');
  const eyebrowMark = section.querySelector('.shooote-connect__eyebrow-mark');
  const headingWrap = section.querySelector('.shooote-connect__heading-wrap');
  const headingLineEls = section.querySelectorAll('.shooote-connect__heading-line');
  const statement = section.querySelector('.shooote-connect__statement');
  const cta = section.querySelector('.shooote-connect__cta');
  const email = section.querySelector('.shooote-connect__email');
  const viewfinderCorners = section.querySelectorAll('.shooote-connect__vf');
  const filmstrips = section.querySelectorAll('.shooote-connect__filmstrip');
  const isCompact = window.matchMedia('(max-width: 767px)').matches;

  if (prefersReduced) {
    setReducedState([
      eyebrow,
      eyebrowMark,
      headingWrap,
      statement,
      cta,
      email,
      ...viewfinderCorners,
      ...filmstrips,
    ]);
    return;
  }

  filmstrips.forEach((filmstrip) => {
    gsap.set(filmstrip, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(filmstrip, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top 58%',
        scrub: 0.65,
      },
    });
  });

  viewfinderCorners.forEach((corner, index) => {
    gsap.set(corner, { scale: 0.6, opacity: 0 });
    gsap.to(corner, {
      scale: 1,
      opacity: 1,
      duration: 0.85,
      delay: index * 0.06,
      ease: GEROZ_EASE_IO,
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        toggleActions: 'play reverse play reverse',
      },
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 78%',
      toggleActions: 'play reverse play reverse',
    },
    defaults: { ease: GEROZ_EASE_IO },
  });

  if (eyebrowMark) {
    gsap.set(eyebrowMark, { scaleX: 0, transformOrigin: 'left center' });
    tl.to(eyebrowMark, { scaleX: 1, duration: 0.7, ease: GEROZ_EASE_IO }, 0.06);
  }

  if (eyebrow) {
    const chars = splitCharsIntoMasks(eyebrow);
    gsap.set(chars, { y: '110%', opacity: 0 });
    tl.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.018,
      ease: GEROZ_EASE,
    }, 0.1);
  }

  if (isCompact) {
    headingLineEls.forEach((lineEl, index) => {
      tl.fromTo(lineEl, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: GEROZ_EASE,
      }, 0.16 + index * 0.1);
    });
  } else {
    headingLineEls.forEach((lineEl, index) => {
      const inner = wrapLineMask(lineEl);
      gsap.set(inner, { y: '108%' });
      tl.to(inner, { y: 0, duration: 1, ease: GEROZ_EASE_IO }, 0.14 + index * 0.12);
    });
  }

  if (statement) {
    const inner = wrapLineMask(statement);
    gsap.set(inner, { y: '108%', filter: 'blur(6px)' });
    tl.to(inner, {
      y: 0,
      filter: 'blur(0px)',
      duration: 0.95,
      ease: GEROZ_EASE_IO,
    }, 0.32);
  }

  if (cta) {
    gsap.set(cta, { opacity: 0, y: 18 });
    tl.to(cta, { opacity: 1, y: 0, duration: 0.75, ease: GEROZ_EASE }, 0.42);
  }

  if (email) {
    gsap.set(email, { opacity: 0, y: 14 });
    tl.to(email, { opacity: 1, y: 0, duration: 0.7, ease: GEROZ_EASE }, 0.5);
  }

  if (ScrollTrigger.isInViewport(section, 0.08)) {
    tl.progress(1);
  }
}

export function revealAllShoooteContactElements(root = document) {
  const section = getShoooteConnectSection(root);
  if (!section) return;

  const targets = [
    section.querySelector('.shooote-connect__eyebrow'),
    section.querySelector('.shooote-connect__eyebrow-mark'),
    section.querySelector('.shooote-connect__heading-wrap'),
    section.querySelector('.shooote-connect__statement'),
    section.querySelector('.shooote-connect__cta'),
    section.querySelector('.shooote-connect__email'),
    ...section.querySelectorAll('.shooote-connect__vf'),
    ...section.querySelectorAll('.shooote-connect__filmstrip'),
  ].filter(Boolean);

  gsap.set(targets, {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    scaleX: 1,
    filter: 'none',
    clearProps: 'transform',
  });

  clearShoootePageSectionFilters(root);

  section.querySelectorAll('.geroz-line-inner, .geroz-char').forEach((el) => {
    gsap.set(el, { y: 0, opacity: 1, filter: 'none', clearProps: 'transform' });
  });
}

export function initShoooteContactAnimations(root = document, prefersReduced = false) {
  destroyShoooteContactAnimations();
  clearShoootePageSectionFilters(root);

  document.querySelectorAll('.shooote-connect__cta').forEach((el) => {
    gsap.set(el, { clearProps: 'clipPath' });
  });

  initShoooteContactReveal(root, prefersReduced);
}

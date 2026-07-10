import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis, destroyLenis, getLenis, resetDocumentScrollState } from './scrollRuntime.js';
import {
  destroyShoooteContactAnimations,
  initShoooteContactAnimations,
  revealAllShoooteContactElements,
  clearShoootePageSectionFilters,
} from './shoooteContactAnimations.js';
import {
  destroyShoooteExpertiseAnimations,
  initShoooteExpertiseAnimations,
  refreshShoooteExpertiseAnimations,
  revealAllShoooteExpertiseElements,
} from './shoooteExpertiseAnimations.js';

let shoooteRunId = 0;
let stickyScrollCleanup = null;
let menuLinkCleanups = [];
let wowObserver = null;
let wowScrollCleanup = null;

gsap.registerPlugin(ScrollTrigger);

function getSplitText() {
  return typeof window !== 'undefined' ? window.SplitText : null;
}

function manualCharSplit(el, linesClass = 'poort-line') {
  const text = el.textContent;
  el.innerHTML = '';
  const flat =
    el.classList.contains('shooote-luxury-heading__row')
    || Boolean(el.closest('.wpo-portfolio-section .wpo-section-title'));
  const line = flat ? null : document.createElement('div');
  if (line) line.className = linesClass;
  const chars = [];
  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.className = 'poort-char';
    span.textContent = char === ' ' ? '\u00a0' : char;
    if (line) line.appendChild(span);
    else el.appendChild(span);
    chars.push(span);
  });
  if (line) el.appendChild(line);
  return { chars };
}

function splitPoortElement(el) {
  const SplitText = getSplitText();
  if (SplitText) {
    const flatHeading =
      el.classList.contains('shooote-luxury-heading__row')
      || el.classList.contains('shooote-cta__heading-line')
      || Boolean(el.closest('.wpo-portfolio-section .wpo-section-title'));
    const type = flatHeading ? 'chars' : 'lines,words,chars';
    return new SplitText(el, { type, linesClass: 'poort-line' });
  }
  return manualCharSplit(el);
}

function resetShoooteRuntime() {
  shoooteRunId += 1;
  menuLinkCleanups.forEach((fn) => fn());
  menuLinkCleanups = [];

  if (stickyScrollCleanup) {
    stickyScrollCleanup();
    stickyScrollCleanup = null;
  }

  if (wowObserver) {
    wowObserver.disconnect();
    wowObserver = null;
  }

  if (wowScrollCleanup) {
    wowScrollCleanup();
    wowScrollCleanup = null;
  }

  document.querySelectorAll('.wpo-site-header.sticky').forEach((header) => {
    header.classList.remove('sticky');
    gsap.set(header, { clearProps: 'transform' });
  });

  document.querySelectorAll('[data-shooote-placeholder]').forEach((node) => node.remove());

  document.querySelectorAll('[data-shooote-desc-reveal]').forEach((el) => {
    delete el.dataset.shoooteDescReveal;
    el.classList.remove('shooote-scroll-fade--pending');
  });

  destroyShoooteContactAnimations();
  destroyShoooteExpertiseAnimations();

  resetHeroSplitState(document);

  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach((t) => t.kill());
  destroyLenis();
  resetDocumentScrollState({ keepSiteReady: true });
}

export function destroyShoooteAnimations() {
  resetShoooteRuntime();
}

function parseWowDelay(el) {
  const raw = el.getAttribute('data-wow-delay') || '0';
  return parseFloat(raw) || 0;
}

function parseWowDuration(el) {
  const raw = el.getAttribute('data-wow-duration') || '1000ms';
  if (raw.includes('ms')) return (parseFloat(raw) || 1000) / 1000;
  return parseFloat(raw) || 1;
}

function getWowMotion(el) {
  if (el.classList.contains('fadeInRightSlow') || el.classList.contains('fadeInRight')) {
    return { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } };
  }
  if (el.classList.contains('fadeInLeftSlow') || el.classList.contains('fadeInLeft')) {
    return { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } };
  }
  if (el.classList.contains('fadeInDown') || el.classList.contains('slideInDown')) {
    return { from: { opacity: 0, y: -40 }, to: { opacity: 1, y: 0 } };
  }
  return { from: { opacity: 0, y: 48 }, to: { opacity: 1, y: 0 } };
}

function revealWowElement(el, immediate = false) {
  if (el.dataset.wowRevealed) return;
  el.dataset.wowRevealed = '1';
  el.style.visibility = 'visible';
  el.classList.add('animated', 'is-visible');

  const { from, to } = getWowMotion(el);
  const duration = parseWowDuration(el);
  const delay = immediate ? 0 : parseWowDelay(el);

  gsap.fromTo(el, from, {
    ...to,
    duration,
    delay,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function revealWowInViewport(root = document) {
  const threshold = window.innerHeight * 0.92;
  root.querySelectorAll('.wow:not([data-wow-revealed])').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < threshold && rect.bottom > 0) {
      revealWowElement(el);
    }
  });
}

function initWowReveals(root = document) {
  const elements = root.querySelectorAll('.wow');
  elements.forEach((el) => {
    if (el.dataset.wowInit) return;
    el.dataset.wowInit = '1';
    el.style.visibility = 'visible';

    const { from } = getWowMotion(el);
    gsap.set(el, { ...from, visibility: 'visible' });
  });

  revealWowInViewport(root);

  if (wowObserver) wowObserver.disconnect();
  wowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealWowElement(entry.target);
        wowObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -2% 0px' },
  );

  root.querySelectorAll('.wow:not([data-wow-revealed])').forEach((el) => {
    wowObserver.observe(el);
  });

  if (wowScrollCleanup) wowScrollCleanup();
  const onScroll = () => revealWowInViewport(root);
  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', onScroll);
    wowScrollCleanup = () => lenis.off('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
    wowScrollCleanup = () => window.removeEventListener('scroll', onScroll);
  }

  window.setTimeout(() => revealWowInViewport(root), 120);
  window.setTimeout(() => revealWowInViewport(root), 600);
}

function revealAllWowElements(root = document) {
  root.querySelectorAll('.wow').forEach((el) => revealWowElement(el, true));
}

const SHOOOTE_DESCRIPTION_SELECTOR = '.gw-section--shooote .shooote-scroll-fade';

function revealAllDescriptionElements(root = document) {
  root.querySelectorAll(SHOOOTE_DESCRIPTION_SELECTOR).forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform' });
    el.classList.remove('shooote-scroll-fade--pending');
  });
}

function initShoooteDescriptionReveals(root = document) {
  const elements = root.querySelectorAll(SHOOOTE_DESCRIPTION_SELECTOR);
  if (!elements.length) return;

  elements.forEach((el) => {
    if (el.closest('.wpo-expertise-section')) return;
    if (el.dataset.shoooteDescReveal) return;
    el.dataset.shoooteDescReveal = '1';
    el.classList.add('shooote-scroll-fade--pending');

    gsap.set(el, { opacity: 0, y: 18 });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        end: 'top 70%',
        scrub: 0.65,
      },
    });

    if (ScrollTrigger.isInViewport(el, 0.08)) {
      tween.progress(1);
      el.classList.remove('shooote-scroll-fade--pending');
    }

    tween.eventCallback('onUpdate', () => {
      if (tween.progress() >= 0.98) {
        el.classList.remove('shooote-scroll-fade--pending');
      }
    });
  });
}

function initPoortTextAnimations(root = document) {
  const elements = root.querySelectorAll('.poort-text');
  if (!elements.length) return;

  elements.forEach((el) => {
    if (el.dataset.shoooteSplit) return;
    el.dataset.shoooteSplit = '1';

    if (el.classList.contains('shooote-hero-line')) {
      return;
    }

    const split = splitPoortElement(el);
    gsap.set(el, { perspective: 600 });

    const chars = split.chars || [];
    if (el.classList.contains('poort-in-right')) gsap.set(chars, { opacity: 0, x: 100 });
    if (el.classList.contains('poort-in-left')) gsap.set(chars, { opacity: 0, x: -100 });
    if (el.classList.contains('poort-in-up')) gsap.set(chars, { opacity: 0, y: 200 });
    if (el.classList.contains('poort-in-down')) gsap.set(chars, { opacity: 0, y: -80 });

    const tween = gsap.to(chars, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      x: 0,
      y: 0,
      opacity: 1,
      rotateX: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out',
    });

    if (ScrollTrigger.isInViewport(el, 0.08)) {
      tween.progress(1);
    }
  });
}

function initStickyHeader() {
  // Header is always fixed via shooote.css — legacy scroll-hide behavior removed.
}

function getHeroLineText(el) {
  if (!el) return '';
  if (el.dataset.heroLineText) return el.dataset.heroLineText;
  const text = el.textContent.trim();
  if (text) el.dataset.heroLineText = text;
  return text;
}

function resetHeroSplitState(root = document) {
  const section = root.querySelector('.shooote-hero-split');
  if (!section) return;

  delete section.dataset.heroAnim;

  section.querySelectorAll('.shooote-hero-blur-text').forEach((line) => {
    const text = getHeroLineText(line);
    if (text) line.textContent = text;
    delete line.dataset.heroLineSplit;
    line.style.removeProperty('visibility');
  });

  const portrait = section.querySelector('.shooote-hero-portrait');
  if (portrait) gsap.set(portrait, { clearProps: 'opacity,transform,scale' });
}

function prepareHeroLine(el) {
  if (!el) return null;

  const text = getHeroLineText(el);
  if (!text) return null;

  el.textContent = text;
  el.dataset.heroLineSplit = '1';

  const split = splitPoortElement(el);
  const chars = split.chars || [];

  if (!chars.length) {
    gsap.set(el, { visibility: 'visible', opacity: 1, filter: 'none' });
    return null;
  }

  gsap.set(el, { visibility: 'visible', opacity: 1 });
  gsap.set(chars, {
    display: 'inline-block',
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
  });

  return chars;
}

function animateHeroLineChars(el, options = {}) {
  const chars = prepareHeroLine(el);
  if (!chars?.length) return null;

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    ...options,
  });
}

function heroNameRevealDuration(root, topLine, bottomLine) {
  const topLen = topLine ? getHeroLineText(topLine).length : 0;
  const bottomLen = bottomLine ? getHeroLineText(bottomLine).length : 0;
  const letters = Math.max(topLen, bottomLen, 1);
  return 0.5 + (letters - 1) * 0.1;
}

function initHeroSplitAnimation(root = document) {
  const section = root.querySelector('.shooote-hero-split');
  if (!section) return;

  resetHeroSplitState(root);

  const topLine = section.querySelector('.shooote-hero-line--top');
  const bottomLine = section.querySelector('.shooote-hero-line--bottom');
  const portrait = section.querySelector('.shooote-hero-portrait');
  const role = section.querySelector('.shooote-hero-role');
  const tagline = section.querySelector('.shooote-hero-tagline');
  const scrollCue = section.querySelector('.shooote-hero-scroll');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  section.dataset.heroAnim = '1';

  if (prefersReduced) {
    [topLine, bottomLine].forEach((line) => {
      if (!line) return;
      line.dataset.heroLineSplit = '1';
      gsap.set(line, { opacity: 1, visibility: 'visible', filter: 'none' });
    });
    [role, tagline, scrollCue, portrait].forEach((el) => {
      if (el) gsap.set(el, { opacity: 1, visibility: 'visible', x: 0, y: 0, scale: 1 });
    });
    return;
  }

  const nameStart = 0.08;
  const nameDuration = heroNameRevealDuration(root, topLine, bottomLine);
  const portraitDelay = nameStart + nameDuration + 0.12;
  const portraitDuration = 1.1;

  if (portrait) {
    gsap.set(portrait, { opacity: 0, scale: 0.9 });
  }

  if (topLine) {
    animateHeroLineChars(topLine, { delay: nameStart });
  }

  if (bottomLine) {
    animateHeroLineChars(bottomLine, { delay: nameStart });
  }

  if (portrait) {
    gsap.to(portrait, {
      opacity: 1,
      scale: 1,
      duration: portraitDuration,
      ease: 'power3.out',
      delay: portraitDelay,
    });
  }

  if (role) {
    gsap.fromTo(role, { opacity: 0, y: 14 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: portraitDelay + portraitDuration * 0.45,
    });
  }

  if (tagline) {
    gsap.fromTo(tagline, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out',
      delay: portraitDelay + portraitDuration * 0.62,
    });
  }

  if (scrollCue) {
    gsap.fromTo(scrollCue, { opacity: 0 }, {
      opacity: 1,
      duration: 0.6,
      delay: portraitDelay + portraitDuration * 0.78,
    });
  }
}

function initMenuLinkScroll(root = document) {
  const menuLinks = root.querySelectorAll('.menu-link');
  if (!menuLinks.length) return;

  menuLinks.forEach((link) => {
    const handler = (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1 });
        return;
      }

      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 80 },
        ease: 'power2.out',
      });
    };

    link.addEventListener('click', handler);
    menuLinkCleanups.push(() => link.removeEventListener('click', handler));
  });
}

function revealAllShoooteContent(root = document) {
  revealAllWowElements(root);
  revealAllDescriptionElements(root);
  revealAllShoooteContactElements(root);
  root.querySelectorAll('.poort-text[data-shooote-split] .poort-char').forEach((char) => {
    gsap.set(char, { opacity: 1, x: 0, y: 0, clearProps: 'transform,filter' });
  });
  resetHeroSplitState(root);
  const section = root.querySelector('.shooote-hero-split');
  if (section) {
    section.querySelectorAll('.shooote-hero-line, .shooote-hero-role, .shooote-hero-tagline, .shooote-hero-scroll, .shooote-hero-portrait').forEach((el) => {
      gsap.set(el, { opacity: 1, visibility: 'visible', x: 0, y: 0, scale: 1, filter: 'none', clearProps: 'transform' });
    });
  }
  revealAllShoooteExpertiseElements(root);
}

function isShoooteMobileViewport() {
  return window.matchMedia('(max-width: 991px)').matches;
}

export function initShoooteAnimations(root = document) {
  resetShoooteRuntime();
  const id = shoooteRunId;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initLenis(isShoooteMobileViewport() ? { forceNative: true } : {});

  const safetyTimer = window.setTimeout(() => {
    if (id !== shoooteRunId) return;
    revealAllShoooteContent(root);
  }, 4000);

  if (prefersReduced) {
    window.clearTimeout(safetyTimer);
    revealAllShoooteContent(root);
    initHeroSplitAnimation(root);
    initShoooteExpertiseAnimations(root, prefersReduced);
    initStickyHeader();
    initMenuLinkScroll(root);
    return;
  }

  requestAnimationFrame(() => {
    if (id !== shoooteRunId) return;
    clearShoootePageSectionFilters(root);
    initWowReveals(root);
    initShoooteDescriptionReveals(root);
    initHeroSplitAnimation(root);
    initPoortTextAnimations(root);
    initShoooteContactAnimations(root, prefersReduced);
    initStickyHeader();
    initMenuLinkScroll(root);
    initShoooteExpertiseAnimations(root, prefersReduced);
    ScrollTrigger.refresh();
    refreshShoooteExpertiseAnimations(root);
    window.setTimeout(() => {
      if (id !== shoooteRunId) return;
      ScrollTrigger.refresh();
      refreshShoooteExpertiseAnimations(root);
      revealWowInViewport(root);
      window.clearTimeout(safetyTimer);
    }, 500);
  });
}

export function scrollToShoooteAnchor(hash, offset = 80) {
  const target = document.querySelector(hash);
  if (!target) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -offset, duration: 1 });
    return;
  }

  gsap.to(window, {
    duration: 1,
    scrollTo: { y: target, offsetY: offset },
    ease: 'power2.out',
  });
}

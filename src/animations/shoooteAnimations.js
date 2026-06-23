import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { initLenis, destroyLenis, getLenis, getScrollY, resetDocumentScrollState } from './scrollRuntime.js';

let shoooteRunId = 0;
let stickyScrollCleanup = null;
let menuLinkCleanups = [];
let wowObserver = null;
let wowScrollCleanup = null;

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function getSplitText() {
  return typeof window !== 'undefined' ? window.SplitText : null;
}

function manualCharSplit(el, linesClass = 'poort-line') {
  const text = el.textContent;
  el.innerHTML = '';
  const line = document.createElement('div');
  line.className = linesClass;
  const chars = [];
  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.className = 'poort-char';
    span.textContent = char === ' ' ? '\u00a0' : char;
    line.appendChild(span);
    chars.push(span);
  });
  el.appendChild(line);
  return { chars };
}

function splitPoortElement(el) {
  const SplitText = getSplitText();
  if (SplitText) {
    return new SplitText(el, { type: 'lines,words,chars', linesClass: 'poort-line' });
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

    gsap.to(chars, {
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
  });
}

function initStickyHeader() {
  // Header is always fixed via shooote.css — legacy scroll-hide behavior removed.
}

function initHeroSplitAnimation(root = document) {
  const section = root.querySelector('.shooote-hero-split');
  if (!section || section.dataset.heroAnim) return;
  section.dataset.heroAnim = '1';

  const lines = section.querySelectorAll('h1.shooote-hero-line');

  const portrait = section.querySelector('.shooote-hero-portrait');
  const role = section.querySelector('.shooote-hero-role');
  const tagline = section.querySelector('.shooote-hero-tagline');
  const scrollCue = section.querySelector('.shooote-hero-scroll');
  const isMobileHero = window.matchMedia('(max-width: 767px)').matches;

  if (portrait) {
    gsap.fromTo(portrait, { opacity: 0, scale: 0.9 }, {
      opacity: 1,
      scale: 1,
      duration: 1.1,
      ease: 'power3.out',
      delay: isMobileHero ? 0.15 : 0.3,
    });
  }

  if (lines.length) {
    gsap.fromTo(lines, { opacity: 0 }, {
      opacity: 1,
      duration: 1,
      stagger: 0.14,
      ease: 'power3.out',
      delay: isMobileHero ? 0.42 : 0.15,
    });
  }

  if (role) {
    gsap.fromTo(role, { opacity: 0, y: 14 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.55,
    });
  }

  if (tagline) {
    gsap.fromTo(tagline, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out',
      delay: 0.72,
    });
  }

  if (scrollCue) {
    gsap.fromTo(scrollCue, { opacity: 0 }, {
      opacity: 1,
      duration: 0.6,
      delay: 0.95,
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

export function initShoooteAnimations(root = document) {
  resetShoooteRuntime();
  const id = shoooteRunId;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initLenis();

  if (prefersReduced) {
    revealAllWowElements(root);
    initHeroSplitAnimation(root);
    initStickyHeader();
    initMenuLinkScroll(root);
    return;
  }

  requestAnimationFrame(() => {
    if (id !== shoooteRunId) return;
    initWowReveals(root);
    initHeroSplitAnimation(root);
    initPoortTextAnimations(root);
    initStickyHeader();
    initMenuLinkScroll(root);
    ScrollTrigger.refresh();
    window.setTimeout(() => ScrollTrigger.refresh(), 500);
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

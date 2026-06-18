/**
 * Shared Lenis + scroll state for SPA route changes.
 * One instance across home/work prevents stacked gsap.ticker callbacks.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenis = null;
let lenisRaf = null;

export function getLenis() {
  return lenis;
}

export function initLenis(options = {}) {
  destroyLenis();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersNativeScroll =
    options.forceNative ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 991px)').matches;

  if (prefersReduced || prefersNativeScroll) return null;

  lenis = new Lenis({
    lerp: 0.12,
    wheelMultiplier: 1,
    gestureOrientation: 'vertical',
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  lenisRaf = function (time) {
    if (lenis) lenis.raf(time * 1000);
  };
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis-smooth');

  return lenis;
}

export function destroyLenis() {
  if (lenisRaf) {
    gsap.ticker.remove(lenisRaf);
    lenisRaf = null;
  }
  if (lenis) {
    try {
      lenis.scrollTo(0, { immediate: true });
    } catch {
      /* ignore */
    }
    lenis.off('scroll', ScrollTrigger.update);
    lenis.destroy();
    lenis = null;
  }
}

export function resetDocumentScrollState() {
  document.documentElement.classList.remove(
    'lenis-smooth',
    'lenis',
    'lenis-stopped',
    'w-mod-ix3',
    'jm-ready'
  );
  document.body.style.overflow = '';
  document.body.style.removeProperty('height');
  window.scrollTo(0, 0);
  if (typeof ScrollTrigger.clearScrollMemory === 'function') {
    ScrollTrigger.clearScrollMemory();
  }
}

export function refreshScrollTriggers() {
  if (!ScrollTrigger.getAll().length) return;
  try {
    ScrollTrigger.refresh(true);
  } catch {
    /* ignore stale refs during route teardown */
  }
}

export function syncScrollLayout() {
  const instance = lenis;
  if (instance) {
    instance.resize();
  }
  refreshScrollTriggers();
}

export function getScrollOffset() {
  return -Math.round(window.innerHeight * 0.06);
}

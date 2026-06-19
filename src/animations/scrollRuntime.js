/**
 * Shared Lenis + scroll state for SPA route changes.
 * One instance across home/work prevents stacked gsap.ticker callbacks.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let lenisRaf = null;
let lenisProxyActive = false;

function setNativeScrollerProxy() {
  try {
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) window.scrollTo(0, value);
        return window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });
  } catch {
    /* ScrollTrigger may be unavailable during route teardown */
  }
}

export function getLenis() {
  return lenis;
}

export function initLenis(options = {}) {
  destroyLenis();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || options.forceNative) {
    setNativeScrollerProxy();
    return null;
  }

  lenis = new Lenis({
    lerp: 0.1,
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

  try {
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });
    lenisProxyActive = true;
  } catch {
    lenisProxyActive = false;
  }

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

  if (lenisProxyActive) {
    setNativeScrollerProxy();
    lenisProxyActive = false;
  }
}

export function resetDocumentScrollState(options = {}) {
  const keepSiteReady = options.keepSiteReady === true;
  const classes = ['lenis-smooth', 'lenis', 'lenis-stopped', 'w-mod-ix3'];
  if (!keepSiteReady) classes.push('site-ready');
  document.documentElement.classList.remove(...classes);
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

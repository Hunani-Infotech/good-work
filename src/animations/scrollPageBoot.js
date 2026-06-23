import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealSiteContent, whenSiteLoaderReady } from './loaderAnimations.js';
import {
  destroyLenis,
  initLenis,
  refreshScrollTriggers,
  resetDocumentScrollState,
} from './scrollRuntime.js';

export function createScrollPageController() {
  let runId = 0;
  let resizeHandler = null;

  function destroy({ keepSiteReady = true, beforeDestroy } = {}) {
    runId += 1;
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }
    beforeDestroy?.();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    destroyLenis();
    resetDocumentScrollState({ keepSiteReady });
  }

  function boot({ onReady, debounceMs = 150 } = {}) {
    destroy({ keepSiteReady: true });
    const id = runId;

    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      initLenis();
    }

    document.documentElement.classList.add('w-mod-ix3');

    if (debounceMs !== false) {
      resizeHandler = () => {
        window.clearTimeout(resizeHandler._t);
        resizeHandler._t = window.setTimeout(refreshScrollTriggers, debounceMs);
      };
      window.addEventListener('resize', resizeHandler);
    }

    return whenSiteLoaderReady({
      prefersReduced,
      isStale: () => id !== runId,
    }).then(() => {
      if (id !== runId) return;
      revealSiteContent();
      onReady?.(prefersReduced);
      refreshScrollTriggers();
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (id === runId) refreshScrollTriggers();
        });
      }
    });
  }

  return { destroy, boot };
}

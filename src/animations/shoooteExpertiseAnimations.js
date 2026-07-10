import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { syncScrollLayout } from './scrollRuntime.js';
import { GEROZ_EASE_IO, scrubParallax } from './gerozTextHelpers.js';

gsap.registerPlugin(ScrollTrigger);

const CLIP_HIDDEN = 'inset(0 100% 0 0)';
const CLIP_VISIBLE = 'inset(0 0% 0 0)';

const EXPERTISE_SCROLL = {
  start: 'top 82%',
  end: 'top 18%',
};

const WORD_REVEAL = {
  duration: 0.09,
  stagger: 0.03,
};

const VIDEO_ENTRANCE = {
  start: 'top 92%',
  end: 'top 58%',
  scrub: 0.8,
};

let expertiseCtx = null;
let expertiseTimeline = null;

function getExpertiseSection(root = document) {
  return root.querySelector('.wpo-expertise-section');
}

function getWordInkElements(section) {
  return section.querySelectorAll('.shooote-scroll-text-reveal__word .shooote-scroll-text-reveal__ink');
}

export function destroyShoooteExpertiseAnimations() {
  expertiseCtx?.revert();
  expertiseCtx = null;
  expertiseTimeline = null;

  document.querySelectorAll('[data-shooote-expertise-init]').forEach((el) => {
    delete el.dataset.shoooteExpertiseInit;
  });
}

export function revealAllShoooteExpertiseElements(root = document) {
  const section = getExpertiseSection(root);
  if (!section) return;

  getWordInkElements(section).forEach((el) => {
    gsap.set(el, { clipPath: CLIP_VISIBLE, clearProps: 'clipPath' });
  });

  section.querySelectorAll('.shooote-expertise-editorial__media').forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0, scale: 1, clearProps: 'opacity,transform' });
  });

  section.querySelectorAll('.shooote-expertise-editorial__video-frame').forEach((el) => {
    gsap.set(el, { scale: 1, clearProps: 'transform' });
  });

  section.querySelectorAll('.shooote-expertise-editorial__video-el').forEach((el) => {
    gsap.set(el, { scale: 1, y: 0, clearProps: 'transform' });
  });

  section.querySelectorAll('.shooote-expertise-editorial__caption').forEach((el) => {
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
  });

  const actions = section.querySelector('.shooote-expertise-editorial__actions');
  if (actions) {
    gsap.set(actions, { opacity: 1, clearProps: 'opacity' });
  }
}

function syncExpertiseTimelineProgress(tl) {
  if (!tl?.scrollTrigger) return;
  tl.progress(tl.scrollTrigger.progress);
}

function initExpertiseVideoMotion(section) {
  const videoMedia = section.querySelector('.shooote-expertise-editorial__media');
  const videoFrame = section.querySelector('.shooote-expertise-editorial__video-frame');
  const videoEl = section.querySelector('.shooote-expertise-editorial__video-el');
  const videoCaption = section.querySelector('.shooote-expertise-editorial__caption');

  if (!videoMedia || !videoFrame) return;

  gsap.set(videoMedia, { opacity: 0, y: 36, force3D: true });
  gsap.set(videoFrame, {
    scale: 0.94,
    transformOrigin: '50% 100%',
    force3D: true,
  });

  if (videoEl) {
    gsap.set(videoEl, {
      scale: 1.05,
      y: 16,
      transformOrigin: '50% 100%',
      force3D: true,
    });
  }

  if (videoCaption) {
    gsap.set(videoCaption, { opacity: 0, y: 14 });
  }

  const entranceTl = gsap.timeline({
    defaults: { ease: GEROZ_EASE_IO },
    scrollTrigger: {
      trigger: videoMedia,
      start: VIDEO_ENTRANCE.start,
      end: VIDEO_ENTRANCE.end,
      scrub: VIDEO_ENTRANCE.scrub,
      invalidateOnRefresh: true,
    },
  });

  entranceTl.to(videoMedia, {
    opacity: 1,
    y: 0,
    duration: 1,
    force3D: true,
  }, 0);

  entranceTl.to(videoFrame, {
    scale: 1,
    duration: 1.1,
    force3D: true,
  }, 0.04);

  if (videoEl) {
    entranceTl.to(videoEl, {
      scale: 1,
      y: 0,
      duration: 1.15,
      force3D: true,
    }, 0.08);
  }

  if (videoCaption) {
    entranceTl.to(videoCaption, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
    }, 0.42);
  }

  if (videoEl) {
    scrubParallax(videoEl, section, {
      y: 12,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.9,
    });
  }
}

export function refreshShoooteExpertiseAnimations(root = document) {
  if (!getExpertiseSection(root)) return;
  syncScrollLayout();
  if (expertiseTimeline) {
    syncExpertiseTimelineProgress(expertiseTimeline);
  }
}

export function initShoooteExpertiseAnimations(root = document, prefersReduced = false) {
  const section = getExpertiseSection(root);
  if (!section || section.dataset.shoooteExpertiseInit) return;

  section.dataset.shoooteExpertiseInit = '1';
  expertiseCtx?.revert();

  expertiseCtx = gsap.context(() => {
    if (prefersReduced) {
      revealAllShoooteExpertiseElements(root);
      return;
    }

    const stage = section.querySelector('.shooote-expertise-editorial__stage') || section;
    const wordInkEls = getWordInkElements(section);
    const actions = section.querySelector('.shooote-expertise-editorial__actions');

    initExpertiseVideoMotion(section);

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: EXPERTISE_SCROLL.start,
        end: EXPERTISE_SCROLL.end,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    let at = 0;

    if (wordInkEls.length) {
      gsap.set(wordInkEls, { clipPath: CLIP_HIDDEN });
      tl.to(wordInkEls, {
        clipPath: CLIP_VISIBLE,
        duration: WORD_REVEAL.duration,
        stagger: WORD_REVEAL.stagger,
      }, at);

      const wordSpan = WORD_REVEAL.duration + Math.max(0, wordInkEls.length - 1) * WORD_REVEAL.stagger;
      at += wordSpan * 0.72;
    }

    if (actions) {
      gsap.set(actions, { opacity: 0 });
      tl.to(actions, {
        opacity: 1,
        duration: 0.24,
      }, at);
    }

    expertiseTimeline = tl;
    syncExpertiseTimelineProgress(tl);
  }, section);
}

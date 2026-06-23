/**
 * GSAP text-split + scroll helpers for CV landing (/cv/sanjay).
 */
import gsap from 'gsap';

export const SCROLL_REVERSE = 'play reverse play reverse';

export function initEyebrowClipReveal(eyebrow, trigger, {
  start = 'top 84%',
  toggleActions = SCROLL_REVERSE,
  prefersReduced = false,
} = {}) {
  if (!eyebrow) return;

  const text = eyebrow.querySelector('.eyebrow__text');
  const line = eyebrow.querySelector('.eyebrow__line');
  const dot = eyebrow.querySelector('.eyebrow__dot');

  gsap.set([text, line, dot].filter(Boolean), { visibility: 'visible', opacity: 1 });

  if (prefersReduced) {
    if (text) gsap.set(text, { clipPath: 'inset(0 0% 0 0)' });
    if (line) gsap.set(line, { scaleX: 1 });
    if (dot) gsap.set(dot, { scale: 1 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: { trigger: trigger || eyebrow, start, toggleActions },
    defaults: { ease: 'power3.inOut' },
  });

  if (dot) {
    gsap.set(dot, { scale: 0 });
    tl.to(dot, { scale: 1, duration: 0.45, ease: 'back.out(2)' }, 0);
  }

  if (line) {
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
    tl.to(line, { scaleX: 1, duration: 0.75 }, 0.08);
  }

  if (text) {
    gsap.set(text, { clipPath: 'inset(0 100% 0 0)' });
    tl.to(text, { clipPath: 'inset(0 0% 0 0)', duration: 0.7 }, 0.12);
  }
}

function splitWordsMasked(el, wordClass = 'narrative-word') {
  if (!el) return [];
  const parts = el.textContent.trim().split(/\s+/);
  el.innerHTML = '';
  const spans = [];
  parts.forEach((w, i) => {
    const mask = document.createElement('span');
    mask.className = 'word-mask';
    if (i < parts.length - 1) mask.style.marginRight = '0.28em';
    const span = document.createElement('span');
    span.className = wordClass;
    span.textContent = w;
    mask.appendChild(span);
    el.appendChild(mask);
    spans.push(span);
  });
  return spans;
}

export function initNarrativeWordRevealOnce(container, {
  trigger,
  start = 'top 85%',
  stagger = 0.02,
  prefersReduced = false,
} = {}) {
  if (!container || prefersReduced) return;

  const allWords = [];
  container.querySelectorAll('.narrative-para[data-roll]').forEach((para) => {
    allWords.push(...splitWordsMasked(para, 'narrative-word'));
  });

  if (!allWords.length) return;

  gsap.set(allWords, { y: '110%', opacity: 1 });
  gsap.to(allWords, {
    y: 0,
    duration: 0.5,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: trigger || container,
      start,
      once: true,
    },
  });
}

export function splitWordsSimple(el, wordClass = 'word') {
  if (!el) return [];
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = '';
  return words.map((w, i) => {
    const span = document.createElement('span');
    span.className = wordClass;
    span.style.display = 'inline-block';
    span.textContent = w;
    if (i < words.length - 1) span.style.marginRight = '0.28em';
    el.appendChild(span);
    return span;
  });
}

export function rollParagraphOnce(el, trigger, start = 'top 88%', prefersReduced = false) {
  if (!el || prefersReduced) return;
  const mask = document.createElement('div');
  mask.className = 'line-mask';
  const inner = document.createElement('span');
  inner.className = 'line-inner';
  inner.textContent = el.textContent;
  el.textContent = '';
  mask.appendChild(inner);
  el.appendChild(mask);
  gsap.set(inner, { y: '110%' });
  gsap.to(inner, {
    y: 0,
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: { trigger: trigger || mask, start, toggleActions: SCROLL_REVERSE },
  });
}

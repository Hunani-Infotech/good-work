/**
 * Luxury text + accent helpers for the Geroz CV template.
 */
import gsap from 'gsap';

export const GEROZ_EASE = 'power4.out';
export const GEROZ_EASE_IO = 'power3.inOut';
export const GEROZ_EASE_LUX = 'expo.out';
export const GEROZ_SCROLL_TOGGLE = 'play none none none';

export function wrapLineMask(el, innerClass = 'geroz-line-inner') {
  if (!el) return null;
  const existing = el.querySelector(`.${innerClass}`);
  if (existing) return existing;

  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);

  const mask = document.createElement('span');
  mask.className = 'geroz-line-mask';
  mask.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('span');
  inner.className = innerClass;
  inner.textContent = text;

  mask.appendChild(inner);
  el.appendChild(mask);
  return inner;
}

export function splitLinesIntoMasks(el, maxWordsPerLine = 5, innerClass = 'geroz-line-inner') {
  if (!el) return [];
  if (el.dataset.gerozLines) {
    return Array.from(el.querySelectorAll(`.${innerClass}`));
  }

  const words = el.textContent.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
  }

  el.textContent = '';
  el.dataset.gerozLines = '1';
  el.setAttribute('aria-label', lines.join(' '));

  return lines.map((lineText) => {
    const mask = document.createElement('span');
    mask.className = 'geroz-line-mask geroz-line-mask--stacked';
    mask.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('span');
    inner.className = innerClass;
    inner.textContent = lineText;

    mask.appendChild(inner);
    el.appendChild(mask);
    return inner;
  });
}

export function splitCharsIntoMasks(el, charClass = 'geroz-char') {
  if (!el) return [];
  if (el.dataset.gerozChars) {
    return Array.from(el.querySelectorAll(`.${charClass}`));
  }

  const text = el.textContent.trim();
  el.textContent = '';
  el.dataset.gerozChars = '1';
  el.setAttribute('aria-label', text);

  return [...text].map((char) => {
    const mask = document.createElement('span');
    mask.className = 'geroz-char-mask';
    mask.setAttribute('aria-hidden', 'true');
    if (char === ' ') mask.style.width = '0.28em';

    const span = document.createElement('span');
    span.className = charClass;
    span.textContent = char === ' ' ? '\u00a0' : char;

    mask.appendChild(span);
    el.appendChild(mask);
    return span;
  });
}

export function splitWordsIntoMasks(el, wordClass = 'geroz-word') {
  if (!el) return [];
  if (el.dataset.gerozWords) {
    return Array.from(el.querySelectorAll(`.${wordClass}`));
  }

  const parts = el.textContent.trim().split(/\s+/).filter(Boolean);
  el.textContent = '';
  el.dataset.gerozWords = '1';

  const words = parts.map((word, index) => {
    const mask = document.createElement('span');
    mask.className = 'geroz-word-mask';
    if (index < parts.length - 1) mask.style.marginRight = '0.28em';

    const span = document.createElement('span');
    span.className = wordClass;
    span.textContent = word;
    mask.appendChild(span);
    el.appendChild(mask);
    return span;
  });

  return words;
}

/** Marquee split — keeps lone punctuation (e.g. em dashes) on the previous word. */
export function splitMarqueeWordsIntoMasks(el, wordClass = 'geroz-word') {
  if (!el) return [];
  if (el.dataset.gerozWords) {
    return Array.from(el.querySelectorAll(`.${wordClass}`));
  }

  const text = el.textContent.trim();
  const rawParts = text.split(/\s+/).filter(Boolean);
  const parts = [];

  rawParts.forEach((part) => {
    if (/^[\u2012\u2013\u2014\-–—.,!?;:|]+$/.test(part) && parts.length) {
      parts[parts.length - 1] = `${parts[parts.length - 1]} ${part}`;
      return;
    }
    parts.push(part);
  });

  el.textContent = '';
  el.dataset.gerozWords = '1';

  return parts.map((word, index) => {
    const mask = document.createElement('span');
    mask.className = 'geroz-word-mask';
    if (index < parts.length - 1) mask.style.marginRight = '0.28em';

    const span = document.createElement('span');
    span.className = wordClass;
    span.textContent = word;
    mask.appendChild(span);
    el.appendChild(mask);
    return span;
  });
}

export function revealWords(words, trigger, {
  start = 'top 86%',
  stagger = 0.028,
  duration = 0.85,
  y = '110%',
  x = 0,
  rotation = 0,
  toggleActions = GEROZ_SCROLL_TOGGLE,
} = {}) {
  if (!words.length) return null;

  gsap.set(words, { y, x, rotation, opacity: 1 });
  return gsap.to(words, {
    y: 0,
    x: 0,
    rotation: 0,
    duration,
    stagger,
    ease: GEROZ_EASE,
    scrollTrigger: { trigger, start, toggleActions },
  });
}

export function revealLines(lines, trigger, {
  start = 'top 86%',
  stagger = 0.12,
  duration = 1,
  y = '115%',
  toggleActions = GEROZ_SCROLL_TOGGLE,
} = {}) {
  if (!lines.length) return null;

  gsap.set(lines, { y, opacity: 1 });
  return gsap.to(lines, {
    y: 0,
    duration,
    stagger,
    ease: GEROZ_EASE,
    scrollTrigger: { trigger, start, toggleActions },
  });
}

export function revealChars(chars, trigger, {
  start = 'top 86%',
  stagger = 0.02,
  duration = 0.9,
  y = '120%',
  rotationX = -42,
  toggleActions = GEROZ_SCROLL_TOGGLE,
} = {}) {
  if (!chars.length) return null;

  gsap.set(chars, { y, rotationX, transformOrigin: '50% 100%', opacity: 0 });
  return gsap.to(chars, {
    y: 0,
    rotationX: 0,
    opacity: 1,
    duration,
    stagger,
    ease: GEROZ_EASE_IO,
    scrollTrigger: { trigger, start, toggleActions },
  });
}

export function revealBlurUp(el, trigger, {
  start = 'top 88%',
  y = 28,
  blur = 10,
  duration = 1.05,
  toggleActions = GEROZ_SCROLL_TOGGLE,
} = {}) {
  if (!el) return null;

  return gsap.fromTo(
    el,
    { opacity: 0, y, filter: `blur(${blur}px)` },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration,
      ease: GEROZ_EASE,
      scrollTrigger: { trigger: trigger || el, start, toggleActions },
    },
  );
}

export function revealClipX(el, trigger, {
  start = 'top 88%',
  from = 'inset(0 100% 0 0)',
  to = 'inset(0 0% 0 0)',
  duration = 1.1,
  toggleActions = GEROZ_SCROLL_TOGGLE,
} = {}) {
  if (!el) return null;

  gsap.set(el, { clipPath: from });
  return gsap.to(el, {
    clipPath: to,
    duration,
    ease: GEROZ_EASE_IO,
    scrollTrigger: { trigger: trigger || el, start, toggleActions },
  });
}

export function revealGoldAccent(lineEl, dotEl, trigger, {
  start = 'top 86%',
  toggleActions = GEROZ_SCROLL_TOGGLE,
  lineOrigin = 'left center',
} = {}) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: trigger || lineEl || dotEl, start, toggleActions },
    defaults: { ease: GEROZ_EASE_IO },
  });

  if (dotEl) {
    gsap.set(dotEl, { scale: 0, opacity: 0 });
    tl.to(dotEl, { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0);
  }

  if (lineEl) {
    gsap.set(lineEl, { scaleX: 0, transformOrigin: lineOrigin });
    tl.to(lineEl, { scaleX: 1, duration: 0.95 }, dotEl ? 0.1 : 0);
  }

  return tl;
}

export function drawSvgStroke(pathEl, trigger, {
  start = 'top 88%',
  duration = 1.65,
  toggleActions = GEROZ_SCROLL_TOGGLE,
} = {}) {
  if (!pathEl) return null;

  const length = pathEl.getTotalLength();
  gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length });

  return gsap.to(pathEl, {
    strokeDashoffset: 0,
    duration,
    ease: GEROZ_EASE_IO,
    scrollTrigger: { trigger: trigger || pathEl, start, toggleActions },
  });
}

export function revealEyebrowPill(el, trigger, prefersReduced, {
  start = 'top 88%',
  variant = 'fade',
} = {}) {
  if (!el) return;

  if (prefersReduced) {
    gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotation: 0 });
    return;
  }

  const from =
    variant === 'scale'
      ? { opacity: 0, scale: 0.92, filter: 'blur(8px)' }
      : variant === 'slide'
        ? { opacity: 0, x: -24, filter: 'blur(4px)' }
        : { opacity: 0, y: 16, filter: 'blur(6px)' };

  const to =
    variant === 'scale'
      ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
      : variant === 'slide'
        ? { opacity: 1, x: 0, filter: 'blur(0px)' }
        : { opacity: 1, y: 0, filter: 'blur(0px)' };

  gsap.fromTo(el, from, {
    ...to,
    duration: 1,
    ease: GEROZ_EASE,
    scrollTrigger: {
      trigger: trigger || el,
      start,
      toggleActions: GEROZ_SCROLL_TOGGLE,
    },
  });
}

export function scrubParallax(el, trigger, {
  y = -40,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 1,
} = {}) {
  if (!el) return null;

  const amount = Math.abs(y);
  gsap.set(el, { force3D: true, willChange: 'transform' });

  return gsap.fromTo(
    el,
    { y: amount },
    {
      y: -amount,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger: trigger || el,
        start,
        end,
        scrub: typeof scrub === 'number' ? scrub : true,
        invalidateOnRefresh: true,
      },
    },
  );
}

export function refreshAfterImagesLoad(selectors, callback) {
  const urls = [];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (node.tagName === 'IMG' && node.src) urls.push(node.src);
      const bg = getComputedStyle(node).backgroundImage;
      const match = bg && bg.match(/url\(["']?(.+?)["']?\)/);
      if (match?.[1]) urls.push(match[1]);
    });
  });

  if (!urls.length) {
    callback?.();
    return;
  }

  let pending = urls.length;
  const done = () => {
    pending -= 1;
    if (pending <= 0) callback?.();
  };

  urls.forEach((src) => {
    const img = new Image();
    img.onload = done;
    img.onerror = done;
    img.src = src;
  });
}

/**
 * Top-down shutter on hover in (scale from top); slides down on hover out.
 */
export function initCapabilitiesShutterHover(items, {
  prefersReduced = false,
  duration = 0.62,
  ease = GEROZ_EASE_LUX,
  reverseEase = 'power2.inOut',
} = {}) {
  if (!items?.length) return () => {};

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover || prefersReduced) return () => {};

  const cleanups = [];

  items.forEach((item) => {
    const hoverBg = item.querySelector('.gz-capabilities__hover-bg');
    const number = item.querySelector('.gz-capabilities__number');
    const text = item.querySelector('.gz-capabilities__text');
    const divider = item.querySelector('.gz-capabilities__divider');
    if (!hoverBg) return;

    gsap.set([number, text, divider].filter(Boolean), { clearProps: 'color,backgroundColor' });

    const resetHoverBg = () => {
      gsap.set(hoverBg, {
        scaleY: 0,
        yPercent: 0,
        visibility: 'hidden',
        transformOrigin: '50% 0%',
        force3D: true,
      });
    };

    resetHoverBg();

    let tl = null;

    const killTween = () => {
      if (tl) {
        tl.kill();
        tl = null;
      }
      gsap.killTweensOf(hoverBg);
    };

    const onEnter = () => {
      killTween();
      item.classList.add('is-hovered');
      gsap.set(hoverBg, {
        visibility: 'visible',
        scaleY: 0,
        yPercent: 0,
        transformOrigin: '50% 0%',
        force3D: true,
      });

      tl = gsap.timeline({ overwrite: 'auto' });
      tl.to(hoverBg, { scaleY: 1, duration, ease }, 0);
    };

    const onLeave = () => {
      killTween();
      const reverseDuration = duration * 0.88;
      const openSnap = 0.14;
      const scaleY = Number(gsap.getProperty(hoverBg, 'scaleY')) || 0;

      gsap.set(hoverBg, {
        visibility: 'visible',
        transformOrigin: '50% 0%',
        force3D: true,
      });

      tl = gsap.timeline({
        overwrite: 'auto',
        onComplete: () => {
          resetHoverBg();
          item.classList.remove('is-hovered');
        },
      });

      if (scaleY < 0.99) {
        tl.to(hoverBg, { scaleY: 1, duration: openSnap, ease: 'power2.out' }, 0);
        tl.to(hoverBg, { yPercent: 100, duration: reverseDuration, ease: reverseEase }, openSnap * 0.65);
        tl.call(() => item.classList.remove('is-hovered'), null, openSnap * 0.65 + reverseDuration * 0.52);
      } else {
        gsap.set(hoverBg, { scaleY: 1, yPercent: 0 });
        tl.to(hoverBg, { yPercent: 100, duration: reverseDuration, ease: reverseEase }, 0);
        tl.call(() => item.classList.remove('is-hovered'), null, reverseDuration * 0.52);
      }
    };

    item.addEventListener('mouseenter', onEnter);
    item.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      killTween();
      item.removeEventListener('mouseenter', onEnter);
      item.removeEventListener('mouseleave', onLeave);
      item.classList.remove('is-hovered');
      resetHoverBg();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

export function setReducedState(elements, values = {}) {
  elements.filter(Boolean).forEach((el) => {
    gsap.set(el, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationX: 0,
      clipPath: 'inset(0% 0 0 0)',
      filter: 'blur(0px)',
      letterSpacing: 'normal',
    });
    el.querySelectorAll('.geroz-line-inner, .geroz-word, .geroz-char').forEach((inner) => {
      gsap.set(inner, { y: 0, x: 0, opacity: 1, rotationX: 0 });
    });
    Object.assign(el.style, values);
  });
}

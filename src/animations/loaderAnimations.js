const LOADER_MSGS = ['warming up…', 'locking in…', 'almost there…', 'you’re in'];
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.45, 0.64, 1)';
const EASE_CURTAIN = 'cubic-bezier(0.76, 0, 0.24, 1)';
/** Full cycle length of `goodwork-logo.gif` (125 × 40ms). */
const LOADER_GIF_MS = 4400;

let loaderRunId = 0;
let loaderSessionComplete = false;
let loaderSessionPromise = null;
let siteReadyApplied = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForFonts(timeoutMs = 3000) {
  if (!document.fonts || !document.fonts.ready) {
    return sleep(0);
  }

  return Promise.race([
    document.fonts.ready.catch(() => undefined),
    sleep(timeoutMs),
  ]);
}

function finishLoaderSession(runId) {
  hideLoaderEl();
  if (runId !== loaderRunId) return;
  loaderSessionComplete = true;
  applySiteReady();
}

export function isLoaderSessionComplete() {
  return loaderSessionComplete;
}

export function isLoaderSessionPending() {
  return Boolean(loaderSessionPromise && !loaderSessionComplete);
}

function hideLoaderEl() {
  document.documentElement.classList.remove('is-loader-active');

  const loader = document.querySelector('.container-loader.site-loader');
  const reveal = document.querySelector('.loader-curtain-reveal');
  if (loader) {
    loader.classList.remove('is-active');
    loader.style.display = 'none';
    loader.style.opacity = '';
    loader.setAttribute('aria-busy', 'false');
  }
  if (reveal) {
    reveal.style.opacity = '0';
    reveal.style.transform = 'translate(-50%, -50%) scale(0)';
    reveal.style.width = '100px';
    reveal.style.height = '100px';
  }
}

function applySiteReady() {
  if (siteReadyApplied) return;
  siteReadyApplied = true;
  document.documentElement.classList.add('site-ready');
}

export function revealSiteContent() {
  applySiteReady();
}

/** Skip the brand loader (e.g. 404) — hide immediately and mark the session ready. */
export function bypassSiteLoader() {
  loaderRunId += 1;
  loaderSessionPromise = null;
  hideLoaderEl();
  loaderSessionComplete = true;
  siteReadyApplied = false;
  applySiteReady();
}

function fadeIn(el, duration, keyframes) {
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    const anim = el.animate(keyframes, {
      duration,
      fill: 'forwards',
      easing: EASE_OUT,
    });
    anim.onfinish = resolve;
  });
}

function animateProgress(fillEl, counterEl, statusEl, duration) {
  const t0 = performance.now();
  return new Promise((resolve) => {
    function tick(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(100 * eased);
      if (fillEl) fillEl.style.width = `${value}%`;
      if (counterEl) counterEl.textContent = String(value);
      if (statusEl) {
        statusEl.textContent = LOADER_MSGS[
          Math.min(Math.floor((value / 101) * LOADER_MSGS.length), LOADER_MSGS.length - 1)
        ];
      }
      if (t < 1) requestAnimationFrame(tick);
      else resolve(value);
    }
    tick(t0);
  });
}

function curtainReveal(anchor, reveal, loader) {
  return new Promise((resolve) => {
    const rect = anchor.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = Math.hypot(window.innerWidth, window.innerHeight);
    const scaleValue = (radius * 2) / 100;

    reveal.style.left = `${centerX}px`;
    reveal.style.top = `${centerY}px`;
    reveal.style.opacity = '1';
    reveal.style.transform = 'translate(-50%, -50%) scale(0)';

    loader.animate([
      { opacity: 1 },
      { opacity: 0 },
    ], {
      duration: 450,
      delay: 280,
      easing: EASE_OUT,
      fill: 'forwards',
    });

    const expandAnim = reveal.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: `translate(-50%, -50%) scale(${scaleValue})`, opacity: 1 },
    ], {
      duration: 1200,
      easing: EASE_CURTAIN,
      fill: 'forwards',
    });

    expandAnim.onfinish = () => {
      const fadeOut = reveal.animate([
        { opacity: 1 },
        { opacity: 0 },
      ], {
        duration: 650,
        easing: 'ease-out',
        fill: 'forwards',
      });
      fadeOut.onfinish = () => {
        hideLoaderEl();
        resolve();
      };
    };
  });
}

function restartGif(img) {
  if (!img || !img.src) return;
  const { src } = img;
  img.src = '';
  img.src = src;
}

async function runBrandLoader(loader, isStale) {
  const reveal = document.querySelector('.loader-curtain-reveal');
  const stage = loader.querySelector('.loader-stage');
  const logoWrap = loader.querySelector('[data-loader-logo-wrap]');
  const tagline = loader.querySelector('[data-loader-tagline]');
  const progress = loader.querySelector('[data-loader-progress]');
  const progressFill = loader.querySelector('[data-loader-progress-fill]');
  const dot = loader.querySelector('[data-loader-dot]');
  const counterEl = loader.querySelector('[data-loader-counter]');
  const statusEl = loader.querySelector('[data-loader-status]');
  const orbs = loader.querySelectorAll('[data-loader-orb]');
  const watermark = loader.querySelector('[data-loader-watermark]');
  const stamp = loader.querySelector('[data-loader-stamp]');
  const logo = loader.querySelector('[data-loader-logo]');

  if (!reveal || !stage || !logoWrap || !dot) {
    hideLoaderEl();
    return;
  }

  await sleep(120);
  if (isStale()) return;

  orbs.forEach((orb, i) => {
    orb.animate([
      { opacity: 0, transform: 'scale(0.7)' },
      { opacity: 1, transform: 'scale(1)' },
    ], {
      duration: 900,
      delay: i * 100,
      fill: 'forwards',
      easing: EASE_OUT,
    });
  });

  if (watermark) {
    watermark.animate([
      { opacity: 0, transform: 'translate(-50%, -45%) rotate(-8deg) scale(1.08)' },
      { opacity: 1, transform: 'translate(-50%, -50%) rotate(-8deg) scale(1)' },
    ], { duration: 900, fill: 'forwards', easing: EASE_OUT });
  }

  restartGif(logo);
  const gifStartedAt = performance.now();

  await fadeIn(logoWrap, 850, [
    { opacity: 0, transform: 'translateY(22px) scale(0.88) rotate(-4deg)' },
    { opacity: 1, transform: 'translateY(0) scale(1) rotate(0deg)' },
  ]);
  if (isStale()) return;

  if (stamp) {
    stamp.animate([
      { opacity: 0, transform: 'rotate(8deg) scale(0.4)' },
      { opacity: 1, transform: 'rotate(8deg) scale(1.08)' },
      { opacity: 1, transform: 'rotate(8deg) scale(1)' },
    ], { duration: 700, fill: 'forwards', easing: EASE_SPRING });
  }

  await fadeIn(tagline, 700, [
    { opacity: 0, transform: 'rotate(-1.5deg) translateY(16px) scale(0.96)' },
    { opacity: 1, transform: 'rotate(-1.5deg) translateY(0) scale(1)' },
  ]);
  if (isStale()) return;

  await fadeIn(progress, 480, [
    { opacity: 0, transform: 'translateY(12px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ]);
  if (isStale()) return;

  const elapsedBeforeHud = performance.now() - gifStartedAt;
  const holdMs = Math.max(1800, LOADER_GIF_MS - elapsedBeforeHud);

  await animateProgress(progressFill, counterEl, statusEl, holdMs);

  const remainingGif = LOADER_GIF_MS - (performance.now() - gifStartedAt);
  if (remainingGif > 0) await sleep(remainingGif);

  await sleep(220);
  if (isStale()) return;

  await curtainReveal(dot, reveal, loader);
}

export function bootSiteLoader(options) {
  return initSiteLoader(options);
}

export function whenSiteLoaderReady(options) {
  return initSiteLoader(options);
}

/**
 * Shared GoodWork brand loader (logo GIF + tagline + orange curtain).
 * @param {{ prefersReduced?: boolean, isStale?: () => boolean }} options
 */
export function initSiteLoader(options) {
  const prefersReduced = options && typeof options.prefersReduced === 'boolean'
    ? options.prefersReduced
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isStale = options && typeof options.isStale === 'function'
    ? options.isStale
    : () => false;

  if (loaderSessionComplete) {
    hideLoaderEl();
    return Promise.resolve();
  }

  if (loaderSessionPromise) {
    return loaderSessionPromise;
  }

  const runId = ++loaderRunId;
  document.documentElement.classList.remove('site-ready');
  siteReadyApplied = false;

  const loader = document.querySelector('.container-loader.site-loader');
  if (!loader) {
    applySiteReady();
    loaderSessionComplete = true;
    return Promise.resolve();
  }

  if (prefersReduced) {
    hideLoaderEl();
    applySiteReady();
    loaderSessionComplete = true;
    return Promise.resolve();
  }

  document.documentElement.classList.add('is-loader-active');
  loader.classList.add('is-active');
  loader.style.display = 'flex';
  loader.style.opacity = '1';
  loader.setAttribute('aria-busy', 'true');

  const staleCheck = () => runId !== loaderRunId || isStale();

  loaderSessionPromise = waitForFonts(3000)
    .then(() => sleep(80))
    .then(() => {
      if (staleCheck()) return;
      return runBrandLoader(loader, staleCheck);
    })
    .catch(() => {})
    .finally(() => {
      finishLoaderSession(runId);
    });

  return loaderSessionPromise;
}

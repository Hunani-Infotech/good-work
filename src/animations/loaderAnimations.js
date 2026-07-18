const LOADER_MSGS = ['Loading…', 'Crafting…', 'Polishing…', 'Ready'];
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_CURTAIN = 'cubic-bezier(0.76, 0, 0.24, 1)';
/** Full cycle length of `goodwork-logo.gif` (125 × 40ms). */
const LOADER_GIF_MS = 5000;

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

function fadeIn(el, duration = 700, transformFrom = 'translateY(10px)') {
  if (!el) return Promise.resolve();
  return new Promise((resolve) => {
    const anim = el.animate([
      { opacity: 0, transform: transformFrom },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration, fill: 'forwards', easing: EASE_OUT });
    anim.onfinish = resolve;
  });
}

function expandRule(rule, width, duration) {
  if (!rule) return Promise.resolve();
  const t0 = performance.now();
  return new Promise((resolve) => {
    function tick(now) {
      const t = Math.min(1, (now - t0) / duration);
      rule.style.width = `${width * (1 - Math.pow(1 - t, 2))}px`;
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    tick(t0);
  });
}

function animateCounter(counterEl, statusEl, target, duration, startVal) {
  const t0 = performance.now();
  return new Promise((resolve) => {
    function tick(now) {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(startVal + (target - startVal) * eased);
      counterEl.textContent = String(value);
      statusEl.textContent = LOADER_MSGS[Math.min(Math.floor((value / 101) * LOADER_MSGS.length), LOADER_MSGS.length - 1)];
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
    const expandDuration = 1200;
    const fadeDuration = 650;

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
      duration: expandDuration,
      easing: EASE_CURTAIN,
      fill: 'forwards',
    });

    expandAnim.onfinish = () => {
      const fadeOut = reveal.animate([
        { opacity: 1 },
        { opacity: 0 },
      ], {
        duration: fadeDuration,
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
  const ruleBottom = loader.querySelector('.loader-rule--bottom');
  const dot = loader.querySelector('[data-loader-dot]');
  const hud = loader.querySelector('.loader-hud');
  const counterEl = loader.querySelector('[data-loader-counter]');
  const statusEl = loader.querySelector('[data-loader-status]');
  const corners = loader.querySelectorAll('.loader-corner');
  const logo = loader.querySelector('[data-loader-logo]');

  if (!reveal || !stage || !logoWrap || !dot) {
    hideLoaderEl();
    return;
  }

  const stageW = stage.offsetWidth || 420;

  await sleep(200);
  if (isStale()) return;

  // Restart so the full 5s logo cycle plays from frame 0 while visible.
  restartGif(logo);
  const gifStartedAt = performance.now();

  await fadeIn(logoWrap, 750, 'translateY(12px) scale(0.96)');
  if (isStale()) return;

  await fadeIn(tagline, 650, 'translateY(8px)');
  if (isStale()) return;

  hud.style.opacity = '1';
  hud.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: 'forwards' });

  const elapsedBeforeHud = performance.now() - gifStartedAt;
  const holdMs = Math.max(1800, LOADER_GIF_MS - elapsedBeforeHud);

  await Promise.all([
    animateCounter(counterEl, statusEl, 100, holdMs, 0),
    expandRule(ruleBottom, stageW, Math.min(1200, holdMs)),
    sleep(Math.min(900, holdMs * 0.45)).then(() => {
      corners.forEach((c) => c.classList.add('is-locked'));
    }),
  ]);

  const remainingGif = LOADER_GIF_MS - (performance.now() - gifStartedAt);
  if (remainingGif > 0) {
    await sleep(remainingGif);
  }

  await sleep(280);
  if (isStale()) return;

  const curtainAnchor = logo || logoWrap;
  await curtainReveal(curtainAnchor, reveal, loader);
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
    .then(() => sleep(100))
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

const LOADER_MSGS = ['Loading…', 'Crafting…', 'Polishing…', 'Ready'];
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_CURTAIN = 'cubic-bezier(0.76, 0, 0.24, 1)';

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

export function resetLoaderSession() {
  loaderSessionComplete = false;
  loaderSessionPromise = null;
  siteReadyApplied = false;
  loaderRunId += 1;
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

function revealChar(el, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const anim = el.animate([
        { opacity: 0, transform: 'translateY(14px) scaleY(0.85)', filter: 'blur(4px)' },
        { opacity: 1, transform: 'translateY(0) scaleY(1)', filter: 'blur(0px)' },
      ], { duration: 650, fill: 'forwards', easing: EASE_OUT });
      anim.onfinish = resolve;
    }, delay);
  });
}

function dotEntrance(circleWrap, dot) {
  return new Promise((resolve) => {
    const anim = circleWrap.animate([
      { opacity: 0, transform: 'scale(0.4)' },
      { opacity: 1, transform: 'scale(1.08)' },
      { opacity: 1, transform: 'scale(1)' },
    ], { duration: 800, fill: 'forwards', easing: EASE_SPRING });
    dot.animate([
      { background: '#ffffff' },
      { background: 'var(--brand-orange, #f25828)' },
    ], { duration: 900, fill: 'forwards', easing: 'ease-out' });
    anim.onfinish = resolve;
  });
}

function showEyebrow(el) {
  el.animate([
    { opacity: 0, transform: 'translateY(6px)' },
    { opacity: 1, transform: 'translateY(0)' },
  ], { duration: 700, fill: 'forwards', easing: 'ease-out' });
}

function expandRule(rule, width, duration) {
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

function curtainReveal(dot, reveal, loader) {
  return new Promise((resolve) => {
    const rect = dot.getBoundingClientRect();
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

async function runLuxuryLoader(loader, isStale) {
  const reveal = document.querySelector('.loader-curtain-reveal');
  const stage = loader.querySelector('.loader-stage');
  const eyebrow = loader.querySelector('.loader-eyebrow');
  const ruleTop = loader.querySelector('.loader-rule--top');
  const ruleBottom = loader.querySelector('.loader-rule--bottom');
  const circleWrap = loader.querySelector('.loader-char--circle');
  const dot = loader.querySelector('[data-loader-dot]');
  const hud = loader.querySelector('.loader-hud');
  const counterEl = loader.querySelector('[data-loader-counter]');
  const statusEl = loader.querySelector('[data-loader-status]');
  const corners = loader.querySelectorAll('.loader-corner');
  const chars = loader.querySelectorAll('[data-loader-char]');

  if (!reveal || !stage || !dot || !circleWrap) {
    hideLoaderEl();
    return;
  }

  chars.forEach((el) => { el.style.opacity = '0'; });
  circleWrap.style.opacity = '0';

  const stageW = stage.offsetWidth || 420;

  await sleep(250);
  if (isStale()) return;

  showEyebrow(eyebrow);
  expandRule(ruleTop, stageW, 500);

  await sleep(320);
  if (isStale()) return;

  dotEntrance(circleWrap, dot);
  await sleep(150);
  if (isStale()) return;

  await Promise.all(Array.from(chars).map((el, i) => revealChar(el, i * 65)));
  await sleep(200);
  if (isStale()) return;

  hud.style.opacity = '1';
  hud.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: 'forwards' });

  let countVal = 0;
  await Promise.all([
    animateCounter(counterEl, statusEl, 100, 1100, countVal).then((v) => { countVal = v; }),
    expandRule(ruleBottom, stageW, 900),
    sleep(600).then(() => {
      corners.forEach((c) => c.classList.add('is-locked'));
      dot.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.09)' },
        { transform: 'scale(1)' },
      ], { duration: 500, easing: 'ease-in-out' });
    }),
  ]);

  await sleep(380);
  if (isStale()) return;

  await curtainReveal(dot, reveal, loader);
}

export function bootSiteLoader(options) {
  return initSiteLoader(options);
}

export function whenSiteLoaderReady(options) {
  return initSiteLoader(options);
}

export function destroySiteLoader() {
  if (loaderSessionComplete || loaderSessionPromise) {
    return;
  }

  loaderRunId += 1;
  hideLoaderEl();
}

/** Skip GoodWork loader for templates that ship their own preloader. */
export function skipSiteLoader() {
  loaderRunId += 1;
  loaderSessionPromise = null;
  hideLoaderEl();
  loaderSessionComplete = true;
  applySiteReady();
}

/**
 * Luxury GoodWork loader with orange dot curtain reveal.
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
      return runLuxuryLoader(loader, staleCheck);
    })
    .catch(() => {})
    .finally(() => {
      finishLoaderSession(runId);
    });

  return loaderSessionPromise;
}

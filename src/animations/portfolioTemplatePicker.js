import { PORTFOLIO_BG_COLORS, PORTFOLIO_TEMPLATES } from '../data/portfolioTemplates.js';

const VISIBLE_RANGE = 2.2;
const HERO_CLEAR_SPAN = 0.4;
const HERO_LINE_OPACITY = 0.7;
const HERO_NEIGHBOR_OPACITY = 0.62;
const GLIDE_MS = 1100;
const WHEEL_THRESHOLD = 48;
const LERP = 0.09;

const glideEase = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function spaceT(t) {
  return Math.sign(t) * Math.pow(Math.abs(t), 0.82);
}

function layerOpacity(d, falloff) {
  if (d >= VISIBLE_RANGE) return 0;
  return Math.max(0, 1 - Math.pow(d / VISIBLE_RANGE, falloff));
}

function bgOpacity(st) {
  const d = Math.abs(st);
  if (d >= 1.05) return 0;
  return Math.max(0, 1 - Math.pow(d / 0.92, 1.35));
}

function titleScale(st) {
  const d = Math.abs(st);
  return Math.max(0.72, 1 - d * 0.08);
}

function titleOpacity(st) {
  return layerOpacity(Math.abs(st), 0.65);
}

function infoOpacity(st) {
  return layerOpacity(Math.abs(st), 0.7);
}

function clearVisibility(st, rawT) {
  const d = Math.abs(st);
  const rawD = Math.abs(rawT);
  const activeW = Math.max(0, 1 - Math.min(rawD, 1) / HERO_CLEAR_SPAN);
  const scale = 0.84 + 0.16 * activeW;
  let zBoost;
  if (activeW > 0.85) zBoost = 95;
  else if (st < 0) zBoost = -8 - Math.round(d * 10);
  else zBoost = -22 - Math.round(d * 10);
  return { activeW, scale, zBoost, d, rawD };
}

function heroImageOpacity(st, rawT) {
  const { activeW, d, rawD } = clearVisibility(st, rawT);
  if (d > 1.35) return 0;
  if (activeW > 0.12) {
    return HERO_LINE_OPACITY + (1 - HERO_LINE_OPACITY) * activeW;
  }
  if (rawD <= 1.2) return 1;
  return 0;
}

const HERO_CARD_SHADOW =
  'drop-shadow(0 28px 56px rgba(0, 0, 0, 0.2)) drop-shadow(0 6px 18px rgba(0, 0, 0, 0.1))';

function heroColorFilter(activeW) {
  const t = Math.max(0, Math.min(1, activeW));
  if (t >= 0.98) return HERO_CARD_SHADOW;
  const gray = 1 - t;
  return `grayscale(${gray}) brightness(${0.88 + t * 0.12}) contrast(${0.95 + t * 0.05}) ${HERO_CARD_SHADOW}`;
}

function applyTemplateTypeColors(el, template) {
  el.style.setProperty('--tpl-title', template.titleColor);
  el.style.setProperty('--tpl-eyebrow', template.eyebrowColor);
  el.style.setProperty('--tpl-title-muted', template.titleMutedColor);
}

export function initPortfolioTemplatePicker({
  section,
  scroller,
  track,
  canvas,
  clipPathId,
  templates = PORTFOLIO_TEMPLATES,
  onSelect,
}) {
  if (!section || !scroller || !track || !canvas) return () => {};

  const P = templates;
  const N = P.length;
  const BG_COLORS = PORTFOLIO_BG_COLORS;

  let SCROLL_PER = section.clientHeight * 1.6;
  let glideRaf = null;
  let scrollLocked = false;
  let wheelAccum = 0;
  let sf = 0;
  let target = 0;

  let VH;
  let VW;
  let TITLE_H;
  let INFO_H;
  let CONTENT_GAP;
  let HERO_W;
  let HERO_H;
  let TITLE_BASE_Y;
  let HERO_BASE_Y;
  let INFO_BASE_Y;
  let TITLE_X;
  let INFO_X;
  let HERO_X;
  let BG_TRAVEL_PX;
  let TITLE_TRAVEL_PX;
  let INFO_TRAVEL_PX;
  let HERO_LINE_STEP_PX;
  let HERO_GAP_PX;
  let INTERACTION_LEFT = 0;
  let INTERACTION_RIGHT = 0;
  let isMobile = false;
  let MOBILE_SLIDE_GAP = 0;
  let MOBILE_HERO_LEFT = 0;

  function setTrackHeight() {
    track.style.height = `${N * SCROLL_PER + section.clientHeight}px`;
  }

  function cancelGlide() {
    if (glideRaf) {
      cancelAnimationFrame(glideRaf);
      glideRaf = null;
    }
    scrollLocked = false;
    wheelAccum = 0;
  }

  function templateIndex(sf) {
    return ((Math.round(sf) % N) + N) % N;
  }

  function shortestOffset(i, sf) {
    let t = i - sf;
    t -= N * Math.round(t / N);
    return t;
  }

  function nearestTargetIndex(sf, idx) {
    const cur = Math.round(sf);
    const curMod = ((cur % N) + N) % N;
    let delta = idx - curMod;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    return cur + delta;
  }

  function syncScroller(sfValue) {
    const wrapped = ((sfValue % N) + N) % N;
    scroller.scrollTop = wrapped * SCROLL_PER;
  }

  function updateDots(renderSf) {
    const active = templateIndex(renderSf);
    dotBtns.forEach((dot, i) => {
      const dist = Math.abs(shortestOffset(i, renderSf));
      dot.classList.toggle('is-active', i === active);
      dot.setAttribute('aria-selected', i === active ? 'true' : 'false');
      dot.style.opacity = String(Math.max(0.35, 1 - dist * 0.45));
    });
  }

  function currentTemplateIndex() {
    return templateIndex(sf);
  }

  function smoothGoToTarget(endTarget) {
    const startTarget = sf;
    cancelGlide();
    wheelAccum = 0;

    if (Math.abs(endTarget - startTarget) < 0.001) {
      sf = endTarget;
      target = endTarget;
      syncScroller(endTarget);
      render(sf);
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sf = endTarget;
      target = endTarget;
      syncScroller(endTarget);
      render(sf);
      return;
    }

    scrollLocked = true;
    const t0 = performance.now();

    function step(now) {
      const p = Math.min(1, (now - t0) / GLIDE_MS);
      const current = startTarget + (endTarget - startTarget) * glideEase(p);
      sf = current;
      target = current;
      syncScroller(current);
      render(sf);
      if (p < 1) glideRaf = requestAnimationFrame(step);
      else {
        sf = endTarget;
        target = endTarget;
        syncScroller(endTarget);
        glideRaf = null;
        scrollLocked = false;
        wheelAccum = 0;
        render(sf);
      }
    }
    glideRaf = requestAnimationFrame(step);
  }

  function goToProject(i) {
    smoothGoToTarget(nearestTargetIndex(sf, i));
  }

  function goToNextTemplate() {
    smoothGoToTarget(Math.round(sf) + 1);
  }

  function goToPrevTemplate() {
    smoothGoToTarget(Math.round(sf) - 1);
  }

  function snapScrollStep(direction) {
    if (scrollLocked) return;
    if (direction > 0) goToNextTemplate();
    else goToPrevTemplate();
  }

  function selectTemplate(i) {
    const idx = ((i % N) + N) % N;
    goToProject(idx);
    const detail = { index: idx, id: P[idx].id, template: P[idx] };
    section.dispatchEvent(new CustomEvent('template-select', { bubbles: true, detail }));
    onSelect?.(detail);
  }

  function layerInFrame(top, height) {
    const bottom = top + height;
    const visible = Math.min(bottom, VH) - Math.max(top, 0);
    return visible > height * 0.42;
  }

  function heroInFrame(lineY, scale, rawT) {
    const top = HERO_BASE_Y + lineY;
    const height = HERO_H * scale;
    const bottom = top + height;
    const visible = Math.min(bottom, VH) - Math.max(top, 0);
    const minRatio = Math.abs(rawT) <= 1.2 ? 0.08 : 0.42;
    return visible > height * minRatio;
  }

  function heroParallelogramLine(st, rawT) {
    const cv = clearVisibility(st, rawT);
    const gap = HERO_GAP_PX;
    const h = HERO_H;
    const s = cv.scale;
    // Edge-aligned step: account for center-origin scale so card tops/bottoms
    // stay an equal gap from the active hero at ±1.
    const step = gap + h * (1 + s) * 0.5;
    const lineY = rawT * step;

    return {
      lineY,
      lineX: rawT * (HERO_W * 0.02),
      rotZ: rawT * 1,
      ...cv,
    };
  }

  const bgLayers = P.map((_, i) => {
    const el = document.createElement('div');
    el.className = 'template-picker__bg';
    el.dataset.i = i;
    canvas.appendChild(el);
    return el;
  });

  const titleLayers = P.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'template-picker__title';
    el.dataset.i = i;
    applyTemplateTypeColors(el, p);
    el.innerHTML = `
      <div class="template-picker__eyebrow">${p.eyebrow}</div>
      <div class="template-picker__title-text">${p.title}</div>
    `;
    canvas.appendChild(el);
    return el;
  });

  const heroLayers = P.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'template-picker__hero';
    el.dataset.i = i;
    el.innerHTML = `
      <div class="template-picker__hero-card">
        <div class="template-picker__hero-fill"></div>
        <img class="template-picker__hero-img" src="${p.heroImg}" alt="${p.title} portfolio template preview" loading="eager" decoding="async"/>
      </div>
    `;
    const card = el.querySelector('.template-picker__hero-card');
    const clip = `url(#${clipPathId})`;
    card.style.clipPath = clip;
    card.style.webkitClipPath = clip;
    const img = el.querySelector('.template-picker__hero-img');
    img.addEventListener('error', () => { img.src = p.thumbImg; });
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (scrollLocked) return;
      const offset = shortestOffset(i, sf);
      if (Math.abs(offset) < 0.4 || Math.abs(offset) > 1.2) return;
      goToProject(i);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (scrollLocked) return;
      const offset = shortestOffset(i, sf);
      if (Math.abs(offset) < 0.4 || Math.abs(offset) > 1.2) return;
      goToProject(i);
    });
    canvas.appendChild(el);
    return el;
  });

  const infoLayers = P.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'template-picker__info';
    el.dataset.i = i;
    const disabled = !p.href;
    el.innerHTML = `
      <div class="template-picker__desc">${p.desc}</div>
      <button type="button" class="template-picker__cta${disabled ? ' is-disabled' : ''}" data-template-id="${p.id}" ${disabled ? 'disabled' : ''}>
        <span>${p.cta}</span>
        <span class="template-picker__cta-arrow">→</span>
      </button>
    `;
    canvas.appendChild(el);
    return el;
  });

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'template-picker__dots';
  dotsWrap.setAttribute('role', 'tablist');
  dotsWrap.setAttribute('aria-label', 'Template slides');
  const dotBtns = P.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'template-picker__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to template ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToProject(i));
    dotsWrap.appendChild(dot);
    return dot;
  });
  section.insertBefore(dotsWrap, canvas);

  infoLayers.forEach((layer, i) => {
    const btn = layer.querySelector('.template-picker__cta');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!P[i].href) return;
      selectTemplate(i);
    });
  });

  function applyHeroClip(useClip) {
    const clip = useClip ? `url(#${clipPathId})` : 'none';
    heroLayers.forEach((layer) => {
      const card = layer.querySelector('.template-picker__hero-card');
      card.style.clipPath = clip;
      card.style.webkitClipPath = clip;
    });
  }

  function positionDots() {
    if (isMobile) {
      section.style.removeProperty('--picker-dots-left');
      return;
    }
    const dotGap = Math.min(VW * 0.032, 36);
    section.style.setProperty('--picker-dots-left', `${HERO_X + HERO_W + dotGap}px`);
  }

  function measure() {
    VH = section.clientHeight;
    VW = section.clientWidth;
    isMobile = VW <= 700;
    section.classList.toggle('is-mobile', isMobile);
    SCROLL_PER = VH * 1.6;
    setTrackHeight();

    const sampleTitle = titleLayers[0];
    sampleTitle.style.visibility = 'hidden';
    sampleTitle.style.transform = 'none';
    sampleTitle.style.opacity = '1';
    TITLE_H = sampleTitle.offsetHeight;
    sampleTitle.style.visibility = '';

    const sampleInfo = infoLayers[0];
    sampleInfo.style.visibility = 'hidden';
    sampleInfo.style.transform = 'none';
    sampleInfo.style.opacity = '1';
    INFO_H = sampleInfo.offsetHeight;
    sampleInfo.style.visibility = '';

    let maxTitleW = 0;
    titleLayers.forEach((el) => {
      const text = el.querySelector('.template-picker__title-text');
      maxTitleW = Math.max(maxTitleW, text.offsetWidth);
    });

    const sampleHero = heroLayers[0].querySelector('.template-picker__hero-card');
    HERO_W = sampleHero.offsetWidth;
    HERO_H = sampleHero.offsetHeight;
    HERO_GAP_PX = Math.round(Math.min(36, Math.max(20, VH * 0.032)));

    if (isMobile) {
      applyHeroClip(false);

      MOBILE_SLIDE_GAP = HERO_W + HERO_GAP_PX;
      MOBILE_HERO_LEFT = (VW - HERO_W) / 2;
      HERO_BASE_Y = VH * 0.11;
      TITLE_BASE_Y = HERO_BASE_Y + HERO_H + VH * 0.035;
      INFO_BASE_Y = TITLE_BASE_Y + TITLE_H + 12;

      INTERACTION_LEFT = 0;
      INTERACTION_RIGHT = VW;

      titleLayers.forEach((el) => {
        el.style.left = '50%';
        el.style.textAlign = 'center';
      });
      infoLayers.forEach((el) => {
        el.style.left = '50%';
        el.style.width = `${Math.min(VW - 48, 400)}px`;
        el.style.textAlign = 'center';
      });
      heroLayers.forEach((el) => {
        el.style.left = `${MOBILE_HERO_LEFT}px`;
        el.style.top = `${HERO_BASE_Y}px`;
        el.style.width = 'auto';
      });

      BG_TRAVEL_PX = 0;
      TITLE_TRAVEL_PX = 0;
      INFO_TRAVEL_PX = 0;
      HERO_LINE_STEP_PX = MOBILE_SLIDE_GAP;
      positionDots();
      return;
    }

    applyHeroClip(true);

    CONTENT_GAP = Math.round(Math.min(26, Math.max(18, VH * 0.026)));
    HERO_BASE_Y = (VH - HERO_H) * 0.5;
    const heroCenterY = HERO_BASE_Y + HERO_H / 2;
    const contentBlockH = TITLE_H + CONTENT_GAP + INFO_H;
    const contentTop = heroCenterY - contentBlockH / 2;
    TITLE_BASE_Y = contentTop;
    INFO_BASE_Y = contentTop + TITLE_H + CONTENT_GAP;

    const gap = Math.min(VW * 0.055, 56);
    const contentW = maxTitleW + gap + HERO_W;
    const edgePad = 32;
    const blockX = Math.max(edgePad, (VW - contentW) / 2);

    TITLE_X = blockX;
    INFO_X = blockX;
    HERO_X = blockX + maxTitleW + gap;

    const infoW = Math.min(360, VW * 0.42);
    INTERACTION_LEFT = blockX;
    INTERACTION_RIGHT = blockX + Math.max(contentW, infoW);

    titleLayers.forEach((el) => {
      el.style.left = `${TITLE_X}px`;
      el.style.textAlign = '';
    });
    infoLayers.forEach((el) => {
      el.style.left = `${INFO_X}px`;
      el.style.width = '';
      el.style.textAlign = '';
    });
    heroLayers.forEach((el) => {
      el.style.left = `${HERO_X}px`;
      el.style.top = '';
      el.style.width = 'auto';
    });

    positionDots();

    BG_TRAVEL_PX = VH * 0.08;
    TITLE_TRAVEL_PX = VH * 0.5;
    INFO_TRAVEL_PX = TITLE_TRAVEL_PX;
    HERO_LINE_STEP_PX = HERO_H * 0.84;
  }

  function renderMobile(renderSf) {
    const active = templateIndex(renderSf);
    section.style.background = BG_COLORS[active];
    updateDots(renderSf);

    P.forEach((_, i) => {
      const t = shortestOffset(i, renderSf);
      const st = spaceT(t);
      const abs = Math.abs(st);
      const rawDist = Math.abs(t);
      const z = Math.round(500 - abs * 80);
      const inRange = rawDist <= 2.4;
      const activeW = Math.max(0, 1 - Math.min(rawDist, 1) / HERO_CLEAR_SPAN);
      const scale = 0.76 + 0.24 * activeW;
      const zBoost = activeW > 0.85 ? 95 : -Math.round(abs * 20);

      const bOp = bgOpacity(st);
      bgLayers[i].style.transform = 'none';
      bgLayers[i].style.opacity = bOp;
      bgLayers[i].style.zIndex = z;
      bgLayers[i].style.visibility = bOp > 0.02 ? 'visible' : 'hidden';

      const slideX = t * MOBILE_SLIDE_GAP;
      const hOp = heroImageOpacity(st, t);
      const heroCard = heroLayers[i].querySelector('.template-picker__hero-card');
      const heroImg = heroCard.querySelector('.template-picker__hero-img');
      heroLayers[i].style.transform = `translateX(${slideX}px)`;
      heroCard.style.transform = `rotate(0deg) scale(${scale})`;
      heroCard.style.filter = heroColorFilter(activeW);
      heroCard.style.setProperty('--hero-shine', String(1 - activeW));
      heroLayers[i].style.opacity = '1';
      heroImg.style.opacity = hOp;
      heroLayers[i].style.zIndex = z + 5 + zBoost;
      heroLayers[i].style.visibility = inRange && hOp > 0.04 ? 'visible' : 'hidden';
      const isNeighborClickable = inRange && hOp > 0.04 && rawDist > 0.35 && rawDist <= 1.15;
      heroLayers[i].style.pointerEvents = isNeighborClickable ? 'auto' : 'none';
      heroLayers[i].classList.toggle('is-neighbor-hero', isNeighborClickable);

      const contentStrength = activeW > 0.55 ? 1 : 0.7 + activeW * 0.55;
      const isActiveContent = activeW > 0.8;
      titleLayers[i].classList.toggle('is-active', isActiveContent);
      infoLayers[i].classList.toggle('is-active', isActiveContent);

      const tOp = titleOpacity(st) * contentStrength;
      titleLayers[i].style.opacity = tOp;
      titleLayers[i].style.zIndex = activeW > 0.85 ? z + 8 : z + 18;
      titleLayers[i].style.transformOrigin = 'center center';
      titleLayers[i].style.transform =
        `translate(-50%, ${TITLE_BASE_Y}px) scale(${titleScale(st)})`;
      titleLayers[i].style.visibility = inRange && tOp > 0.02 ? 'visible' : 'hidden';

      const iOp = infoOpacity(st) * contentStrength;
      infoLayers[i].style.opacity = iOp;
      infoLayers[i].style.zIndex = activeW > 0.85 ? z + 8 : z + 20;
      infoLayers[i].style.transform = `translate(-50%, ${INFO_BASE_Y}px)`;
      infoLayers[i].style.visibility = inRange && iOp > 0.02 ? 'visible' : 'hidden';
    });

    section.dataset.selectedTemplate = P[active].id;
    section.dataset.selectedIndex = String(active);
  }

  function renderDesktop(renderSf) {
    const active = templateIndex(renderSf);
    section.style.background = BG_COLORS[active];
    updateDots(renderSf);

    P.forEach((_, i) => {
      const t = shortestOffset(i, renderSf);
      const st = spaceT(t);
      const abs = Math.abs(st);
      const z = Math.round(500 - abs * 80);
      const inRange = abs <= VISIBLE_RANGE;

      const bOp = bgOpacity(st);
      bgLayers[i].style.transform = 'none';
      bgLayers[i].style.opacity = bOp;
      bgLayers[i].style.zIndex = z;
      bgLayers[i].style.visibility = bOp > 0.02 ? 'visible' : 'hidden';

      const contentTravel = t * TITLE_TRAVEL_PX;
      const titleY = TITLE_BASE_Y + contentTravel;
      titleLayers[i].style.transform =
        `translate(0px, ${titleY}px) scale(${titleScale(st)})`;

      const para = heroParallelogramLine(st, t);
      const hOp = heroImageOpacity(st, t);
      const heroCard = heroLayers[i].querySelector('.template-picker__hero-card');
      const heroImg = heroCard.querySelector('.template-picker__hero-img');
      const heroTop = HERO_BASE_Y + para.lineY;
      heroLayers[i].style.transform = `translate(${para.lineX}px, ${heroTop}px)`;
      heroCard.style.transform = `rotate(${para.rotZ}deg) scale(${para.scale})`;
      heroCard.style.filter = heroColorFilter(para.activeW);
      heroCard.style.setProperty('--hero-shine', String(para.activeW > 0.55 ? 0 : 0.22));
      heroLayers[i].classList.toggle('is-active-hero', para.activeW > 0.85);
      heroLayers[i].style.opacity = '1';
      heroImg.style.opacity = hOp;
      let heroZ;
      if (para.activeW > 0.85) {
        heroZ = z + 5 + para.zBoost;
      } else if (Math.abs(t) <= 1.15) {
        heroZ = 560 + Math.round((1 - Math.abs(t)) * 20);
      } else {
        heroZ = z + 5 + para.zBoost;
      }
      heroLayers[i].style.zIndex = String(heroZ);
      const heroVisible = inRange && hOp > 0.04 && heroInFrame(para.lineY, para.scale, t);
      const isNeighborClickable = heroVisible && Math.abs(t) > 0.35 && Math.abs(t) <= 1.15;
      heroLayers[i].style.visibility = heroVisible ? 'visible' : 'hidden';
      heroLayers[i].style.pointerEvents = isNeighborClickable ? 'auto' : 'none';
      heroLayers[i].classList.toggle('is-neighbor-hero', isNeighborClickable);
      heroLayers[i].setAttribute('aria-hidden', isNeighborClickable ? 'false' : 'true');
      if (isNeighborClickable) {
        heroLayers[i].setAttribute('role', 'button');
        heroLayers[i].setAttribute('tabindex', '0');
        heroLayers[i].setAttribute('aria-label', `View ${P[i].title} template`);
      } else {
        heroLayers[i].removeAttribute('role');
        heroLayers[i].removeAttribute('tabindex');
        heroLayers[i].removeAttribute('aria-label');
      }

      const contentStrength = para.activeW > 0.55 ? 1 : 0.7 + para.activeW * 0.55;
      const isActiveContent = para.activeW > 0.8;
      titleLayers[i].classList.toggle('is-active', isActiveContent);
      infoLayers[i].classList.toggle('is-active', isActiveContent);

      const tOp = titleOpacity(st) * contentStrength;
      titleLayers[i].style.opacity = tOp;
      titleLayers[i].style.zIndex = para.activeW > 0.85 ? z + 8 : z + 18;
      titleLayers[i].style.transformOrigin = 'left center';
      const titleVisible = inRange && tOp > 0.02 && layerInFrame(titleY, TITLE_H * titleScale(st));
      titleLayers[i].style.visibility = titleVisible ? 'visible' : 'hidden';

      const iOp = infoOpacity(st) * contentStrength;
      infoLayers[i].style.opacity = iOp;
      infoLayers[i].style.zIndex = para.activeW > 0.85 ? z + 8 : z + 20;
      const infoY = INFO_BASE_Y + contentTravel;
      infoLayers[i].style.transform = `translateY(${infoY}px)`;
      const infoVisible = inRange && iOp > 0.02 && layerInFrame(infoY, INFO_H);
      infoLayers[i].style.visibility = infoVisible ? 'visible' : 'hidden';
    });

    section.dataset.selectedTemplate = P[active].id;
    section.dataset.selectedIndex = String(active);
  }

  function render(renderSf) {
    if (isMobile) {
      renderMobile(renderSf);
      return;
    }
    renderDesktop(renderSf);
  }

  function onScroll() {
    if (scrollLocked) return;
  }

  function isInInteractionZone(clientX, clientY) {
    const rect = section.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (y < 0 || y > rect.height) return false;
    if (isMobile) return true;
    return x >= INTERACTION_LEFT && x <= INTERACTION_RIGHT;
  }

  function onWheel(e) {
    if (isMobile) return;

    if (!isInInteractionZone(e.clientX, e.clientY)) {
      wheelAccum = 0;
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    if (scrollLocked) return;

    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    snapScrollStep(wheelAccum > 0 ? 1 : -1);
    wheelAccum = 0;
  }

  function onKeyDown(e) {
    if (!section.contains(document.activeElement) && document.activeElement !== section) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      goToNextTemplate();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevTemplate();
    }
  }

  let touchY0 = null;
  let touchX0 = null;
  let touchAxis = null;

  function onTouchStart(e) {
    if (scrollLocked) return;
    const touch = e.touches[0];
    if (!isInInteractionZone(touch.clientX, touch.clientY)) return;
    touchY0 = touch.clientY;
    touchX0 = touch.clientX;
    touchAxis = null;
  }

  function onTouchMove(e) {
    if (!isMobile || scrollLocked || touchX0 === null || touchY0 === null) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchX0;
    const dy = touch.clientY - touchY0;
    if (touchAxis === null) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      touchAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (touchAxis === 'x') {
      e.preventDefault();
    }
  }

  function onTouchEnd(e) {
    if (touchY0 === null || touchX0 === null || scrollLocked) return;
    const touch = e.changedTouches[0];
    if (!isInInteractionZone(touch.clientX, touch.clientY)) {
      touchY0 = null;
      touchX0 = null;
      touchAxis = null;
      return;
    }
    const dx = touchX0 - touch.clientX;
    const dy = touchY0 - touch.clientY;
    const axis = touchAxis;
    touchY0 = null;
    touchX0 = null;
    touchAxis = null;

    if (isMobile) {
      if (axis === 'x' && Math.abs(dx) > 40) {
        snapScrollStep(dx > 0 ? 1 : -1);
      }
      return;
    }

    if (Math.abs(dy) > 40) snapScrollStep(dy > 0 ? 1 : -1);
  }

  function onPointerDown(e) {
    if (isInInteractionZone(e.clientX, e.clientY)) {
      section.focus({ preventScroll: true });
    }
  }

  function onResize() {
    measure();
    render(sf);
  }

  setTrackHeight();
  scroller.addEventListener('scroll', onScroll, { passive: true });
  section.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  section.addEventListener('touchstart', onTouchStart, { passive: true });
  section.addEventListener('touchmove', onTouchMove, { passive: false });
  section.addEventListener('touchend', onTouchEnd, { passive: true });
  section.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', onResize);

  let resizeObs;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObs = new ResizeObserver(onResize);
    resizeObs.observe(section);
  }

  P.forEach((p) => { const img = new Image(); img.src = p.heroImg; });
  measure();
  syncScroller(0);
  render(0);

  section.goToTemplate = goToProject;
  section.goToNextTemplate = goToNextTemplate;
  section.goToPrevTemplate = goToPrevTemplate;

  return function cleanup() {
    cancelGlide();
    scroller.removeEventListener('scroll', onScroll);
    section.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeyDown);
    section.removeEventListener('touchstart', onTouchStart);
    section.removeEventListener('touchmove', onTouchMove);
    section.removeEventListener('touchend', onTouchEnd);
    section.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('resize', onResize);
    resizeObs?.disconnect();
    dotsWrap.remove();
    canvas.innerHTML = '';
    delete section.goToTemplate;
    delete section.goToNextTemplate;
    delete section.goToPrevTemplate;
  };
}

/**
 * MERIDIAN FOOTER CURVE — scroll + DOM diagnostic
 *
 * HOW TO USE
 * 1. Open http://localhost:5173/cv/meridian (or your dev URL)
 * 2. Wait until the loader finishes (<html class="site-ready">)
 * 3. Open DevTools → Console
 * 4. Paste this ENTIRE file and press Enter
 * 5. Click "▶ Run capture" on the panel (top-right), or scroll manually
 * 6. Click "⬇ Download report" — sends JSON + PNG screenshots to your Downloads
 *
 * What it checks
 * - curve-wrap height (NaN / 0 / px values)
 * - ScrollTrigger pin + progress on #contact
 * - heading vs curve-bottom overlap (viewport gap)
 * - z-index / visibility / DOM layer structure
 * - movement: whether heading tracks curve edge (attached) vs independent reveal
 */
(async function meridianFooterDiagnose() {
  const TAG = '[meridian-diagnose]';
  const SAMPLE_MS = 80;
  const AUTO_SCROLL_STEPS = 28;
  const AUTO_SCROLL_PAUSE_MS = 120;

  if (!location.pathname.includes('meridian')) {
    console.warn(TAG, 'Not on /cv/meridian — results may be invalid. Current:', location.pathname);
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  function waitForSiteReady(timeoutMs = 90000) {
    return new Promise((resolve, reject) => {
      if (document.documentElement.classList.contains('site-ready')) {
        resolve();
        return;
      }
      const t0 = Date.now();
      const tick = () => {
        if (document.documentElement.classList.contains('site-ready')) {
          resolve();
          return;
        }
        if (Date.now() - t0 > timeoutMs) {
          reject(new Error('Timed out waiting for html.site-ready'));
          return;
        }
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  function rectSnapshot(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      top: Math.round(r.top),
      left: Math.round(r.left),
      width: Math.round(r.width),
      height: Math.round(r.height),
      bottom: Math.round(r.bottom),
      right: Math.round(r.right),
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display,
      zIndex: cs.zIndex,
      transform: cs.transform,
      overflow: cs.overflow,
    };
  }

  function getScrollTriggerForContact() {
    const ST = window.ScrollTrigger || window.gsap?.plugins?.scrollTrigger?.ScrollTrigger;
    if (!ST?.getAll) return null;
    return ST.getAll().find((t) => t.trigger?.id === 'contact' || t.vars?.trigger?.id === 'contact') ?? null;
  }

  function sampleFrame(scrollPhase = 'manual') {
    const contact = $('#contact');
    const panel = $('.meridian-contact__panel', contact);
    const overlay = $('.meridian-contact__curve-overlay', contact);
    const wrap = $('.meridian-contact__curve-wrap', contact);
    const ellipse = $('.meridian-contact__curve-ellipse', contact);
    const heading = $('.meridian-contact__heading', contact);
    const headingWrap = $('.meridian-contact__heading-wrap', contact);
    const capabilities = $('.meridian-capabilities');

    const wrapRect = rectSnapshot(wrap);
    const headingRect = rectSnapshot(heading);
    const capabilitiesRect = rectSnapshot(capabilities);

    const st = getScrollTriggerForContact();
    const wrapInlineH = wrap?.style.height || '';
    const wrapComputedH = wrap ? getComputedStyle(wrap).height : '';
    const parsedInline = parseFloat(wrapInlineH);
    const isNaNHeight = wrapInlineH !== '' && Number.isNaN(parsedInline);

    const curveBottomVp = wrapRect?.bottom ?? null;
    const headingTopVp = headingRect?.top ?? null;
    const gapHeadingBelowCurve = curveBottomVp != null && headingTopVp != null
      ? Math.round(headingTopVp - curveBottomVp)
      : null;

    const capabilitiesBottom = capabilitiesRect?.bottom ?? null;
    const contactTop = rectSnapshot(contact)?.top ?? null;
    const junctionGap = capabilitiesBottom != null && contactTop != null
      ? Math.round(contactTop - capabilitiesBottom)
      : null;

    return {
      t: Date.now(),
      scrollPhase,
      scrollY: Math.round(window.scrollY),
      innerHeight: window.innerHeight,
      siteReady: document.documentElement.classList.contains('site-ready'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollTrigger: st
        ? {
            progress: Number(st.progress.toFixed(4)),
            direction: st.direction,
            isActive: st.isActive,
            start: st.start,
            end: st.end,
            pin: !!st.pin,
          }
        : null,
      dom: {
        hasContact: !!contact,
        hasOverlay: !!overlay,
        hasWrap: !!wrap,
        hasEllipse: !!ellipse,
        overlayParent: overlay?.parentElement?.className || null,
        overlayInsidePanel: !!panel?.contains(overlay),
      },
      curve: {
        inlineHeight: wrapInlineH,
        computedHeight: wrapComputedH,
        cssVarMaxHeight: contact ? getComputedStyle(contact).getPropertyValue('--meridian-curve-max-height').trim() : '',
        isNaNHeight,
        isZeroHeight: wrapComputedH === '0px',
        wrapRect,
        ellipseTransform: ellipse ? getComputedStyle(ellipse).transform : null,
      },
      heading: {
        rect: headingRect,
        wrapRect: rectSnapshot(headingWrap),
        gapBelowCurvePx: gapHeadingBelowCurve,
        attachedToCurve: gapHeadingBelowCurve != null && Math.abs(gapHeadingBelowCurve) < 4,
      },
      layout: {
        capabilitiesBottom,
        contactTop,
        junctionGap,
        panelRect: rectSnapshot(panel),
        contactRect: rectSnapshot(contact),
      },
    };
  }

  function analyze(samples) {
    const issues = [];
    const heights = samples.map((s) => s.curve.computedHeight).filter(Boolean);
    const uniqueHeights = [...new Set(heights)];

    if (samples.some((s) => s.curve.isNaNHeight)) {
      issues.push({
        severity: 'critical',
        code: 'CURVE_HEIGHT_NAN',
        message: 'curve-wrap inline height is NaN — animation math is broken (vh string × number bug or similar).',
      });
    }

    if (samples.every((s) => s.curve.isZeroHeight || s.curve.computedHeight === '0px')) {
      issues.push({
        severity: 'critical',
        code: 'CURVE_ALWAYS_ZERO',
        message: 'curve-wrap height is always 0 — reduced motion, collapsed end-state, or JS never set height.',
      });
    }

    if (!samples[0]?.dom.hasOverlay) {
      issues.push({
        severity: 'critical',
        code: 'MISSING_OVERLAY',
        message: '.meridian-contact__curve-overlay not found in DOM.',
      });
    }

    if (samples.some((s) => s.dom.overlayInsidePanel)) {
      issues.push({
        severity: 'high',
        code: 'OVERLAY_INSIDE_PANEL',
        message: 'Curve overlay is inside .meridian-contact__panel — may be clipped by overflow:hidden.',
      });
    }

    if (!samples.some((s) => s.scrollTrigger)) {
      issues.push({
        severity: 'high',
        code: 'NO_SCROLL_TRIGGER',
        message: 'No ScrollTrigger found on #contact — initMeridianFooterCurve may not have run.',
      });
    }

    if (samples.some((s) => s.reducedMotion)) {
      issues.push({
        severity: 'info',
        code: 'REDUCED_MOTION',
        message: 'prefers-reduced-motion: reduce is ON — curve animation is intentionally disabled.',
      });
    }

    if (uniqueHeights.length <= 1 && samples.length > 5) {
      issues.push({
        severity: 'high',
        code: 'CURVE_NOT_ANIMATING',
        message: `curve-wrap height never changed during capture (always ${uniqueHeights[0] || 'unknown'}).`,
      });
    }

    const attachedCount = samples.filter((s) => s.heading.attachedToCurve).length;
    if (attachedCount > samples.length * 0.6 && samples.length > 5) {
      issues.push({
        severity: 'high',
        code: 'HEADING_ATTACHED_TO_CURVE',
        message: `Heading stayed within 4px of curve bottom in ${attachedCount}/${samples.length} frames — content moving with curve, not revealed underneath.`,
      });
    }

    const progressValues = samples.map((s) => s.scrollTrigger?.progress).filter((p) => p != null);
    if (progressValues.length && Math.max(...progressValues) < 0.05) {
      issues.push({
        severity: 'medium',
        code: 'PIN_NEVER_SCRUBBED',
        message: 'ScrollTrigger progress stayed near 0 — footer pin/scrub zone may not have been reached.',
      });
    }

    if (progressValues.length && Math.min(...progressValues) > 0.95) {
      issues.push({
        severity: 'medium',
        code: 'ALREADY_AT_END',
        message: 'ScrollTrigger progress near 1 — curve fully collapsed; flat edge is expected at end state.',
      });
    }

    return issues;
  }

  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function captureScreenshot(label, html2canvas) {
    const contact = $('#contact');
    if (!contact || !html2canvas) return null;
    try {
      const canvas = await html2canvas(contact, {
        backgroundColor: null,
        scale: Math.min(2, window.devicePixelRatio || 1),
        logging: false,
        useCORS: true,
      });
      return {
        label,
        scrollY: Math.round(window.scrollY),
        dataUrl: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height,
      };
    } catch (err) {
      return { label, error: String(err) };
    }
  }

  // ── UI panel ──
  const panel = document.createElement('div');
  panel.id = 'meridian-footer-diagnose-panel';
  panel.innerHTML = `
    <style>
      #meridian-footer-diagnose-panel {
        position: fixed; top: 12px; right: 12px; z-index: 999999;
        font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background: #111; color: #eee; border: 1px solid #444; border-radius: 10px;
        padding: 12px; width: 320px; box-shadow: 0 8px 32px rgba(0,0,0,.45);
      }
      #meridian-footer-diagnose-panel h3 { margin: 0 0 8px; font-size: 13px; color: #fff; }
      #meridian-footer-diagnose-panel .row { margin: 4px 0; }
      #meridian-footer-diagnose-panel .ok { color: #6ee7a0; }
      #meridian-footer-diagnose-panel .bad { color: #f87171; }
      #meridian-footer-diagnose-panel .warn { color: #fbbf24; }
      #meridian-footer-diagnose-panel button {
        margin: 4px 4px 0 0; padding: 6px 10px; border-radius: 6px;
        border: 1px solid #555; background: #222; color: #fff; cursor: pointer;
      }
      #meridian-footer-diagnose-panel button:hover { background: #333; }
      #meridian-footer-diagnose-panel pre {
        margin: 8px 0 0; max-height: 140px; overflow: auto; font-size: 10px;
        background: #0a0a0a; padding: 8px; border-radius: 6px; white-space: pre-wrap;
      }
    </style>
    <h3>Meridian footer diagnose</h3>
    <div class="row" id="mfd-status">Initializing…</div>
    <div class="row" id="mfd-live">—</div>
    <button type="button" id="mfd-run">▶ Run capture</button>
    <button type="button" id="mfd-dl" disabled>⬇ Download report</button>
    <button type="button" id="mfd-close">✕</button>
    <pre id="mfd-log"></pre>
  `;
  document.body.appendChild(panel);

  const statusEl = $('#mfd-status', panel);
  const liveEl = $('#mfd-live', panel);
  const logEl = $('#mfd-log', panel);
  const runBtn = $('#mfd-run', panel);
  const dlBtn = $('#mfd-dl', panel);
  const closeBtn = $('#mfd-close', panel);

  let samples = [];
  let screenshots = [];
  let recording = false;
  let lastSampleT = 0;

  function log(msg) {
    logEl.textContent = `${logEl.textContent}\n${msg}`.trim();
    logEl.scrollTop = logEl.scrollHeight;
    console.log(TAG, msg);
  }

  function updateLive() {
    const s = sampleFrame('live');
    const h = s.curve.computedHeight;
    const p = s.scrollTrigger?.progress ?? '—';
    const gap = s.heading.gapBelowCurvePx;
    const hClass = s.curve.isNaNHeight ? 'bad' : s.curve.isZeroHeight ? 'warn' : 'ok';
    liveEl.innerHTML = `
      <span class="${hClass}">curve: ${h}</span> ·
      progress: ${p} ·
      gap: ${gap ?? '—'}px
    `;
  }

  function maybeRecord(phase) {
    const now = Date.now();
    if (!recording && phase === 'manual') return;
    if (now - lastSampleT < SAMPLE_MS && phase !== 'auto') return;
    lastSampleT = now;
    samples.push(sampleFrame(phase));
    updateLive();
  }

  const onScroll = () => maybeRecord('manual');
  window.addEventListener('scroll', onScroll, { passive: true });

  closeBtn.onclick = () => {
    window.removeEventListener('scroll', onScroll);
    panel.remove();
    console.log(TAG, 'Panel closed.');
  };

  async function autoScrollCapture() {
    const contact = $('#contact');
    if (!contact) throw new Error('#contact not found');

    const st = getScrollTriggerForContact();
    const startY = Math.max(0, (st?.start ?? contact.offsetTop) - window.innerHeight * 0.15);
    const endY = (st?.end ?? contact.offsetTop + window.innerHeight) + window.innerHeight * 0.05;

    window.scrollTo({ top: startY, behavior: 'instant' in window ? 'instant' : 'auto' });
    await new Promise((r) => setTimeout(r, 400));

    const step = (endY - startY) / AUTO_SCROLL_STEPS;
    for (let i = 0; i <= AUTO_SCROLL_STEPS; i += 1) {
      window.scrollTo({ top: startY + step * i, behavior: 'auto' });
      await new Promise((r) => setTimeout(r, AUTO_SCROLL_PAUSE_MS));
      const phase = `auto-${i}/${AUTO_SCROLL_STEPS}`;
      samples.push(sampleFrame(phase));
      updateLive();
      log(`sample ${i}/${AUTO_SCROLL_STEPS} scrollY=${Math.round(window.scrollY)} h=${samples.at(-1).curve.computedHeight}`);
    }
  }

  async function takeScreenshots() {
    log('Loading html2canvas for section screenshots…');
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    } catch (e) {
      log('html2canvas failed to load — report will have metrics only.');
      return;
    }

    const html2canvas = window.html2canvas;
    const contact = $('#contact');
    const st = getScrollTriggerForContact();
    const points = [
      { label: 'before-pin', y: Math.max(0, (st?.start ?? contact.offsetTop) - window.innerHeight * 0.5) },
      { label: 'pin-start', y: st?.start ?? contact.offsetTop },
      { label: 'pin-mid', y: st ? st.start + (st.end - st.start) * 0.5 : contact.offsetTop + window.innerHeight * 0.5 },
      { label: 'pin-end', y: st?.end ?? contact.offsetTop + window.innerHeight },
    ];

    for (const pt of points) {
      window.scrollTo({ top: pt.y, behavior: 'auto' });
      await new Promise((r) => setTimeout(r, 350));
      samples.push(sampleFrame(`screenshot-${pt.label}`));
      const shot = await captureScreenshot(pt.label, html2canvas);
      if (shot) screenshots.push(shot);
      log(`screenshot: ${pt.label} @ scrollY=${Math.round(window.scrollY)}`);
    }
  }

  function buildDomReference() {
    const contact = $('#contact');
    if (!contact) return null;
    const clone = contact.cloneNode(true);
    clone.querySelectorAll('script, iframe').forEach((n) => n.remove());
    return {
      outerHTMLSnippet: clone.outerHTML.slice(0, 12000),
      childOrder: [...contact.children].map((c) => ({
        tag: c.tagName,
        className: c.className,
        childCount: c.children.length,
      })),
    };
  }

  runBtn.onclick = async () => {
    runBtn.disabled = true;
    recording = true;
    samples = [];
    screenshots = [];
    logEl.textContent = '';

    try {
      log('Waiting for site-ready…');
      await waitForSiteReady();
      log('site-ready ✓');

      log('Auto-scrolling through footer zone…');
      await autoScrollCapture();

      log('Taking #contact screenshots at key scroll positions…');
      await takeScreenshots();

      const issues = analyze(samples);
      const report = {
        meta: {
          url: location.href,
          userAgent: navigator.userAgent,
          viewport: { w: window.innerWidth, h: window.innerHeight },
          capturedAt: new Date().toISOString(),
          sampleCount: samples.length,
        },
        issues,
        domReference: buildDomReference(),
        samples,
        screenshots: screenshots.map((s) => ({
          label: s.label,
          scrollY: s.scrollY,
          width: s.width,
          height: s.height,
          dataUrl: s.dataUrl,
          error: s.error,
        })),
      };

      window.__meridianFooterDiagnoseReport = report;

      const critical = issues.filter((i) => i.severity === 'critical' || i.severity === 'high');
      if (critical.length) {
        statusEl.innerHTML = `<span class="bad">${critical.length} issue(s) found</span>`;
        critical.forEach((i) => log(`[${i.code}] ${i.message}`));
      } else {
        statusEl.innerHTML = '<span class="ok">No critical issues in capture</span>';
        log('No critical/high issues detected. Check screenshots for visual state.');
      }

      dlBtn.disabled = false;
      log('Done. Click "Download report" or run: copy(JSON.stringify(window.__meridianFooterDiagnoseReport))');
    } catch (err) {
      statusEl.innerHTML = `<span class="bad">Error</span>`;
      log(String(err));
      console.error(TAG, err);
    } finally {
      recording = false;
      runBtn.disabled = false;
    }
  };

  dlBtn.onclick = () => {
    const report = window.__meridianFooterDiagnoseReport;
    if (!report) return;
    const json = JSON.stringify(report, null, 2);
    downloadBlob(new Blob([json], { type: 'application/json' }), `meridian-footer-report-${Date.now()}.json`);

    report.screenshots?.forEach((shot, i) => {
      if (!shot.dataUrl) return;
      const bin = atob(shot.dataUrl.split(',')[1]);
      const arr = new Uint8Array(bin.length);
      for (let j = 0; j < bin.length; j += 1) arr[j] = bin.charCodeAt(j);
      downloadBlob(new Blob([arr], { type: 'image/png' }), `meridian-footer-${shot.label || i}-${Date.now()}.png`);
    });

    log('Report + PNGs downloaded.');
  };

  try {
    await waitForSiteReady();
    statusEl.innerHTML = '<span class="ok">Ready</span> — scroll manually or Run capture';
  } catch {
    statusEl.innerHTML = '<span class="warn">site-ready not set yet</span>';
  }

  updateLive();
  setInterval(updateLive, 500);

  console.log(TAG, 'Diagnostic panel mounted. Click "Run capture" on the top-right panel.');
  return 'Meridian footer diagnose ready. Use the panel top-right or window.__meridianFooterDiagnoseReport after capture.';
})();

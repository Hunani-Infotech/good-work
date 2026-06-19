/**
 * Mobile viewport animation verification (390×844 iPhone-like).
 * Output is written to scripts/mobile-test-output/ (gitignored).
 *
 * Run: node scripts/mobile-animation-test.mjs [baseUrl]
 * Requires: npm install (playwright is a devDependency)
 */
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = process.argv[2] || 'http://localhost:5176';
const OUT = join(process.cwd(), 'scripts', 'mobile-test-output');
mkdirSync(OUT, { recursive: true });

const ROUTES = [
  { path: '/', name: 'agency', sections: ['.agency-hero', '.agency-how', '.agency-templates', '.agency-features', '.agency-cta'] },
  { path: '/cv/sanjay', name: 'cv-home', sections: ['.wrapper-hero', '.click-scroll', '.narrative', '.video-cv', '.expertise', '.benefits'] },
  { path: '/work', name: 'work', sections: ['.section.work', '.project-card'] },
];

async function waitForReady(page, routeName) {
  if (routeName === 'agency') {
    await page.waitForFunction(() => document.documentElement.classList.contains('site-ready'), { timeout: 15000 }).catch(() => {});
  } else {
    await page.waitForFunction(
      () => document.documentElement.classList.contains('site-ready') || !document.querySelector('.site-loader'),
      { timeout: 20000 }
    ).catch(() => {});
    await page.waitForTimeout(2500);
  }
}

function gsapProbe() {
  const html = document.documentElement;
  const gsapEls = [];
  document.querySelectorAll('*').forEach((el) => {
    if (el._gsap || el.style.transform || el.style.opacity) {
      gsapEls.push(el);
    }
  });

  const pinSpacers = document.querySelectorAll('.pin-spacer').length;
  const hiddenSections = [];
  document.querySelectorAll('main section, main > div[class], .agency-hero, .agency-how, .agency-templates, .agency-features, .agency-cta, .wrapper-hero').forEach((el) => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const opacity = parseFloat(cs.opacity);
    const hidden = cs.visibility === 'hidden' || cs.display === 'none' || opacity < 0.05;
    const stuck = hidden && rect.height > 50;
    if (stuck) {
      hiddenSections.push({ sel: el.className?.slice?.(0, 60) || el.tagName, opacity, visibility: cs.visibility, display: cs.display });
    }
  });

  const gsapStyled = gsapEls.slice(0, 20).map((el) => ({
    tag: el.tagName,
    cls: (el.className?.toString?.() || '').slice(0, 50),
    hasGsapCache: !!el._gsap,
    transform: el.style.transform?.slice(0, 80) || '',
    opacity: el.style.opacity || '',
  }));

  const scrollSignature = gsapEls.slice(0, 30).map((el) => {
    const r = el.getBoundingClientRect();
    return `${el.className?.toString?.().slice(0, 20)}:${Math.round(r.top)}:${el.style.transform}:${el.style.opacity}`;
  }).join('|');

  return {
    viewport: { w: innerWidth, h: innerHeight },
    siteReady: html.classList.contains('site-ready'),
    lenisSmooth: html.classList.contains('lenis-smooth'),
    pointerCoarse: matchMedia('(pointer: coarse)').matches,
    maxWidth991: matchMedia('(max-width: 991px)').matches,
    gsapCacheCount: gsapEls.filter((e) => e._gsap).length,
    gsapInlineCount: gsapEls.filter((e) => e.style.transform || e.style.opacity).length,
    pinSpacerCount: pinSpacers,
    scrollY: scrollY,
    gsapInlineSample: gsapStyled.slice(0, 8),
    scrollSignature,
    hiddenStuckSections: hiddenSections,
    stMarkers: document.querySelectorAll('[class*="gsap-marker"]').length,
  };
}

async function collectState(page) {
  return page.evaluate(gsapProbe);
}

async function sampleElements(page, selectors) {
  return page.evaluate((sels) => {
    const out = {};
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (!el) { out[sel] = { found: false }; continue; }
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      out[sel] = {
        found: true,
        opacity: cs.opacity,
        transform: el.style.transform || cs.transform,
        visible: rect.height > 0 && parseFloat(cs.opacity) > 0.1,
        inViewport: rect.top < innerHeight && rect.bottom > 0,
        y: Math.round(rect.top),
      };
    }
    return out;
  }, selectors);
}

async function scrollAndDetectChanges(page, steps = 8) {
  const changes = [];
  let prev = await collectState(page);
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);

  for (let i = 1; i <= steps; i++) {
    const target = Math.round((maxScroll / steps) * i);
    await page.evaluate((y) => window.scrollTo(0, y), target);
    await page.waitForTimeout(400);
    const curr = await collectState(page);
    const sectionEls = await page.evaluate(() => {
      const animated = [];
      document.querySelectorAll('[style*="transform"], .ag-w, .template-card, .feature-card, .project-card, .click-scroll__item').forEach((el) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.top < innerHeight && rect.bottom > 0) {
          animated.push({
            cls: (el.className?.toString?.() || el.tagName).slice(0, 45),
            opacity: cs.opacity,
            transform: el.style.transform?.slice(0, 60) || '',
          });
        }
      });
      return animated.slice(0, 12);
    });
    changes.push({
      scrollY: curr.scrollY,
      signatureChanged: curr.scrollSignature !== prev.scrollSignature,
      gsapCacheCount: curr.gsapCacheCount,
      visibleAnimated: sectionEls,
    });
    prev = curr;
  }
  return changes;
}

async function testRoute(browser, route) {
  const context = await browser.newContext({
    ...devices['iPhone 13 Pro'],
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();

  // Expose GSAP globals (bundled modules may not attach to window)
  await page.addInitScript(() => {
    window.__animLog = [];
  });

  const url = BASE + route.path;
  console.log(`\n=== Testing ${route.name} (${url}) ===`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForReady(page, route.name);

  await page.screenshot({ path: join(OUT, `${route.name}-top.png`) });

  const initial = await collectState(page);
  const sections = await sampleElements(page, route.sections);
  const scrollChanges = await scrollAndDetectChanges(page, 10);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, `${route.name}-bottom.png`) });

  const final = await collectState(page);
  await context.close();

  const pass = {
    gsapEvidence: initial.gsapCacheCount > 0 || initial.gsapInlineCount > 0,
    siteReady: initial.siteReady,
    nativeScrollExpected: !initial.lenisSmooth && initial.maxWidth991,
    noStuckHidden: initial.hiddenStuckSections.length === 0 && final.hiddenStuckSections.length === 0,
    sectionsVisible: Object.values(sections).filter((s) => s.found).every((s) => s.visible || s.opacity === '0'),
    scrollAnimates: scrollChanges.some((c) => c.signatureChanged),
    gsapActive: initial.gsapCacheCount > 0 || initial.gsapInlineCount > 0,
  };

  const failReasons = [];
  if (!pass.gsapEvidence) failReasons.push('No GSAP _gsap cache or inline styles detected');
  if (!pass.siteReady) failReasons.push('site-ready class missing');
  if (!pass.nativeScrollExpected) failReasons.push(`Lenis unexpected: lenis-smooth=${initial.lenisSmooth}`);
  if (!pass.noStuckHidden) failReasons.push(`Stuck hidden sections: ${JSON.stringify(final.hiddenStuckSections)}`);
  if (!pass.sectionsVisible) failReasons.push('Some key sections not visible');
  if (!pass.scrollAnimates) failReasons.push('No GSAP transform/opacity changes on scroll');
  if (!pass.gsapActive) failReasons.push('No GSAP tweens/inline styles detected');

  return {
    route: route.name,
    url,
    verdict: failReasons.length === 0 ? 'PASS' : 'FAIL',
    failReasons,
    initial,
    final,
    sections,
    scrollChanges,
    screenshots: [`${route.name}-top.png`, `${route.name}-bottom.png`],
  };
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const route of ROUTES) {
  try {
    results.push(await testRoute(browser, route));
  } catch (err) {
    results.push({ route: route.name, verdict: 'FAIL', failReasons: [err.message], error: String(err) });
  }
}
await browser.close();

console.log('\n========== MOBILE ANIMATION REPORT ==========\n');
for (const r of results) {
  console.log(`## ${r.route} — ${r.verdict}`);
  if (r.failReasons?.length) console.log('  Failures:', r.failReasons.join('; '));
  if (r.initial) {
    console.log(`  GSAP cache: ${r.initial.gsapCacheCount}, inline: ${r.initial.gsapInlineCount}, pin-spacers: ${r.initial.pinSpacerCount}`);
    console.log(`  site-ready: ${r.initial.siteReady}, lenis-smooth: ${r.initial.lenisSmooth}`);
    console.log(`  Viewport: ${r.initial.viewport.w}x${r.initial.viewport.h}, nativeScroll: ${!r.initial.lenisSmooth}`);
  }
  if (r.sections) {
    console.log('  Sections:', JSON.stringify(r.sections, null, 0).slice(0, 500));
  }
  if (r.scrollChanges) {
    const animatedSteps = r.scrollChanges.filter((c) => c.signatureChanged);
    console.log(`  Scroll steps with GSAP changes: ${animatedSteps.length}/${r.scrollChanges.length}`);
  }
  console.log('');
}

import { writeFileSync } from 'fs';
writeFileSync(join(OUT, 'report.json'), JSON.stringify(results, null, 2));
console.log(`Full report: ${join(OUT, 'report.json')}`);
console.log(`Screenshots: ${OUT}`);

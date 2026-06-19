import gsap from 'gsap';

let loaderTimeline = null;

export function destroySiteLoader() {
  if (loaderTimeline) {
    loaderTimeline.kill();
    loaderTimeline = null;
  }
  var loader = document.querySelector('.container-loader');
  if (loader) {
    gsap.killTweensOf([
      loader,
      loader.querySelector('.orange-intro'),
      loader.querySelector('.grow-line'),
      loader.querySelector('.loader-intro'),
    ]);
  }
}

/**
 * Orange grow-line intro shown on every route.
 * @param {{ prefersReduced?: boolean, isStale?: () => boolean }} options
 */
export function initSiteLoader(options) {
  var prefersReduced = options && typeof options.prefersReduced === 'boolean'
    ? options.prefersReduced
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isStale = options && typeof options.isStale === 'function' ? options.isStale : function () { return false; };

  document.documentElement.classList.remove('site-ready');

  var loader = document.querySelector('.container-loader');
  if (!loader || prefersReduced) {
    if (loader) loader.style.display = 'none';
    document.documentElement.classList.add('site-ready');
    return Promise.resolve();
  }

  var overlay = loader.querySelector('.orange-intro');
  var line = loader.querySelector('.grow-line');
  var intro = loader.querySelector('.loader-intro');

  if (loaderTimeline) {
    loaderTimeline.kill();
    loaderTimeline = null;
  }

  gsap.killTweensOf([loader, overlay, line, intro]);
  gsap.set(loader, { display: 'flex', opacity: 1 });
  if (intro) gsap.set(intro, { opacity: 1, y: 0 });
  if (overlay) gsap.set(overlay, { opacity: 1 });
  if (!line) {
    document.documentElement.classList.add('site-ready');
    return Promise.resolve();
  }
  gsap.set(line, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    xPercent: -50,
    yPercent: -50,
    width: '2%',
    height: '1%',
    transformOrigin: '50% 50%',
  });

  return new Promise(function (resolve) {
    loaderTimeline = gsap.timeline({
      defaults: { ease: 'osmo' },
      onComplete: function () {
        if (isStale()) {
          resolve();
          return;
        }
        loaderTimeline = null;
        gsap.set(loader, { display: 'none' });
        document.documentElement.classList.add('site-ready');
        resolve();
      },
    });

    loaderTimeline
      .to({}, { duration: 0.4 })
      .to(line, { width: '220vmax', height: '220vmax', duration: 1.1, ease: 'power3.inOut' }, 0.2)
      .to(intro, { opacity: 0, y: -12, duration: 0.35 }, 0.55)
      .to(overlay, { opacity: 0, duration: 0.45 }, 0.95)
      .to(loader, { opacity: 0, duration: 0.3 }, 1.15);
  });
}

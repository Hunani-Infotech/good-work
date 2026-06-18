/* Main bootstrap — wires all RN modules */
(function () {
    var hasST = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    function boot() {
        if (typeof RNTheme !== 'undefined') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function () { RNTheme.init(); });
            } else {
                RNTheme.init();
            }
        }
        RNBrand.apply();
        RNScrollSections.build();
        RNData.buildMarquee();
        RNData.buildWorkGrid();
        RNData.splitHeadings();

        RNScroll.initLenis();
        RNScroll.initMotion();

        RNEffects.initPremiumCursor();
        RNEffects.initCardHover(document.getElementById('rn-scroll'));
        RNEffects.initParticles(RNScroll.getScrollTop);
        RNEffects.startRenderLoop(RNScroll.tick);

        RNScroll.runEntrance();

        if (hasST) {
            setTimeout(function () { ScrollTrigger.refresh(); }, 1500);
            window.addEventListener('resize', function () {
                clearTimeout(window._rnRefreshT);
                window._rnRefreshT = setTimeout(function () { ScrollTrigger.refresh(); }, 200);
            });
        }
        setTimeout(RNScroll.forceShowAll, 4500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

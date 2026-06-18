/* Scroll-scrubbed cinematic narrative */
window.RNCinematic = (function () {
    var hasGsap = typeof gsap !== 'undefined';
    var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
    var motion = null;
    var root = null;

    var INTRO_BLOCK_SEL = '#rn-principles, #rn-domains, #rn-now, #rn-philosophy, #rn-showcase';

    function scrubST(trigger, start, end, scrub) {
        return {
            trigger: trigger,
            start: start || 'top bottom',
            end: end || 'top 72%',
            scrub: scrub != null ? scrub : motion.scrubAmount(1),
            invalidateOnRefresh: true
        };
    }

    function insidePinnedScene(el) {
        return !!(el && el.closest && el.closest('[data-rn-scene]'));
    }

    function insideIntroBlock(el) {
        return !!(el && el.closest && el.closest(INTRO_BLOCK_SEL));
    }

    function initMasterProgress() {
        if (!hasST) return;
        ScrollTrigger.create({
            trigger: '#rn-scroll',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            onUpdate: function (self) {
                var bar = document.getElementById('rn-scroll-progress-bar');
                if (bar) bar.style.width = (self.progress * 100) + '%';
            }
        });
    }

    function initIntroScenes() {
        var pairs = [
            { el: '#rn-philosophy', x: -32, clip: 'inset(0 0 100% 0)' },
            { el: '#rn-principles', x: 0, clip: 'inset(0 0 100% 0)' },
            { el: '#rn-showcase', x: 0, clip: 'inset(0 0 100% 0)' },
            { el: '#rn-domains', x: 28, clip: 'inset(0 0 100% 0)' },
            { el: '#rn-now', x: -24, clip: 'inset(0 0 100% 0)' }
        ];

        pairs.forEach(function (cfg) {
            var block = root.querySelector(cfg.el);
            if (!block) return;
            var inner = block.querySelector('.rn-animate-inner');
            if (!inner) return;
            inner.setAttribute('data-rn-scrub', '1');

            gsap.fromTo(inner,
                { opacity: 0, y: 48, x: cfg.x, clipPath: cfg.clip, scale: 0.99, force3D: true },
                {
                    opacity: 1, y: 0, x: 0, clipPath: 'inset(0 0 0 0)', scale: 1, ease: 'none',
                    scrollTrigger: scrubST(block, 'top bottom', 'top 75%', motion.scrubAmount(1))
                }
            );

            if (cfg.el === '#rn-showcase' || cfg.el === '#rn-philosophy') {
                gsap.fromTo(block,
                    { opacity: 1 },
                    {
                        opacity: 0.75, y: -24, ease: 'none',
                        scrollTrigger: scrubST(block, 'bottom 60%', 'bottom 15%', motion.scrubAmount())
                    }
                );
            }
        });

        if (window.innerWidth < 901) {
            var showcaseToWork = root.querySelector('#rn-showcase');
            var workInner = root.querySelector('#rn-work .rn-animate-inner');
            if (showcaseToWork && workInner) {
                gsap.timeline({
                    scrollTrigger: scrubST(showcaseToWork, 'bottom 95%', 'bottom 65%', motion.scrubAmount(1))
                })
                .fromTo(workInner,
                    { opacity: 0, y: 48, clipPath: 'inset(0 0 100% 0)' },
                    { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', ease: 'none', duration: 1 },
                    0
                );
            }
        }
    }

    function initPinnedScenes() {
        if (!hasST || window.innerWidth < 901) return;

        root.querySelectorAll('[data-rn-scene]').forEach(function (section) {
            var inner = section.querySelector('.rn-scene-panel') || section.querySelector('.rn-animate-inner');
            if (!inner) return;
            inner.setAttribute('data-rn-scrub', '1');

            var tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=80%',
                    pin: true,
                    pinSpacing: true,
                    scrub: motion.scrubAmount(1),
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            tl.fromTo(inner,
                { opacity: 0.2, y: 40, scale: 0.98, clipPath: 'inset(0 0 8% 0)' },
                { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0 0)', ease: 'none', duration: 0.2 },
                0
            );
            tl.to(inner,
                { opacity: 0, y: -40, scale: 0.99, ease: 'none', duration: 0.16 },
                0.78
            );
            var bg = section.querySelector('.rn-scene-bg');
            if (bg) {
                tl.to(bg, { opacity: 0.35, scale: 1.04, ease: 'none', duration: 0.16 }, 0.78);
            }
        });
    }

    function initMobileScenes() {
        if (window.innerWidth >= 901) return;
        root.querySelectorAll('[data-rn-scene]').forEach(function (section) {
            var inner = section.querySelector('.rn-scene-panel') || section.querySelector('.rn-animate-inner');
            if (!inner) return;
            inner.setAttribute('data-rn-scrub', '1');
            gsap.fromTo(inner,
                { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
                {
                    opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', ease: 'none',
                    scrollTrigger: scrubST(section, 'top bottom', 'top 75%', motion.scrubAmount(1))
                }
            );
        });
    }

    function initTypographyScrub() {
        root.querySelectorAll('[data-rn-split]').forEach(function (heading) {
            if (insidePinnedScene(heading) || insideIntroBlock(heading)) return;

            var words = heading.querySelectorAll('.rn-split-word');
            if (!words.length) return;
            words.forEach(function (w) { w.setAttribute('data-rn-scrub', '1'); });

            gsap.set(words, { y: '80%', opacity: 0, rotateZ: 1, force3D: true });
            gsap.to(words, {
                y: '0%',
                opacity: 1,
                rotateZ: 0,
                stagger: { each: 0.035, from: 'start' },
                ease: 'none',
                scrollTrigger: scrubST(heading, 'top 98%', 'top 72%', motion.scrubAmount(1))
            });
        });
    }

    function initScrubReveals() {
        root.querySelectorAll('[data-rn-reveal]').forEach(function (el) {
            if (insidePinnedScene(el) || insideIntroBlock(el)) return;

            el.setAttribute('data-rn-scrub', '1');
            var type = el.getAttribute('data-rn-reveal') || 'up';
            var from = { opacity: 0, ease: 'none', force3D: true };
            if (type === 'up') from.y = 28;
            else if (type === 'left') from.x = -28;
            else if (type === 'right') from.x = 28;
            else if (type === 'scale') from.scale = 0.96;
            else from.y = 28;

            gsap.fromTo(el, from,
                {
                    opacity: 1, y: 0, x: 0, scale: 1, ease: 'none',
                    scrollTrigger: scrubST(el, 'top bottom', 'top 74%', motion.scrubAmount(1))
                }
            );
        });
    }

    function initScrubStagger() {
        root.querySelectorAll('[data-rn-stagger]').forEach(function (parent) {
            if (insidePinnedScene(parent) || insideIntroBlock(parent)) return;

            var kids = parent.children;
            if (!kids.length) return;
            gsap.fromTo(kids,
                { opacity: 0, y: 24, force3D: true },
                {
                    opacity: 1, y: 0, stagger: 0.06, ease: 'none',
                    scrollTrigger: scrubST(parent, 'top 98%', 'top 70%', motion.scrubAmount(1))
                }
            );
            Array.prototype.forEach.call(kids, function (k) { k.setAttribute('data-rn-scrub', '1'); });
        });
    }

    function initImageReveals() {
        root.querySelectorAll('.rn-media-reveal').forEach(function (shell, i) {
            if (insidePinnedScene(shell)) return;

            var clip = shell.querySelector('.rn-media-reveal__clip');
            var img = shell.querySelector('.rn-media-reveal__img, .rn-work-card-img');
            if (!clip || !img) return;

            var dir = shell.getAttribute('data-rn-clip') || 'left';
            var clipFrom = 'inset(0 100% 0 0)';
            if (dir === 'up') clipFrom = 'inset(0 0 100% 0)';
            if (dir === 'right') clipFrom = 'inset(0 0 0 100%)';

            gsap.set(clip, { clipPath: clipFrom, force3D: true });
            gsap.set(img, { scale: 1.06, x: dir === 'left' ? -10 : 0, force3D: true });

            var tl = gsap.timeline({
                scrollTrigger: scrubST(shell, 'top bottom', 'top 72%', motion.scrubAmount(1))
            });
            tl.to(clip, { clipPath: 'inset(0 0 0 0)', ease: 'none', duration: 0.55 }, 0);
            tl.to(img, { scale: 1, x: 0, ease: 'none', duration: 0.55 }, 0);
            if (i % 3 === 1) tl.progress(0.04);
            if (i % 3 === 2) tl.progress(0.08);
        });
    }

    function initParallax() {
        if (!hasST) return;
        var map = motion.PARALLAX_MAP;

        root.querySelectorAll('[data-rn-layer]').forEach(function (el) {
            var layer = el.getAttribute('data-rn-layer');
            var speed = map[layer] || 1;
            var travel = layer === 'bg' ? 80 : layer === 'fg' ? 40 : 24;
            gsap.to(el, {
                y: -travel * speed,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: el.closest('[data-rn-scene], .rn-animate-block') || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: motion.scrubAmount()
                }
            });
        });

        root.querySelectorAll('.rn-work-card').forEach(function (card, i) {
            gsap.to(card, {
                y: -20 * map.fg * (1 + (i % 3) * 0.12),
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.8
                }
            });
        });
    }

    function initCounters() {
        root.querySelectorAll('[data-rn-count]').forEach(function (counter) {
            if (insidePinnedScene(counter)) return;

            var target = parseInt(counter.getAttribute('data-rn-count'), 10);
            var obj = { val: 0 };
            counter.setAttribute('data-rn-scrub', '1');
            gsap.fromTo(obj, { val: 0 }, {
                val: target,
                ease: 'none',
                scrollTrigger: scrubST(counter.closest('.rn-stats-row') || counter, 'top 95%', 'top 70%', motion.scrubAmount(1)),
                onUpdate: function () { counter.textContent = Math.round(obj.val); }
            });
        });
    }

    function initFooter() {
        var footer = root.querySelector('#rn-footer .rn-animate-inner');
        if (!footer) return;
        footer.setAttribute('data-rn-scrub', '1');
        gsap.fromTo(footer,
            { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
            {
                opacity: 1, y: 0, clipPath: 'inset(0 0 0 0)', ease: 'none',
                scrollTrigger: scrubST(root.querySelector('#rn-footer'), 'top bottom', 'top 78%', motion.scrubAmount(1))
            }
        );
    }

    function init(scrollRoot, motionApi) {
        if (!hasGsap || !hasST || motionApi.reduced) return;
        motion = motionApi;
        root = scrollRoot;
        if (!root) return;

        document.body.classList.add('rn-cinematic-active');
        initMasterProgress();
        initIntroScenes();
        initPinnedScenes();
        initMobileScenes();
        initTypographyScrub();
        initScrubReveals();
        initScrubStagger();
        initImageReveals();
        initParallax();
        initCounters();
        initFooter();
        ScrollTrigger.refresh();
    }

    return { init: init };
})();

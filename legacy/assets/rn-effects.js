/* Custom cursor + particle canvas */
window.RNEffects = (function () {
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof gsap !== 'undefined';
    var cursorApi = null;

    function initPremiumCursor() {
        var root = document.getElementById('rn-cursor');
        if (!root || reducedMotion || !hasGsap) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        var ambient = document.getElementById('rn-cursor-ambient');
        var dot = root.querySelector('.rn-cursor__dot');
        var ring = root.querySelector('.rn-cursor__ring');
        var label = root.querySelector('.rn-cursor__label');
        var labelText = root.querySelector('.rn-cursor__label-text');
        var trails = root.querySelectorAll('.rn-cursor__trail-dot');
        var mouse = { x: innerWidth / 2, y: innerHeight / 2 };
        var magnetic = { x: 0, y: 0, target: null };

        var dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
        var dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
        var ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
        var ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
        var ambX = gsap.quickTo(ambient, 'x', { duration: 0.7, ease: 'power3.out' });
        var ambY = gsap.quickTo(ambient, 'y', { duration: 0.7, ease: 'power3.out' });
        var lblX = gsap.quickTo(label, 'x', { duration: 0.25, ease: 'power3.out' });
        var lblY = gsap.quickTo(label, 'y', { duration: 0.25, ease: 'power3.out' });
        var trailQuick = [];
        trails.forEach(function (t, i) {
            trailQuick.push({
                x: gsap.quickTo(t, 'x', { duration: 0.2 + i * 0.06, ease: 'power3.out' }),
                y: gsap.quickTo(t, 'y', { duration: 0.2 + i * 0.06, ease: 'power3.out' })
            });
        });

        gsap.set([dot, ring, ambient, label].concat(Array.from(trails)), { x: mouse.x, y: mouse.y });

        function resolveState(el) {
            if (!el || el === document.body) return { state: '', label: '' };
            var pill = el.closest('.rn-project-pill');
            if (pill) return { state: 'pill', label: pill.getAttribute('data-cursor-label') || pill.textContent.trim() };
            var card = el.closest('.rn-work-card');
            if (card) {
                var title = card.querySelector('.rn-work-card-title');
                return { state: 'card', label: card.getAttribute('data-cursor-label') || (title ? title.textContent.trim() : 'View') };
            }
            var link = el.closest('a[href]');
            if (link) return { state: 'link', label: link.getAttribute('data-cursor-label') || 'View' };
            var btn = el.closest('button');
            if (btn) return { state: 'button', label: btn.getAttribute('data-cursor-label') || '' };
            return { state: '', label: '' };
        }

        function onPointerMove(e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            if (document.body.classList.contains('rn-ready')) {
                document.body.classList.add('rn-cursor-active');
            }
            var hit = document.elementFromPoint(e.clientX, e.clientY);
            var info = resolveState(hit);
            root.setAttribute('data-cursor-state', info.state);
            labelText.textContent = info.label;

            var pill = info.state === 'pill' ? hit && hit.closest('.rn-project-pill') : null;
            if (pill !== magnetic.target) {
                if (magnetic.target) gsap.to(magnetic.target, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
                magnetic.target = pill;
            }
            if (pill) {
                var rect = pill.getBoundingClientRect();
                var dx = e.clientX - (rect.left + rect.width / 2);
                var dy = e.clientY - (rect.top + rect.height / 2);
                magnetic.x = dx * 0.15;
                magnetic.y = dy * 0.15;
                gsap.to(pill, { x: dx * 0.28, y: dy * 0.28, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
            } else {
                magnetic.x = 0;
                magnetic.y = 0;
            }
        }

        document.addEventListener('mousemove', onPointerMove, { passive: true });
        document.addEventListener('mouseleave', function () {
            root.removeAttribute('data-cursor-state');
            labelText.textContent = '';
            magnetic.target = null;
            document.querySelectorAll('.rn-project-pill').forEach(function (p) {
                gsap.to(p, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
            });
        });
        document.addEventListener('mousedown', function () { root.classList.add('is-pressed'); });
        document.addEventListener('mouseup', function () { root.classList.remove('is-pressed'); });

        cursorApi = {
            tick: function () {
                var x = mouse.x + magnetic.x;
                var y = mouse.y + magnetic.y;
                var labelY = y + (root.getAttribute('data-cursor-state') === 'card' ? 32 : 24);
                dotX(x); dotY(y);
                ringX(x); ringY(y);
                ambX(mouse.x); ambY(mouse.y);
                lblX(x); lblY(labelY);
                trails.forEach(function (_, i) {
                    var lag = (i + 1) * 0.04;
                    trailQuick[i].x(mouse.x - (mouse.x - x) * lag);
                    trailQuick[i].y(mouse.y - (mouse.y - y) * lag);
                });
            },
            mouse: mouse
        };
    }

    function getAccentRgb() {
        var rgb = getComputedStyle(document.documentElement).getPropertyValue('--rn-accent-rgb').trim();
        return rgb || '184, 115, 51';
    }

    function initParticles(getScrollTop) {
        var canvas = document.getElementById('rn-particles');
        if (!canvas || reducedMotion) return;
        var ctx = canvas.getContext('2d');
        var particles = [];
        var mouse = { x: -999, y: -999 };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function spawn() {
            particles = [];
            var count = Math.min(60, Math.floor(window.innerWidth / 25));
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    a: Math.random() * 0.35 + 0.1
                });
            }
        }

        var accentRgb = getAccentRgb();

        document.addEventListener('rn-theme-change', function () {
            accentRgb = getAccentRgb();
        });

        function draw() {
            if (cursorApi) {
                mouse.x = cursorApi.mouse.x;
                mouse.y = cursorApi.mouse.y;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var scrollOffset = getScrollTop() * 0.02;
            particles.forEach(function (p, i) {
                p.x += p.vx;
                p.y += p.vy + scrollOffset * 0.001;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                var dx = mouse.x - p.x;
                var dy = mouse.y - p.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    p.x -= dx * 0.012;
                    p.y -= dy * 0.012;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + accentRgb + ', ' + p.a + ')';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var ddx = p.x - q.x;
                    var ddy = p.y - q.y;
                    var d = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (d < 90) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(' + accentRgb + ', ' + (0.08 * (1 - d / 90)) + ')';
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(draw);
        }

        resize();
        spawn();
        draw();
        window.addEventListener('resize', function () { resize(); spawn(); });
    }

    function initCardHover(root) {
        if (!root || reducedMotion || !hasGsap) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

        root.querySelectorAll('.rn-work-card').forEach(function (card) {
            card.style.transformStyle = 'preserve-3d';
            var img = card.querySelector('.rn-media-reveal__img, .rn-work-card-img');
            var rotX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
            var rotY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
            var liftY = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3.out' });
            var imgScale = img ? gsap.quickTo(img, 'scale', { duration: 0.55, ease: 'power3.out' }) : null;

            card.addEventListener('mouseenter', function () { card.classList.add('rn-card-hover'); });
            card.addEventListener('mouseleave', function () {
                card.classList.remove('rn-card-hover');
                rotX(0); rotY(0); liftY(0);
                if (imgScale) imgScale(1);
            });
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                rotY(px * 7);
                rotX(-py * 5);
                liftY(-6);
                if (imgScale) imgScale(1.05);
            });
        });
    }

    function startRenderLoop(scrollTick) {
        if (hasGsap) {
            var lenisOnTicker = typeof RNLenis !== 'undefined' && RNLenis.tickerBound;
            gsap.ticker.add(function (time) {
                if (!lenisOnTicker && scrollTick) scrollTick(time);
                if (cursorApi) cursorApi.tick();
            });
            if (!lenisOnTicker) gsap.ticker.lagSmoothing(0);
        } else {
            function raf(time) {
                scrollTick(time / 1000);
                if (cursorApi) cursorApi.tick();
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    return {
        initPremiumCursor: initPremiumCursor,
        initCardHover: initCardHover,
        initParticles: initParticles,
        startRenderLoop: startRenderLoop
    };
})();

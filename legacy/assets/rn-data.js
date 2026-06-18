/* Project data + DOM builders */
window.RNData = (function () {
    function themeAccent() {
        return (typeof RNTheme !== 'undefined' && RNTheme.getAccent) ? RNTheme.getAccent() : '#B87333';
    }

    function themeBg() {
        return (typeof RNTheme !== 'undefined' && RNTheme.getBg) ? RNTheme.getBg() : '#08090C';
    }

    function getProjects() {
        try {
            var data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
            return (data.props && data.props.cases || []).map(function (c) {
                var d = c.data || {};
                var title = d.title && d.title[0] && d.title[0].text;
                var desc = d.description && d.description[0] && d.description[0].text;
                var thumb = d.thumb && d.thumb.url;
                var color = d.primary_color || themeAccent();
                return { title: title, uid: c.uid, description: desc, thumb: thumb, color: color };
            }).filter(function (p) { return p.title && p.uid; });
        } catch (e) {
            return [
                { title: 'Fun', uid: 'fun', description: 'Video-first dating — trust signals in every swipe.', color: '#B87333' },
                { title: 'Esperanto', uid: 'esperanto', description: 'Language learning with adaptive lesson pacing.', color: '#3D7A7A' },
                { title: 'Blurr', uid: 'blurr', description: 'Social photo sharing with real-time presence.', color: '#D4924A' },
                { title: 'Ueno', uid: 'ueno', description: 'Digital banking rebuilt for mobile-first users.', color: '#B87333' },
                { title: 'Airbnb', uid: 'airbnb', description: 'Booking flows optimized for cross-border payments.', color: '#5A9E9E' },
                { title: 'Google', uid: 'google', description: 'Express checkout and delivery interface systems.', color: '#3D7A7A' }
            ];
        }
    }

    function buildMarquee() {
        var track = document.getElementById('rn-marquee-track');
        if (!track) return;
        var projects = getProjects();
        var html = '';
        for (var pass = 0; pass < 2; pass++) {
            projects.forEach(function (p) {
                html += '<button type="button" class="rn-project-pill" data-cursor="pill" data-cursor-label="' + p.title + '" data-uid="' + p.uid + '"><span>' + p.title + '</span></button>';
            });
        }
        track.innerHTML = html;
        track.querySelectorAll('.rn-project-pill').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (typeof gsap !== 'undefined') {
                    gsap.to(btn, { scale: 0.92, duration: 0.12, yoyo: true, repeat: 1 });
                }
            });
        });
    }

    function buildWorkGrid() {
        var grid = document.getElementById('rn-work-grid');
        if (!grid) return;
        var projects = getProjects();
        grid.innerHTML = projects.map(function (p, i) {
            var clipDir = i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right';
            var mediaInner = p.thumb
                ? '<img class="rn-work-card-img rn-media-reveal__img" src="' + p.thumb + '" alt="' + p.title + '" loading="lazy" />'
                : '<div class="rn-work-card-img rn-media-reveal__img" style="background:linear-gradient(135deg,' + p.color + ',' + themeBg() + ')"></div>';
            var media = '<div class="rn-media-reveal" data-rn-clip="' + clipDir + '"><div class="rn-media-reveal__clip">' + mediaInner + '</div></div>';
            return '<article class="rn-work-card" data-cursor="card" data-cursor-label="View ' + p.title + '" style="--accent:' + p.color + '">' +
                '<div class="rn-work-card-accent"></div>' + media +
                '<div class="rn-work-card-body"><div class="rn-work-card-title">' + p.title + '</div>' +
                '<p class="rn-work-card-desc">' + (p.description || '') + '</p></div></article>';
        }).join('');
    }

    function splitHeadings() {
        document.querySelectorAll('[data-rn-split]').forEach(function (el) {
            var html = el.innerHTML;
            var parts = html.split(/(<em>.*?<\/em>|\s+)/);
            el.innerHTML = '';
            var delay = 0;
            parts.forEach(function (part) {
                if (!part || part === ' ') {
                    el.appendChild(document.createTextNode(' '));
                    return;
                }
                var span = document.createElement('span');
                span.className = 'rn-split-word';
                span.style.transitionDelay = delay + 'ms';
                span.innerHTML = part;
                el.appendChild(span);
                delay += 45;
            });
        });
    }

    return { getProjects: getProjects, buildMarquee: buildMarquee, buildWorkGrid: buildWorkGrid, splitHeadings: splitHeadings };
})();

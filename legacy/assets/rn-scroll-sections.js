/* Injects scroll-layer HTML into #rn-scroll-content */
window.RNScrollSections = (function () {
    function sceneWrap(id, sceneId, label, ariaLabel, innerHtml) {
        return '<section class="rn-scroll-section rn-animate-block rn-cinematic-scene" id="' + id + '" data-rn-scene="' + sceneId + '" aria-label="' + ariaLabel + '">' +
            '<div class="rn-scene-bg" data-rn-layer="bg" aria-hidden="true"></div>' +
            '<div class="rn-scene-panel" data-rn-layer="content">' + innerHtml + '</div>' +
            '</section>';
    }

    function lightBlock(id, ariaLabel, innerHtml) {
        return '<section id="' + id + '" class="rn-animate-block rn-light-block" aria-label="' + ariaLabel + '">' +
            '<div class="rn-animate-inner" data-rn-layer="content">' + innerHtml + '</div>' +
        '</section>';
    }

    function build() {
        var root = document.getElementById('rn-scroll-content');
        if (!root || root.dataset.rnBuilt === '1') return;

        root.innerHTML =
            '<div class="rn-scroll-spacer" aria-hidden="true"></div>' +
            '<div id="rn-scroll-progress" aria-hidden="true"><div id="rn-scroll-progress-bar"></div></div>' +
            '<div class="rn-scroll-hint" aria-hidden="true"><span>Scroll to explore</span><div class="rn-scroll-hint-line"></div></div>' +
            '<div class="rn-cinematic-flow" id="rn-cinematic-flow">' +

            '<aside id="rn-philosophy" class="rn-animate-block" aria-label="Design philosophy">' +
                '<div class="rn-animate-inner" data-rn-layer="content"><p><span class="rn-dot" aria-hidden="true"></span>Money moves at the speed of trust. I design the moments — a payment clearing, a route recalculating — where that trust is won or lost.</p></div>' +
            '</aside>' +

            lightBlock('rn-principles', 'Design principles',
                '<div class="rn-section-label" data-rn-reveal="up">Principles</div>' +
                '<div class="rn-principle-lines" data-rn-stagger>' +
                    '<p class="rn-line">Clarity before cleverness — especially when money is moving.</p>' +
                    '<p class="rn-line">States before screens — decline, offline, surge.</p>' +
                    '<p class="rn-line">Ship the edge cases, not just the demo path.</p>' +
                '</div>'
            ) +

            '<div class="rn-scroll-breath" aria-hidden="true"></div>' +

            '<section id="rn-showcase" class="rn-animate-block" aria-label="Selected work">' +
                '<div class="rn-animate-inner" data-rn-layer="content">' +
                    '<div class="rn-showcase-inner" data-rn-stagger>' +
                        '<div class="rn-showcase-label">Selected work</div>' +
                        '<h2 class="rn-showcase-headline">Products that move <em>money</em> — and people.</h2>' +
                        '<p class="rn-showcase-sub">Payment flows, transit apps, and mobility platforms for teams shipping what comes after the wallet and the wheel.</p>' +
                        '<div class="rn-marquee-wrap" data-rn-layer="fg"><div class="rn-marquee-track" id="rn-marquee-track"></div></div>' +
                    '</div>' +
                '</div>' +
            '</section>' +

            sceneWrap('rn-lens', 'lens', 'Design lens', 'Design lens',
                '<div class="rn-animate-inner">' +
                    '<div class="rn-section-label" data-rn-reveal="up">The lens</div>' +
                    '<h2 class="rn-section-title" data-rn-split>Every tap is a <em>promise.</em></h2>' +
                    '<p class="rn-showcase-sub" data-rn-reveal="up">I design the milliseconds where users decide to trust — or leave.</p>' +
                '</div>'
            ) +

            sceneWrap('rn-work', 'work', 'Case studies', 'Project gallery',
                '<div class="rn-animate-inner">' +
                    '<div class="rn-section-label" data-rn-reveal="up">Case studies</div>' +
                    '<h2 class="rn-section-title" data-rn-split id="rn-work-title">Work at the <em>intersection</em></h2>' +
                    '<div id="rn-work-grid" data-rn-reveal="up" data-rn-delay="120"></div>' +
                '</div>'
            ) +

            lightBlock('rn-domains', 'Focus areas',
                '<div class="rn-section-label" data-rn-reveal="up">Where I work</div>' +
                '<div class="rn-domain-pills" data-rn-stagger>' +
                    '<span class="rn-domain-pill" data-rn-reveal="scale">Payments</span>' +
                    '<span class="rn-domain-pill" data-rn-reveal="scale" data-rn-delay="60">Transit</span>' +
                    '<span class="rn-domain-pill" data-rn-reveal="scale" data-rn-delay="120">Wallets</span>' +
                    '<span class="rn-domain-pill" data-rn-reveal="scale" data-rn-delay="180">Mobility</span>' +
                '</div>'
            ) +

            sceneWrap('rn-signal', 'signal', 'Signal', 'Design signal',
                '<div class="rn-animate-inner">' +
                    '<h2 class="rn-section-title" data-rn-split>Design for the <em>anxious</em> second.</h2>' +
                    '<p class="rn-showcase-sub" data-rn-reveal="up">When the card declines or the train leaves — that\'s the product.</p>' +
                '</div>'
            ) +

            sceneWrap('rn-process', 'process', 'Process', 'Design process',
                '<div class="rn-animate-inner">' +
                    '<div class="rn-section-label" data-rn-reveal="up">Process</div>' +
                    '<h2 class="rn-section-title" data-rn-split>How flows become <em>products</em></h2>' +
                    '<div class="rn-process-steps" data-rn-stagger>' +
                        '<div class="rn-process-step"><div class="rn-process-num">01</div><h3>Map</h3><p>Journey audits, regulatory constraints, and checkout friction.</p></div>' +
                        '<div class="rn-process-step"><div class="rn-process-num">02</div><h3>Model</h3><p>Prototypes for decline states, offline mode, and rush-hour load.</p></div>' +
                        '<div class="rn-process-step"><div class="rn-process-num">03</div><h3>Ship</h3><p>Tokens, motion specs, and pairing until staging matches production.</p></div>' +
                    '</div>' +
                '</div>'
            ) +

            sceneWrap('rn-collab', 'collab', 'Collaboration', 'How we work together',
                '<div class="rn-animate-inner">' +
                    '<div class="rn-section-label" data-rn-reveal="up">Together</div>' +
                    '<h2 class="rn-section-title" data-rn-split>Built with teams who <em>ship.</em></h2>' +
                    '<p class="rn-showcase-sub" data-rn-reveal="up">Embedded with PM and engineering from discovery through launch.</p>' +
                '</div>'
            ) +

            sceneWrap('rn-stats', 'stats', 'Highlights', 'Highlights',
                '<div class="rn-animate-inner">' +
                    '<div class="rn-stats-row" data-rn-stagger>' +
                        '<div data-rn-reveal="up"><div class="rn-stat-value" data-rn-count="27">0</div><div class="rn-stat-label">Products shipped</div></div>' +
                        '<div data-rn-reveal="up" data-rn-delay="100"><div class="rn-stat-value" data-rn-count="9">0</div><div class="rn-stat-label">Years in product design</div></div>' +
                        '<div data-rn-reveal="up" data-rn-delay="200"><div class="rn-stat-value" data-rn-count="14">0</div><div class="rn-stat-label">Markets launched</div></div>' +
                    '</div>' +
                '</div>'
            ) +

            lightBlock('rn-now', 'Current focus',
                '<p class="rn-line rn-line--accent" data-rn-reveal="up"><span class="rn-dot" aria-hidden="true"></span>Currently shaping payment UX for a Series B fintech · Open to mobility work.</p>'
            ) +

            '<div class="rn-scroll-breath" aria-hidden="true"></div>' +

            '<footer id="rn-footer" class="rn-animate-block">' +
                '<div class="rn-animate-inner" data-rn-layer="content">Nova Chen — product design for fintech and mobility · San Francisco · Open to new ventures.</div>' +
            '</footer>' +
            '</div>';

        root.dataset.rnBuilt = '1';
    }

    return { build: build };
})();

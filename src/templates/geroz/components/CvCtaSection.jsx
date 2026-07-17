import { useCvCtaContent } from '../../../hooks/useCvCtaContent.js';
import { GEROZ_DECOR_SHAPES } from '../../../data/geroz/constants.js';
import LuxuryBackdrop from './LuxuryBackdrop.jsx';
import ThemeButton from './ThemeButton.jsx';

function CtaConnectAccent() {
  return (
    <div className="gz-cta__accent" aria-hidden="true">
      <span className="gz-cta__accent-line" />
      <span className="gz-cta__accent-dot" />
      <span className="gz-cta__accent-line" />
    </div>
  );
}

export default function CvCtaSection() {
  const cta = useCvCtaContent();
  const headingLines = cta.headingLines.length ? cta.headingLines : [cta.heading];

  return (
    <section id="cta" className="gz-cta relative isolate overflow-hidden">
      <LuxuryBackdrop
        variant="cream"
        washClass="gz-cta__wash"
        noiseClass="gz-cta__noise"
      />

      <div className="gz-cta__orbs pointer-events-none" aria-hidden="true">
        <span className="gz-cta__orb gz-cta__orb--a" />
        <span className="gz-cta__orb gz-cta__orb--b" />
      </div>

      <div className="gz-cta__decor pointer-events-none" aria-hidden="true">
        <img
          className="gz-cta__decor-shape gz-cta__decor-shape--sun motion-safe:animate-geroz-decor-fade motion-reduce:animate-none"
          src={GEROZ_DECOR_SHAPES.starLarge}
          alt=""
          width="79"
          height="76"
        />
        <img
          className="gz-cta__decor-shape gz-cta__decor-shape--burst motion-safe:animate-cir36 motion-reduce:animate-none"
          src={GEROZ_DECOR_SHAPES.sunburst}
          alt=""
          width="42"
          height="42"
        />
      </div>

      <p className="gz-cta__watermark" aria-hidden="true">
        Connect
      </p>

      <div className="geroz-container-wide gz-cta__container relative z-[1] px-4 sm:px-6 lg:px-11">
        <div className="gz-cta__content">
          <div className="gz-cta__split">
            <h2 className="gz-cta__heading" aria-label={cta.heading}>
              {headingLines.map((line) => (
                <span key={line} className="gz-cta__line">
                  <span className="gz-cta__line-inner">{line}</span>
                </span>
              ))}
            </h2>

            <div className="gz-cta__panel">
              <header className="gz-cta__panel-head">
                <p className="gz-cta__section-tag">Connect</p>
                <CtaConnectAccent />
              </header>

              {cta.mailto ? (
                <div className="gz-cta__choices">
                  <ThemeButton href={cta.mailto} className="gz-cta__button">
                    {cta.ctaLabel}
                  </ThemeButton>

                  {cta.email ? (
                    <a href={cta.mailto} className="gz-cta__email">
                      {cta.email}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

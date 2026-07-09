import { useCvCtaContent } from '../../hooks/useCvCtaContent.js';
import { GEROZ_DECOR_SHAPES } from '../../data/geroz/constants.js';
import GerozEyebrow from './GerozEyebrow.jsx';
import GerozLuxuryBackdrop from './GerozLuxuryBackdrop.jsx';
import GerozThemeButton from './GerozThemeButton.jsx';

function CtaHeaderAccent() {
  return (
    <div className="gz-cta__accent mt-[clamp(0.75rem,2vw,1.25rem)] flex w-full max-w-[48rem] items-center justify-center gap-[clamp(1rem,3vw,2rem)]">
      <span
        className="gz-cta__accent-line h-px flex-1 max-w-[5.5rem] bg-[linear-gradient(90deg,transparent,var(--color-lawyer))]"
        aria-hidden="true"
      />
      <span
        className="gz-cta__accent-dot block size-[0.35rem] shrink-0 rounded-full bg-lawyer shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-lawyer)_18%,transparent)]"
        aria-hidden="true"
      />
      <span
        className="gz-cta__accent-line h-px flex-1 max-w-[5.5rem] bg-[linear-gradient(270deg,transparent,var(--color-lawyer))]"
        aria-hidden="true"
      />
    </div>
  );
}

export default function GerozCvCtaSection() {
  const cta = useCvCtaContent();
  const headingLines = cta.headingLines.length ? cta.headingLines : [cta.heading];

  return (
    <section id="cta" className="gz-cta relative isolate overflow-hidden">
      <GerozLuxuryBackdrop
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
        <header className="gz-cta__masthead mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <p className="gz-cta__section-tag">Connect</p>

          {cta.eyebrow ? (
            <div className="gz-cta__eyebrow-wrap mt-3">
              <GerozEyebrow className="mx-auto">{cta.eyebrow}</GerozEyebrow>
            </div>
          ) : null}

          <CtaHeaderAccent />
        </header>

        <div className="gz-cta__content mx-auto max-w-[46rem] text-center">
          <h2 className="gz-cta__heading" aria-label={cta.heading}>
            {headingLines.map((line) => (
              <span key={line} className="gz-cta__line">
                <span className="gz-cta__line-inner">{line}</span>
              </span>
            ))}
          </h2>

          {cta.statement ? (
            <p className="gz-cta__statement">{cta.statement}</p>
          ) : null}

          {cta.mailto ? (
            <div className="gz-cta__choices">
              <GerozThemeButton href={cta.mailto} className="gz-cta__button">
                {cta.ctaLabel}
              </GerozThemeButton>

              {cta.email ? (
                <>
                  <span className="gz-cta__or" aria-hidden="true">
                    or
                  </span>
                  <a href={cta.mailto} className="gz-cta__email">
                    {cta.email}
                  </a>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

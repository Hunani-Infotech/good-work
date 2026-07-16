import { useCvCtaContent } from '../../../hooks/useCvCtaContent.js';

const VIEWFINDER_CORNERS = ['tl', 'tr', 'bl', 'br'];

function ShoooteConnectBackdrop() {
  return (
    <div className="shooote-connect__backdrop" aria-hidden="true">
      <span className="shooote-connect__orb shooote-connect__orb--a" />
      <span className="shooote-connect__orb shooote-connect__orb--b" />
      <span className="shooote-connect__wash" />
      <span className="shooote-connect__vignette" />
      <span className="shooote-connect__grain" />
      <span className="shooote-connect__watermark">05</span>
    </div>
  );
}

export default function CtaSection() {
  const cta = useCvCtaContent();
  const headingLines = cta.headingLines.length ? cta.headingLines : [cta.heading];

  return (
    <section id="connect" className="shooote-connect" aria-labelledby="shooote-connect-heading">
      <ShoooteConnectBackdrop />

      <div className="shooote-connect__filmstrip shooote-connect__filmstrip--top" aria-hidden="true" />
      <div className="shooote-connect__filmstrip shooote-connect__filmstrip--bottom" aria-hidden="true" />

      <div className="shooote-connect__viewfinder" aria-hidden="true">
        {VIEWFINDER_CORNERS.map((corner) => (
          <span key={corner} className={`shooote-connect__vf shooote-connect__vf--${corner}`} />
        ))}
      </div>

      <div className="shooote-connect__panel">
        <div className="container shooote-connect__container">
          <div className="shooote-connect__grid">
            {cta.eyebrow ? (
              <div className="shooote-connect__eyebrow-row">
                <span className="shooote-connect__eyebrow-mark" aria-hidden="true" />
                <p className="shooote-connect__eyebrow">{cta.eyebrow}</p>
              </div>
            ) : null}

            <div className="shooote-connect__divider" aria-hidden="true" />

            <div className="shooote-connect__primary">
              <div className="shooote-connect__heading-wrap">
                <h2 id="shooote-connect-heading" className="shooote-connect__heading">
                  {headingLines.map((line) => (
                    <span key={line} className="shooote-connect__heading-line">
                      {line}
                    </span>
                  ))}
                </h2>
              </div>
            </div>

            <div className="shooote-connect__aside">
              {cta.statement ? (
                <p className="shooote-connect__statement">{cta.statement}</p>
              ) : null}

              {cta.mailto ? (
                <div className="shooote-connect__actions">
                  <a href={cta.mailto} className="shooote-connect__cta">
                    <span className="shooote-connect__cta-label">{cta.ctaLabel}</span>
                    <span className="shooote-connect__cta-arrow" aria-hidden="true">
                      <span className="shooote-connect__cta-arrow-glyph">→</span>
                    </span>
                  </a>

                  {cta.email ? (
                    <>
                      <span className="shooote-connect__actions-sep" aria-hidden="true" />
                      <a href={cta.mailto} className="shooote-connect__email">
                        {cta.email}
                      </a>
                    </>
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

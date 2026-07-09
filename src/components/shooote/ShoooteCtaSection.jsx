import { useCvCtaContent } from '../../hooks/useCvCtaContent.js';

export default function ShoooteCtaSection() {
  const cta = useCvCtaContent();
  const displayWords = cta.headingLines.length ? cta.headingLines : [cta.heading];

  return (
    <section id="connect" className="shooote-connect-section" aria-labelledby="shooote-connect-title">
      <div className="container">
        <div className="shooote-connect-section__inner wow fadeInUp" data-wow-duration="1200ms">
          {cta.eyebrow ? (
            <p className="shooote-connect-section__kicker poort-text poort-in-right">
              {cta.eyebrow}
            </p>
          ) : null}

          <h2 id="shooote-connect-title" className="shooote-connect-section__title" aria-label={cta.heading}>
            {displayWords.map((word) => (
              <span key={word} className="shooote-connect-section__word poort-text poort-in-right">
                {word}
              </span>
            ))}
          </h2>

          {cta.statement ? (
            <p className="shooote-connect-section__copy shooote-scroll-fade">{cta.statement}</p>
          ) : null}

          {cta.mailto ? (
            <a href={cta.mailto} className="theme-btn shooote-mailto-btn shooote-connect-section__btn">
              <i className="icon">
                <img src="/assets/shooote/images/arrow-2.svg" alt="" />
              </i>
              <i className="link-text">
                <span>{cta.ctaLabel}</span>
              </i>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

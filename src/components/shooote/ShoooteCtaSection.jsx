import GwSection from '../shared/GwSection.jsx';
import { useCvCtaContent } from '../../hooks/useCvCtaContent.js';

function CtaAccent() {
  return (
    <div className="shooote-cta__accent" aria-hidden="true">
      <span className="shooote-cta__accent-line" />
      <span className="shooote-cta__accent-dot" />
      <span className="shooote-cta__accent-line" />
    </div>
  );
}

function CtaDecor() {
  return (
    <div className="shooote-cta__decor" aria-hidden="true">
      <span className="shooote-cta__orb shooote-cta__orb--a" />
      <span className="shooote-cta__orb shooote-cta__orb--b" />
    </div>
  );
}

export default function ShoooteCtaSection() {
  const cta = useCvCtaContent();
  const headingLines = cta.headingLines.length ? cta.headingLines : [cta.heading];

  return (
    <GwSection
      theme="shooote"
      id="connect"
      className="wpo-connect-section"
      sectionLabel={`05 — ${cta.tag}`}
      beforeInner={<CtaDecor />}
    >
      <p className="shooote-cta__watermark" aria-hidden="true">
        {cta.tag}
      </p>

      <div className="shooote-cta__panel">
        {cta.eyebrow ? (
          <p className="shooote-cta__eyebrow">{cta.eyebrow}</p>
        ) : null}

        <CtaAccent />

        <h2 className="shooote-cta__heading" aria-label={cta.heading}>
          {headingLines.map((line) => (
            <span key={line} className="shooote-cta__heading-line poort-text poort-in-right">
              {line}
            </span>
          ))}
        </h2>

        {cta.statement ? (
          <p className="gw-section__statement shooote-scroll-fade">{cta.statement}</p>
        ) : null}

        {cta.mailto ? (
          <div className="shooote-cta__actions">
            <a href={cta.mailto} className="theme-btn shooote-mailto-btn">
              <i className="icon">
                <img src="/assets/shooote/images/arrow-2.svg" alt="" />
              </i>
              <i className="link-text">
                <span>{cta.ctaLabel}</span>
              </i>
            </a>
          </div>
        ) : null}
      </div>
    </GwSection>
  );
}

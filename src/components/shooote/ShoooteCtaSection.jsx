import GwSection from '../shared/GwSection.jsx';
import { useCvCtaContent } from '../../hooks/useCvCtaContent.js';

export default function ShoooteCtaSection() {
  const cta = useCvCtaContent();

  return (
    <GwSection
      theme="shooote"
      id="connect"
      className="wpo-connect-section"
      sectionLabel={`05 — ${cta.tag}`}
    >
      <div className="shooote-cta__panel">
        {cta.eyebrow ? (
          <p className="shooote-cta__eyebrow">{cta.eyebrow}</p>
        ) : null}

        <h2 className="shooote-cta__heading poort-text poort-in-right" aria-label={cta.heading}>
          {cta.heading}
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

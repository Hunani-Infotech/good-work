import { useCvCtaContent } from '../../../hooks/useCvCtaContent.js';
import TidalCopperSection from './TidalCopperSection.jsx';

export default function TidalCopperCtaSection() {
  const cta = useCvCtaContent();

  return (
    <TidalCopperSection
      id="connect"
      screenClass="cv-connect-screen"
      label={`04 — ${cta.tag}`}
      poweredByDark
    >
      <div className="cv-panel cv-connect-panel" id="connectPanel">
        <div className="cv-panel-body cv-connect-body">
          {cta.eyebrow ? (
            <p className="cv-connect-eyebrow" id="connectEyebrow">
              {cta.eyebrow}
            </p>
          ) : null}
          <h2 className="cv-connect-header" id="connectHeader">
            {cta.heading}
          </h2>
          {cta.statement ? (
            <p className="cv-connect-statement" id="connectStatement">
              {cta.statement}
            </p>
          ) : null}
          {cta.mailto ? (
            <a href={cta.mailto} className="cta-btn cv-connect-cta" id="connectCta">
              {cta.ctaLabel} →
            </a>
          ) : null}
        </div>
      </div>
    </TidalCopperSection>
  );
}

import { useSite } from '../../context/SiteContext';
import TidalCopperSection from './TidalCopperSection.jsx';

const SKYLINE = (
  <svg className="skyline-deco" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" fill="none" aria-hidden="true">
    <path fill="currentColor" d="M0 120V72h24l8-48 12 48h20l10-64 8 64h18l6-40 14 40h22l4-28 16 28h20l12-56 10 56h24l6-32 8 32h20v48H0Z" opacity="0.9" />
    <path fill="currentColor" d="M198 24 210 88h14l8-52 10 52h16l6-36 12 36h18l4-24 14 24h20V120H0V88h198V24Z" opacity="0.35" />
  </svg>
);

export default function TidalCopperNarrativeSection() {
  const { site } = useSite();
  const narrative = site.home.narrative;

  if (!narrative?.paragraphs?.length) return null;

  return (
    <TidalCopperSection
      screenClass="cv-narrative-screen"
      label="03 — Narrative"
      labelLight
      eyebrowId="narrEyebrow"
      eyebrow={narrative.tag}
      eyebrowClassName="narrative-eyebrow"
      backgroundImage={narrative.backgroundImage}
      beforeInner={SKYLINE}
    >
      <div className="narrative-content">
        {narrative.paragraphs.map((para, i) => (
          <p key={i} className="narrative-para" data-roll>{para}</p>
        ))}
      </div>
    </TidalCopperSection>
  );
}

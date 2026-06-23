import { useSite } from '../../context/SiteContext';
import TidalCopperSection from './TidalCopperSection.jsx';

export default function TidalCopperExpertiseSection() {
  const { site } = useSite();
  const { hero } = site.home;
  const { contact } = site.site;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailtoSubjectNav || '')}`;
  const ctaLabel = hero.ctaLabel || "Let's Connect";

  return (
    <TidalCopperSection screenClass="cv-what-screen" label="02 — What I Do" poweredByDark>
      <div className="cv-panel" id="whatPanel">
        <div className="cv-panel-body">
          <h2 className="cv-what-header" id="whatHeader">{hero.heading}</h2>

          {hero.heroStatement ? (
            <p className="cv-what-statement" id="whatStatement">{hero.heroStatement}</p>
          ) : null}

          <a href={mailto} className="cta-btn" id="whatCta">
            {ctaLabel} →
          </a>
        </div>
      </div>
    </TidalCopperSection>
  );
}

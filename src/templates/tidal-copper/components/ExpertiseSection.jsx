import { scrollToTidalCopperConnect } from '../../../animations/tidalCopperAnimations.js';
import { useSite } from '../../../context/SiteContext';
import Section from './Section.jsx';

export default function ExpertiseSection() {
  const { site } = useSite();
  const { hero } = site.home;
  const ctaLabel = hero.ctaLabel || "Let's Connect";

  const onConnectClick = (event) => {
    event.preventDefault();
    scrollToTidalCopperConnect();
  };

  return (
    <Section screenClass="cv-what-screen" label="02 — Hero" poweredByDark>
      <div className="cv-panel" id="whatPanel">
        <div className="cv-panel-body">
          <h2 className="cv-what-header" id="whatHeader">{hero.heading}</h2>

          {hero.heroStatement ? (
            <p className="cv-what-statement" id="whatStatement">{hero.heroStatement}</p>
          ) : null}

          <a href="#connect" className="cta-btn" id="whatCta" onClick={onConnectClick}>
            {ctaLabel} →
          </a>
        </div>
      </div>
    </Section>
  );
}

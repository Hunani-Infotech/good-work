import { useSite } from '../../../context/SiteContext';
import PoweredBy from './PoweredBy.jsx';

export default function Hero() {
  const { site } = useSite();
  const { hero } = site.home;
  const { brand } = site.site;

  return (
    <section className="cv-hero-screen">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-bg-noise" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <span className="hero-index">01 — Main</span>

      <div className="hero-content">
        {hero.profilePhoto ? (
          <div className="hero-photo-wrapper">
            <div className="hero-photo">
              <img src={hero.profilePhoto} alt={brand.firstName} loading="eager" />
            </div>
          </div>
        ) : null}

        <h1 className="hero-name" aria-label={brand.firstName}>
          <span className="hero-name-inner">{brand.firstName}</span>
        </h1>

        {hero.subtitle ? <p className="hero-role">{hero.subtitle}</p> : null}
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="scroll-line" />
        <span className="scroll-label">Scroll</span>
      </div>

      <PoweredBy />
    </section>
  );
}

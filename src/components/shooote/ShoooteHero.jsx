import { scrollToShoooteAnchor } from '../../animations/shoooteAnimations.js';
import { GwSectionLabel } from '../shared/GwSection.jsx';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';

export default function ShoooteHero() {
  const { hero } = useShoooteContent();

  const onScrollCue = (e) => {
    e.preventDefault();
    scrollToShoooteAnchor('#expertise');
  };

  return (
    <section className="wpo-hero-static shooote-hero-split" id="profile">
      <GwSectionLabel center>{hero.sectionLabel}</GwSectionLabel>

      <div className="shooote-hero-stage">
        <div className={`shooote-hero-name${hero.hasLastName ? '' : ' shooote-hero-name--no-last'}`}>
          <h1 className="shooote-hero-line shooote-hero-line--top poort-in-up">{hero.nameLine1}</h1>
          <div className="shooote-hero-portrait">
            <img src={hero.image} alt={hero.title} />
          </div>
          {hero.hasLastName ? (
            <h1 className="shooote-hero-line shooote-hero-line--bottom poort-in-up">{hero.nameLine2}</h1>
          ) : null}
        </div>

        {hero.role ? (
          <p className="shooote-hero-role">{hero.role}</p>
        ) : null}

        <a href="#expertise" className="shooote-hero-scroll menu-link" onClick={onScrollCue} aria-label="Scroll to expertise">
          <span aria-hidden="true">⌄</span>
        </a>
      </div>
    </section>
  );
}

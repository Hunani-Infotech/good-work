import { scrollToShoooteAnchor } from '../../../animations/shoooteAnimations.js';
import { useContent } from '../../../hooks/shooote/useContent.js';

export default function Hero() {
  const { hero } = useContent();

  const onScrollCue = (e) => {
    e.preventDefault();
    scrollToShoooteAnchor('#expertise');
  };

  return (
    <section className="wpo-hero-static shooote-hero-split" id="profile">
      <div className="shooote-hero-petals" aria-hidden="true">
        <span className="shooote-hero-petal shooote-hero-petal--a" />
        <span className="shooote-hero-petal shooote-hero-petal--b" />
        <span className="shooote-hero-petal shooote-hero-petal--c" />
        <span className="shooote-hero-petal shooote-hero-petal--d" />
      </div>
      <div className="shooote-hero-grain" aria-hidden="true" />

      <div className="shooote-hero-stage">
        {hero.hasLastName ? (
          <div className="shooote-hero-name">
            <h1 className="shooote-hero-line shooote-hero-line--top shooote-hero-blur-text">{hero.nameLine1}</h1>
            <div className="shooote-hero-portrait">
              <img src={hero.image} alt={hero.title} />
            </div>
            <h1 className="shooote-hero-line shooote-hero-line--bottom shooote-hero-blur-text">{hero.nameLine2}</h1>
          </div>
        ) : (
          <div
            className="shooote-hero-name shooote-hero-name--no-last"
            style={{ '--hero-name-chars': hero.nameCharCount }}
          >
            <h1 className="shooote-hero-inline-name">
              <span className="shooote-hero-line shooote-hero-line--left shooote-hero-blur-text">
                {hero.nameParts?.left}
              </span>
              <span className="shooote-hero-portrait">
                <img src={hero.image} alt={hero.title} />
              </span>
              {hero.nameParts?.right ? (
                <span className="shooote-hero-line shooote-hero-line--right shooote-hero-blur-text">
                  {hero.nameParts.right}
                </span>
              ) : null}
            </h1>
          </div>
        )}

        {hero.role ? (
          <p className="shooote-hero-role">{hero.role}</p>
        ) : null}

        <a href="#expertise" className="shooote-hero-scroll menu-link" onClick={onScrollCue} aria-label="Scroll to about">
          <svg className="shooote-hero-scroll__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}

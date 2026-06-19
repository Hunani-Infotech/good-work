import { useSite } from '../../context/SiteContext';

export default function HomeHero() {
  const { site } = useSite();
  const { hero } = site.home;
  const { contact } = site.site;
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailtoSubjectNav || 'Hey!')}`;

  return (
    <div data-nav="peach" className="wrapper-hero hero-goodwork">
      <div className="img-hero-wrapper" aria-hidden="true">
        <div className="hero-fx">
          <div className="hero-fx-orb hero-fx-orb--1" />
          <div className="hero-fx-orb hero-fx-orb--2" />
          <div className="hero-fx-orb hero-fx-orb--3" />
          <div className="hero-fx-sweep" />
          <div className="hero-fx-grid" />
          <div className="hero-fx-grain" />
        </div>
      </div>

      <div className="w-layout-blockcontainer wrapper-hero-home w-container">
        <div className="conter-content-hero hero-content-3d">

          {hero.profilePhoto ? (
            <div className="hero-profile-photo">
              <img src={hero.profilePhoto} alt="" loading="eager" />
            </div>
          ) : null}

          {hero.subtitle ? (
            <p className="hero-role">{hero.subtitle}</p>
          ) : null}

          <div className="hero-top">
            <h1 className="heading hero-heading">
              {hero.heading.split('\n').map((line, i, arr) => (
                <span key={line}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>

          {hero.heroStatement ? (
            <div className="hero-statement-block">
              <p className="body-copy hero-statement">{hero.heroStatement}</p>
              <a href={mailto} className="hero-cta-btn">
                Let's Connect
              </a>
            </div>
          ) : null}

        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <span className="hero-scroll-cue__line" />
          <span className="hero-scroll-cue__text">Scroll</span>
        </div>
      </div>
    </div>
  );
}

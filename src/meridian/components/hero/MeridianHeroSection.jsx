import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';
import { scrollMeridianToHash } from '../../../animations/meridianAnimations.js';
import { MARQUEE_COPIES } from '../../../animations/meridianMarquee.js';

export default function MeridianHeroSection() {
  const { hero } = useMeridianContent();
  const roleInMarquee = hero.marqueeLayout === 'inline-paired';
  const rolePrimary = roleInMarquee ? '' : (hero.roleLines?.[0] ?? hero.subtitle);
  const roleSecondary = roleInMarquee ? '' : (hero.roleLines?.slice(1).join(' & ') || '');
  const showRole = Boolean(rolePrimary || roleSecondary);

  return (
    <section
      id="top"
      className={`meridian-hero${
        roleInMarquee ? ' meridian-hero--marquee-paired' : ''
      }${
        hero.marqueeLayout === 'inline-only' ? ' meridian-hero--marquee-single' : ''
      }`}
    >
      <div className="meridian-hero__atmosphere" aria-hidden="true">
        <div className="meridian-hero__spotlight" />
        <div className="meridian-hero__vignette" />
        <div className="meridian-hero__grain" />
      </div>

      <p className="meridian-hero__mobile-name" aria-hidden="true">
        {hero.firstName}
      </p>

      {showRole ? (
        <div className="meridian-hero__role">
          <span className="meridian-hero__role-arrow" aria-hidden="true">↘</span>
          <div className="meridian-hero__role-copy">
            {rolePrimary ? <span>{rolePrimary}</span> : null}
            {roleSecondary ? <span>{roleSecondary}</span> : null}
          </div>
        </div>
      ) : null}

      <svg
        className="meridian-hero__globe"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="27.5" stroke="currentColor" strokeWidth="1.25" />
        <ellipse cx="32" cy="32" rx="27.5" ry="10.5" stroke="currentColor" strokeWidth="1.25" />
        <ellipse cx="32" cy="32" rx="10.5" ry="27.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M4.5 32h55" stroke="currentColor" strokeWidth="1.25" />
        <path d="M32 4.5v55" stroke="currentColor" strokeWidth="1.25" />
      </svg>

      <div className="meridian-hero__portrait-wrap">
        <div className="meridian-hero__portrait-stage">
          <div className="meridian-hero__portrait-halo" aria-hidden="true" />
          <div className="meridian-hero__portrait-ring" aria-hidden="true" />

          <div className="meridian-hero__portrait-shell">
            <img
              className="meridian-hero__portrait"
              src={hero.profilePhoto}
              alt={hero.portraitAlt}
              width="520"
              height="520"
              loading="eager"
              fetchPriority="high"
              style={{ objectPosition: hero.portraitObjectPosition }}
            />
          </div>
        </div>
      </div>

      <div className="meridian-hero__marquee" aria-hidden="true">
        <div className="meridian-hero__marquee-track">
          {Array.from({ length: MARQUEE_COPIES }, (_, index) => {
            if (hero.marqueeLayout === 'inline-paired') {
              return (
                <span
                  key={index}
                  className="meridian-hero__marquee-item meridian-hero__marquee-item--paired"
                >
                  <span className="meridian-hero__marquee-pair-inner">
                    <span className="meridian-hero__marquee-pair-name">{hero.nameLine1}</span>
                    <span className="meridian-hero__marquee-pair-meta">
                      <span className="meridian-hero__marquee-pair-sep" aria-hidden="true">—</span>
                      <span className="meridian-hero__marquee-pair-title">{hero.nameLine2}</span>
                    </span>
                  </span>
                </span>
              );
            }

            if (hero.marqueeLayout === 'inline-only') {
              return (
                <span key={index} className="meridian-hero__marquee-item meridian-hero__marquee-item--inline">
                  {hero.nameLine1}
                </span>
              );
            }

            if (hero.marqueeLayout === 'inline-full') {
              return (
                <span key={index} className="meridian-hero__marquee-item meridian-hero__marquee-item--full">
                  {hero.fullName}
                  <span className="meridian-hero__marquee-sep"> —</span>
                </span>
              );
            }

            return null;
          })}
        </div>
      </div>

      <a
        href="#manifesto"
        className="meridian-hero__scroll-cue"
        onClick={(e) => {
          e.preventDefault();
          scrollMeridianToHash('#manifesto');
        }}
        aria-label="Scroll to content"
      >
        <span className="meridian-hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}

import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';
import { scrollMeridianToHash } from '../../../animations/meridianAnimations.js';
import { MARQUEE_COPIES } from '../../../animations/meridianMarquee.js';

export default function MeridianHeroSection() {
  const { hero } = useMeridianContent();
  const rolePrimary = hero.roleLines?.[0] ?? hero.subtitle;
  const roleSecondary = hero.roleLines?.slice(1).join(' & ') || '';

  return (
    <section id="top" className="meridian-hero">
      <div className="meridian-hero__atmosphere" aria-hidden="true">
        <div className="meridian-hero__spotlight" />
        <div className="meridian-hero__vignette" />
        <div className="meridian-hero__grain" />
      </div>

      <div className="meridian-hero__role">
        <span className="meridian-hero__role-arrow" aria-hidden="true">↗</span>
        <div className="meridian-hero__role-copy">
          {rolePrimary ? <span>{rolePrimary}</span> : null}
          {roleSecondary ? <span>{roleSecondary}</span> : null}
        </div>
      </div>

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
          {Array.from({ length: MARQUEE_COPIES }, (_, index) => (
            <span key={index} className="meridian-hero__marquee-item">
              {hero.marqueeText}
            </span>
          ))}
        </div>
      </div>

      <div className="meridian-hero__scroll-cue" aria-hidden="true">
        <span className="meridian-hero__scroll-line" />
      </div>

      <a
        href="#manifesto"
        className="meridian-hero__scroll-hint"
        onClick={(e) => {
          e.preventDefault();
          scrollMeridianToHash('#manifesto');
        }}
        aria-label="Scroll to content"
      />
    </section>
  );
}

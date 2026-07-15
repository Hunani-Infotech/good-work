import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';
import { scrollMeridianToHash } from '../../../animations/meridianAnimations.js';
import { MARQUEE_COPIES } from '../../../animations/meridianMarquee.js';
import ParticleWaves from './backgrounds/ParticleWaves.jsx';

export default function MeridianHeroSection() {
  const { hero } = useMeridianContent();
  const roleInMarquee = hero.marqueeLayout === 'inline-paired';
  const rolePrimary = hero.roleLines?.[0] ?? hero.subtitle ?? '';
  const roleSecondary = roleInMarquee ? '' : (hero.roleLines?.slice(1).join(' & ') || '');
  const showRole = Boolean(rolePrimary || roleSecondary);
  const marqueeCharCount = Math.max(hero.marqueeText?.trim().length ?? hero.nameLine1?.length ?? 1, 1);
  const marqueeRoleCharCount = Math.max(hero.nameLine2?.trim().length ?? 1, 1);

  return (
    <section
      id="top"
      className={`meridian-hero${
        roleInMarquee ? ' meridian-hero--marquee-paired' : ''
      }${
        hero.marqueeLayout === 'inline-only' ? ' meridian-hero--marquee-single' : ''
      }`}
      style={{
        '--meridian-marquee-chars': marqueeCharCount,
        '--meridian-marquee-role-chars': marqueeRoleCharCount,
      }}
    >
      <ParticleWaves />

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

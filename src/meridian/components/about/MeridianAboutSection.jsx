import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';

export default function MeridianAboutSection() {
  const { about, hero } = useMeridianContent();

  if (!about.paragraphs.length) return null;

  const sealInitial = hero.firstName?.charAt(0) ?? 'A';
  const hasVideoReel = Boolean(about.video?.src);

  return (
    <section id="about" className="meridian-about">
      <div className="meridian-about__inner">
        <div className="meridian-about__grid">
          <div className="meridian-about__media">
            <div className="meridian-about__media-shell">
              {hasVideoReel ? (
                <video
                  className="meridian-about__photo"
                  src={about.video.src}
                  poster={about.video.poster}
                  aria-label={about.imageAlt}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ objectPosition: about.imageObjectPosition }}
                />
              ) : (
                <img
                  className="meridian-about__photo"
                  src={about.image}
                  alt={about.imageAlt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: about.imageObjectPosition }}
                />
              )}
            </div>
          </div>

          <div className="meridian-about__content">
            <div className="meridian-about__seal" aria-hidden="true">
              <svg className="meridian-about__seal-ring" viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <path
                    id="meridian-about-seal-path"
                    d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  />
                </defs>
                <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1" />
                <text>
                  <textPath href="#meridian-about-seal-path" startOffset="50%" textAnchor="middle">
                    {`${about.eyebrow} · ${about.eyebrow} · `}
                  </textPath>
                </text>
              </svg>
              <span className="meridian-about__seal-mark">{sealInitial}</span>
            </div>

            <h2 className="meridian-about__heading">{about.heading}</h2>

            <div className="meridian-about__copy">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="meridian-about__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

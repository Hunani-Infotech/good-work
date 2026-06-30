import { useMeridianContent } from '../../../hooks/meridian/useMeridianContent.js';

export default function MeridianCapabilitiesSection() {
  const { capabilities } = useMeridianContent();

  if (!capabilities.items.length) return null;

  return (
    <section id="capabilities" className="meridian-capabilities">
      <div className="meridian-capabilities__inner">
        <p className="meridian-capabilities__eyebrow">{capabilities.eyebrow}</p>

        <ul className="meridian-capabilities__grid">
          {capabilities.items.map((item) => (
            <li key={item.id} className="meridian-capabilities__card">
              <article className="meridian-capabilities__card-shell">
                <div
                  className="meridian-capabilities__card-frame"
                  style={{ '--meridian-cap-card-image': `url(${capabilities.backgroundImage})` }}
                >
                  <div className="meridian-capabilities__card-inner">
                    <span className="meridian-capabilities__index">{item.number}</span>
                    <p className="meridian-capabilities__text">{item.text}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {capabilities.ctaLabel ? (
          <div className="meridian-capabilities__cta-wrap">
            <a
              href={capabilities.ctaHref}
              className="meridian-capabilities__cta meridian-magnetic"
              data-magnetic-strength="0.34"
              data-magnetic-label-strength="0.1"
            >
              <span className="meridian-magnetic__inner" data-magnetic-inner>
                <span className="meridian-magnetic__surface meridian-liquid-fill">
                  <span className="meridian-liquid-fill__wave" aria-hidden="true" />
                  <span className="meridian-magnetic__label" data-magnetic-text>
                    {capabilities.ctaLabel}
                  </span>
                </span>
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

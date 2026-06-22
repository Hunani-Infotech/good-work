import { PORTFOLIO_TEMPLATES } from '../../data/portfolioTemplates';

const HERO_COLLAGE = PORTFOLIO_TEMPLATES.slice(0, 4).map((template, index) => ({
  id: template.id,
  image: `/images/agency/hero-collage-${index + 1}.svg`,
  label: template.title,
}));

function CollagePanel({ className, image, label }) {
  return (
    <article className={`agency-collage__panel ${className}`}>
      <div className="agency-collage__panel-body">
        <div className="agency-collage__frame">
          <img
            src={image}
            alt=""
            className="agency-collage__img"
            loading="eager"
            decoding="async"
          />
        </div>
        {label ? <span className="agency-collage__label">{label}</span> : null}
      </div>
    </article>
  );
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function AgencyHero() {
  return (
    <section className="agency-hero agency-hero--editorial" data-nav-logo="light">
      <div className="agency-hero__announce">
        <p className="agency-hero__announce-text">
          <strong>Free to start</strong>
          <span className="agency-hero__announce-sep" aria-hidden="true">·</span>
          Build your CV portfolio in minutes
        </p>
        <button type="button" className="agency-hero__announce-link" onClick={() => scrollTo('cta')}>
          Start building →
        </button>
      </div>

      <div className="agency-hero__canvas">
        <div className="agency-hero__inner">
          <div className="agency-hero__copy">
            <h1 className="agency-hero__headline">
              <span className="agency-hero__line">Reimagining your</span>
              <span className="agency-hero__line agency-hero__line--accent">
                <svg className="agency-hero__oval" viewBox="0 0 300 72" preserveAspectRatio="none" aria-hidden="true">
                  <ellipse
                    className="agency-hero__oval-path"
                    cx="150"
                    cy="36"
                    rx="142"
                    ry="30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="agency-hero__mark-text">career story</span>
              </span>
            </h1>

            <p className="agency-hero__sub">
              Create a stunning CV portfolio, pick a template, and share your unique link
              instantly — on WhatsApp, LinkedIn, or anywhere.
            </p>

            <div className="agency-hero__ctas">
              <button type="button" className="agency-btn-primary" onClick={() => scrollTo('cta')}>
                Start Building Free →
              </button>
              <button type="button" className="agency-btn-ghost" onClick={() => scrollTo('templates')}>
                See Templates
              </button>
            </div>

            <div className="agency-hero__stats">
              <span className="agency-hero__stats-item">2,000+ CVs created</span>
              <span className="agency-hero__stats-dot" aria-hidden="true" />
              <span className="agency-hero__stats-item">50+ templates</span>
              <span className="agency-hero__stats-dot" aria-hidden="true" />
              <span className="agency-hero__stats-item">Free to start</span>
            </div>
          </div>

          <div className="agency-hero__collage-wrap">
            <div className="agency-hero__collage" aria-hidden="true">
              <div className="agency-collage__stage">
                {HERO_COLLAGE.map((item, index) => (
                  <CollagePanel
                    key={item.id}
                    className={`agency-collage__panel--${index + 1}`}
                    image={item.image}
                    label={item.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="agency-hero__grain" aria-hidden="true" />
    </section>
  );
}

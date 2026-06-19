function MockupCard({ variant, lines }) {
  return (
    <div className={`mockup-card mockup-card--${variant}`}>
      <div className="mockup-card__header">
        <div className="mockup-card__dot" />
        <div className="mockup-card__dot" />
        <div className="mockup-card__dot" />
      </div>
      <div className="mockup-card__body">
        <div className="mockup-card__avatar" />
        <div className="mockup-card__line mockup-card__line--lg" />
        <div className="mockup-card__line mockup-card__line--md" />
        <div className="mockup-card__line mockup-card__line--sm" />
        {lines && <div className="mockup-card__line mockup-card__line--xs" />}
        <div className="mockup-card__pill" />
      </div>
    </div>
  );
}

export default function AgencyHero() {
  return (
    <section className="agency-hero" data-nav-logo="dark">
      {/* SVG liquid filter — referenced by agencyAnimations.js */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="gw-liquid" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence id="gw-turb" type="turbulence" baseFrequency="0.08 0.04" numOctaves="3" seed="5" result="noise" />
            <feDisplacementMap id="gw-disp" in="SourceGraphic" in2="noise" scale="24" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="agency-hero__orb agency-hero__orb--1" aria-hidden="true" />
      <div className="agency-hero__orb agency-hero__orb--2" aria-hidden="true" />
      <div className="agency-hero__orb agency-hero__orb--3" aria-hidden="true" />

      <div className="agency-hero__inner">
        <div className="agency-hero__content">
          <span className="agency-tag">Career Growth Platform</span>

          <h1 className="agency-hero__headline">
            Build your career<br />story in minutes.
          </h1>

          <p className="agency-hero__sub">
            Create a stunning CV portfolio, pick a template, and share
            your unique link instantly — on WhatsApp, LinkedIn, or anywhere.
          </p>

          <div className="agency-hero__ctas">
            <button
              className="agency-btn-primary"
              onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Building Free →
            </button>
            <button
              className="agency-btn-ghost"
              onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            >
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

        <div className="agency-hero__visual" aria-hidden="true">
          <div className="mockup-stack">
            <MockupCard variant="1" />
            <MockupCard variant="2" lines />
            <MockupCard variant="3" />
          </div>
        </div>
      </div>
    </section>
  );
}

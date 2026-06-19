const FEATURES = [
  {
    icon: '📱',
    title: 'Mobile-first',
    desc: 'Designed for Gen-Z. Create and manage your CV entirely from your phone.',
  },
  {
    icon: '⚡',
    title: 'Instant share',
    desc: 'One tap to copy your unique link. Share on WhatsApp, Instagram bio, or anywhere.',
  },
  {
    icon: '🎯',
    title: 'Custom URL',
    desc: 'Get a personalised link like goodwork.cv/yourname that\'s easy to remember.',
  },
  {
    icon: '✨',
    title: 'Modern templates',
    desc: 'Recruiter-approved designs that actually look good — not boring Word docs.',
  },
  {
    icon: '🔒',
    title: 'Always up to date',
    desc: 'Edit your CV anytime. Anyone with your link always sees the latest version.',
  },
  {
    icon: '🚀',
    title: 'Free to start',
    desc: 'Create your first CV portfolio completely free. No credit card required.',
  },
];

export default function AgencyFeatures() {
  return (
    <section className="agency-features" id="features">
      <div className="agency-section__inner">
        <div className="agency-section__header">
          <span className="agency-tag">Why Good Work CV?</span>
          <h2 className="agency-section__headline">Everything you need to stand out</h2>
        </div>

        <div className="agency-features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon" aria-hidden="true">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

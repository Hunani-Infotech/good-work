export default function AgencyCta() {
  return (
    <section className="agency-cta" id="cta">
      <div className="agency-cta__orb" aria-hidden="true" />
      <div className="agency-cta__inner">
        <span className="agency-tag" style={{ color: 'rgba(255,255,255,0.5)', alignSelf: 'center' }}>
          Get started today
        </span>
        <h2 className="agency-cta__headline">
          Ready to stand out?
        </h2>
        <p className="agency-cta__sub">
          Join 2,000+ young professionals who&apos;ve already built their career story with Good Work CV.
        </p>
        <button className="agency-btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
          Start Building Free →
        </button>
      </div>
    </section>
  );
}

export default function Cta() {
  return (
    <section className="agency-cta agency-cta--editorial" id="cta" data-nav-logo="light">
      <div className="agency-cta__frame">
        <div className="agency-cta__inner">
          <span className="agency-cta__eyebrow">Get started today</span>

          <h2 className="agency-cta__headline">
            <span className="agency-cta__headline-line">Ready to</span>
            <span className="agency-cta__accent-wrap">
              <svg className="agency-cta__oval" viewBox="0 0 280 64" preserveAspectRatio="none" aria-hidden="true">
                <ellipse
                  cx="140"
                  cy="32"
                  rx="132"
                  ry="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="agency-cta__accent">stand out?</span>
            </span>
          </h2>

          <p className="agency-cta__sub">
            Join 2,000+ young professionals who&apos;ve already built their career story with Good Work CV.
          </p>

          <button type="button" className="agency-btn-primary agency-cta__btn">
            Start Building Free →
          </button>

          <p className="agency-cta__note">Free to start · No credit card required</p>
        </div>
      </div>
    </section>
  );
}

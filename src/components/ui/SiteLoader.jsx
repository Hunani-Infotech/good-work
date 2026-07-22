import { GOODWORK_LOADER_LOGO } from '../../utils/brandLogos.js';

export default function SiteLoader() {
  return (
    <>
      <div className="loader-curtain-reveal" aria-hidden="true" />
      <div className="container-loader site-loader" aria-live="polite" aria-busy="true">
        <div className="loader-atmosphere" aria-hidden="true">
          <span className="loader-blob loader-blob--purple" data-loader-orb="purple" />
          <span className="loader-blob loader-blob--orange" data-loader-orb="orange" />
          <span className="loader-grid" />
          <span className="loader-watermark" data-loader-watermark>talent</span>
        </div>

        <div className="loader-stage">
          <div className="loader-logo-wrap" data-loader-logo-wrap>
            <img
              className="loader-logo"
              data-loader-logo
              src={GOODWORK_LOADER_LOGO}
              alt="GoodWork"
              width={480}
              height={236}
              decoding="async"
            />
            <span className="loader-dot" data-loader-dot aria-hidden="true" />
          </div>

          <p className="loader-tagline" data-loader-tagline>
            <span className="loader-tagline__main">Everyone has a unique talent.</span>
            <span className="loader-tagline__ask">What’s yours?</span>
          </p>

          <div className="loader-bar" data-loader-progress>
            <div className="loader-bar__track">
              <div className="loader-bar__fill" data-loader-progress-fill />
            </div>
            <div className="loader-bar__meta">
              <span className="loader-bar__status" data-loader-status>warming up…</span>
              <span className="loader-bar__pct">
                <span data-loader-counter>0</span>%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

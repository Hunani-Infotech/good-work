import { GOODWORK_LOADER_LOGO } from '../../utils/brandLogos.js';

const TAGLINE = 'Everyone has a unique talent. What’s yours?';

export default function SiteLoader() {
  return (
    <>
      <div className="loader-curtain-reveal" aria-hidden="true" />
      <div className="container-loader site-loader" aria-live="polite" aria-busy="true">
        <div className="loader-corner loader-corner--tl" />
        <div className="loader-corner loader-corner--tr" />
        <div className="loader-corner loader-corner--bl" />
        <div className="loader-corner loader-corner--br" />

        <div className="loader-stage">
          <div className="loader-logo-wrap" data-loader-logo-wrap>
            <img
              className="loader-logo"
              data-loader-logo
              src={GOODWORK_LOADER_LOGO}
              alt="GoodWork"
              width={420}
              height={206}
              decoding="async"
            />
            <span className="loader-dot" data-loader-dot aria-hidden="true" />
          </div>

          <p className="loader-tagline" data-loader-tagline>{TAGLINE}</p>

          <div className="loader-rule loader-rule--bottom" />

          <div className="loader-hud">
            <div className="loader-counter-wrap">
              <span className="loader-counter-num" data-loader-counter>0</span>
              <span className="loader-counter-pct">%</span>
            </div>
            <div className="loader-status-text" data-loader-status>Loading…</div>
          </div>
        </div>
      </div>
    </>
  );
}

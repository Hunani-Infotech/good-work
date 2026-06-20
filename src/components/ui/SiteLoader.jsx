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
          <div className="loader-eyebrow">Est. in craft · Built with purpose</div>
          <div className="loader-rule loader-rule--top" />

          <div className="loader-row loader-row--good">
            <span className="loader-char" data-loader-char="G">G</span>
            <span className="loader-char loader-char--circle">
              <span className="loader-dot" data-loader-dot />
            </span>
            <span className="loader-char" data-loader-char="O2">O</span>
            <span className="loader-char" data-loader-char="D">D</span>
          </div>

          <div className="loader-row loader-row--work">
            <span className="loader-char" data-loader-char="W">W</span>
            <span className="loader-char" data-loader-char="O3">O</span>
            <span className="loader-char" data-loader-char="R">R</span>
            <span className="loader-char" data-loader-char="K">K</span>
          </div>

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

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSite } from '../../context/SiteContext.jsx';

/**
 * VideoCvWidget – floating chatbot-style Video CV widget.
 * Rendered via React Portal directly into <body> to escape any ancestor
 * overflow:hidden, pointer-events:none, or stacking context issues.
 *
 * Props:
 *   accentColor  – hex/rgb for the ring / badge accent (default: '#510066')
 *   position     – 'bottom-right' | 'bottom-left' (default: 'bottom-right')
 */
export default function VideoCvWidget({ accentColor = '#510066', position = 'bottom-right' }) {
  const { site } = useSite();
  const { hero } = site.home;
  const { brand } = site.site;
  const videoCv = hero.videoCv || {};

  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Load HLS when opened
  const initVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoCv.src) return;

    const isHls = videoCv.src.includes('.m3u8');

    if (!isHls) {
      video.src = videoCv.src;
      video.load();
      video.play().catch(() => {});
      return;
    }

    const { default: Hls } = await import('hls.js');

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, backBufferLength: 60 });
      hlsRef.current = hls;
      hls.loadSource(videoCv.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoCv.src;
      video.load();
      video.play().catch(() => {});
    }
  }, [videoCv.src]);

  const destroyHls = useCallback(() => {
    const video = videoRef.current;
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    } else if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }, []);

  useEffect(() => {
    if (open) {
      initVideo();
    } else {
      destroyHls();
    }
    return () => {
      if (!open) destroyHls();
    };
  }, [open, initVideo, destroyHls]);

  if (!videoCv.src || dismissed) return null;

  const firstName = brand?.firstName || 'Sanjay';
  const title = hero?.subtitle || 'Project Lead Developer';
  const positionClass = position === 'bottom-left' ? 'vcv-widget--left' : 'vcv-widget--right';

  const widget = (
    <div
      className={`vcv-widget ${positionClass}`}
      style={{ '--vcv-accent': accentColor }}
      role="complementary"
      aria-label="GoodWork Video CV"
    >
      {/* ── Expanded Card ── */}
      <div
        className={`vcv-card ${open ? 'vcv-card--open' : ''}`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="vcv-card__header">
          <div className="vcv-card__header-info">
            <span className="vcv-live-dot" aria-hidden="true" />
            <span className="vcv-card__label">GoodWork Video CV</span>
          </div>
          <button
            type="button"
            className="vcv-card__close"
            onClick={() => setOpen(false)}
            aria-label="Close video CV"
          >
            ✕
          </button>
        </div>

        {/* Video */}
        <div className="vcv-card__video-wrap">
          <video
            ref={videoRef}
            className="vcv-card__video"
            poster={videoCv.poster || undefined}
            muted
            loop
            playsInline
            autoPlay
          />
          {/* Overlay gradient */}
          <div className="vcv-card__video-overlay" aria-hidden="true" />

          {/* Name pill */}
          <div className="vcv-card__identity">
            <p className="vcv-card__name">{firstName}</p>
            <p className="vcv-card__title">{title}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="vcv-card__footer">
          <span className="vcv-card__powered">Powered by <strong>GoodWork</strong></span>
          <button
            type="button"
            className="vcv-card__dismiss"
            onClick={() => { setOpen(false); setDismissed(true); }}
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* ── Collapsed Bubble ── */}
      <button
        type="button"
        className={`vcv-bubble ${open ? 'vcv-bubble--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Video CV' : 'Watch my Video CV'}
        aria-expanded={open}
      >
        {/* Pulsing ring */}
        <span className="vcv-bubble__ring" aria-hidden="true" />
        <span className="vcv-bubble__ring vcv-bubble__ring--delay" aria-hidden="true" />

        {/* Thumbnail / avatar */}
        {videoCv.poster ? (
          <img
            src={videoCv.poster}
            alt={`${firstName}'s Video CV`}
            className="vcv-bubble__avatar"
          />
        ) : (
          <span className="vcv-bubble__initials">{firstName[0]}</span>
        )}

        {/* Play icon shown when closed */}
        {!open && (
          <span className="vcv-bubble__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}

        {/* Tooltip label */}
        {!open && (
          <span className="vcv-bubble__tooltip" role="tooltip">
            Watch my Video CV
          </span>
        )}
      </button>
    </div>
  );

  // Render directly into <body> via portal — escapes ALL ancestor
  // overflow:hidden, pointer-events, and stacking context constraints.
  return createPortal(widget, document.body);
}

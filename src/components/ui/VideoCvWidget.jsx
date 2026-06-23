import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSite } from '../../context/SiteContext.jsx';

/**
 * VideoCvWidget – compact corner video card (chatbot-style).
 * Always visible on load, closes on X click, reappears on page reload.
 *
 * Props:
 *   accentColor – accent color for the header/ring (default: '#510066')
 *   position    – 'bottom-right' | 'bottom-left' (default: 'bottom-right')
 */
export default function VideoCvWidget({ accentColor = '#510066', position = 'bottom-right' }) {
  const { site } = useSite();
  const { hero } = site.home;
  const { brand } = site.site;
  const videoCv = hero.videoCv || {};

  const [dismissed, setDismissed] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoCv.src || dismissed) return;

    const isHls = videoCv.src.includes('.m3u8');
    let destroyed = false;

    const startPlayback = async () => {
      if (!isHls) {
        video.src = videoCv.src;
        video.load();
        video.play().catch(() => {});
        return;
      }

      const { default: Hls } = await import('hls.js');
      if (destroyed) return;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, backBufferLength: 60 });
        hlsRef.current = hls;
        hls.loadSource(videoCv.src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!destroyed) video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoCv.src;
        video.load();
        video.play().catch(() => {});
      }
    };

    startPlayback();

    return () => {
      destroyed = true;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      } else if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [videoCv.src, dismissed]);

  // Sync muted state to the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) video.play().catch(() => {});
  }, [muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

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
      {/* ── Compact Video Card ── */}
      <div className="vcv-card">

        {/* Close button — top right */}
        <button
          type="button"
          className="vcv-card__close"
          onClick={() => setDismissed(true)}
          aria-label="Close video CV"
        >
          ✕
        </button>

        {/* Mute / Unmute button — bottom right */}
        <button
          type="button"
          className={`vcv-card__mute ${muted ? 'vcv-card__mute--muted' : ''}`}
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!muted}
        >
          {muted ? (
            /* Muted icon */
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
              <path d="M16.5 12a4.5 4.5 0 01-4.5 4.5v-3.1l4.5-4.5c.6.8 1 1.8 1 3zm2.5 0c0-1.3-.4-2.5-1-3.5l1.4-1.4L18 5.7l-1.4 1.4A6.98 6.98 0 0012 5v2a5 5 0 015 5c0 .9-.3 1.8-.7 2.5l1.4 1.4c.8-1.1 1.3-2.5 1.3-3.9zM12 3L9.9 5.1 12 7.2V3zm-8.3.3L2.3 4.7l4.1 4.1L3 12h4l5 5v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.1v2.1c1.4-.3 2.6-1 3.6-1.9l2 2 1.4-1.4L3.7 3.3z" />
            </svg>
          ) : (
            /* Unmuted icon */
            <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.7-4.1v8.3c1.6-.7 2.7-2.3 2.7-4.2zM14 3.23v2.06c2.9.87 5 3.54 5 6.71s-2.1 5.84-5 6.71v2.06c4.01-.91 7-4.49 7-8.77S18.01 4.14 14 3.23z" />
            </svg>
          )}
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          className="vcv-card__video"
          poster={videoCv.poster || undefined}
          muted
          loop
          playsInline
          autoPlay
        />

        {/* Bottom overlay with name */}
        <div className="vcv-card__video-overlay" aria-hidden="true" />
        <div className="vcv-card__identity">
          <p className="vcv-card__name">{firstName}</p>
          <p className="vcv-card__title">{title}</p>
        </div>

        {/* GoodWork badge */}
        <div className="vcv-card__badge">
          <span className="vcv-card__badge-dot" />
          <span>Video CV</span>
        </div>
      </div>
    </div>
  );

  return createPortal(widget, document.body);
}

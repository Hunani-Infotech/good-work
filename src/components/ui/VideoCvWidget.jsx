import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { isLoaderSessionComplete, whenSiteLoaderReady } from '../../animations/loaderAnimations.js';
import { useSite } from '../../context/SiteContext.jsx';

const MOBILE_MAX_WIDTH = 768;

function useIsMobile(maxWidth = MOBILE_MAX_WIDTH) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [maxWidth]);

  return isMobile;
}

function useVideoPlayback(videoRef, hlsRef, src, active) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !active) return undefined;

    const isHls = src.includes('.m3u8');
    let destroyed = false;

    const startPlayback = async () => {
      if (!isHls) {
        video.src = src;
        video.load();
        video.play().catch(() => {});
        return;
      }

      const { default: Hls } = await import('hls.js');
      if (destroyed) return;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, backBufferLength: 60 });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!destroyed) video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
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
  }, [src, active]);
}

/**
 * VideoCvWidget – compact corner video card (chatbot-style).
 * Mobile: toggle button opens a small corner popup above the trigger.
 */
export default function VideoCvWidget({ accentColor = '#510066', position = 'bottom-right' }) {
  const { site } = useSite();
  const { hero } = site.home;
  const { brand } = site.site;
  const videoCv = hero.videoCv || {};

  const isMobile = useIsMobile();
  const [loaderReady, setLoaderReady] = useState(isLoaderSessionComplete());
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const firstName = brand?.firstName || 'Sanjay';
  const title = hero?.subtitle || 'Project Lead Developer';
  const positionClass = position === 'bottom-left' ? 'vcv-widget--left' : 'vcv-widget--right';
  const videoActive = !isMobile || expanded;

  useEffect(() => {
    if (isLoaderSessionComplete()) {
      setLoaderReady(true);
      return undefined;
    }

    let active = true;
    whenSiteLoaderReady().then(() => {
      if (active) setLoaderReady(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useVideoPlayback(videoRef, hlsRef, videoCv.src, !dismissed && loaderReady && videoActive);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) video.play().catch(() => {});
  }, [muted, expanded, isMobile]);

  useEffect(() => {
    if (!isMobile && expanded) setExpanded(false);
  }, [isMobile, expanded]);

  const toggleExpanded = useCallback(() => {
    setExpanded((open) => !open);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const closePopup = useCallback(() => {
    setExpanded(false);
  }, []);

  if (!videoCv.src || dismissed || !loaderReady) return null;

  const muteButton = (
    <button
      type="button"
      className={`vcv-card__mute ${muted ? 'vcv-card__mute--muted' : ''}`}
      onClick={toggleMute}
      aria-label={muted ? 'Unmute video' : 'Mute video'}
      aria-pressed={!muted}
    >
      {muted ? (
        <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M16.5 12a4.5 4.5 0 01-4.5 4.5v-3.1l4.5-4.5c.6.8 1 1.8 1 3zm2.5 0c0-1.3-.4-2.5-1-3.5l1.4-1.4L18 5.7l-1.4 1.4A6.98 6.98 0 0012 5v2a5 5 0 015 5c0 .9-.3 1.8-.7 2.5l1.4 1.4c.8-1.1 1.3-2.5 1.3-3.9zM12 3L9.9 5.1 12 7.2V3zm-8.3.3L2.3 4.7l4.1 4.1L3 12h4l5 5v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.1v2.1c1.4-.3 2.6-1 3.6-1.9l2 2 1.4-1.4L3.7 3.3z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.7-4.1v8.3c1.6-.7 2.7-2.3 2.7-4.2zM14 3.23v2.06c2.9.87 5 3.54 5 6.71s-2.1 5.84-5 6.71v2.06c4.01-.91 7-4.49 7-8.77S18.01 4.14 14 3.23z" />
        </svg>
      )}
    </button>
  );

  const videoCard = (
    <div className={`vcv-card${isMobile ? ' vcv-card--popup' : ''}`}>
      {isMobile ? (
        <button
          type="button"
          className="vcv-card__close"
          onClick={closePopup}
          aria-label="Close video"
        >
          ✕
        </button>
      ) : (
        <button
          type="button"
          className="vcv-card__close"
          onClick={() => setDismissed(true)}
          aria-label="Close video CV"
        >
          ✕
        </button>
      )}

      {muteButton}

      <video
        ref={videoRef}
        className="vcv-card__video"
        poster={videoCv.poster || undefined}
        muted
        loop
        playsInline
        autoPlay
      />

      <div className="vcv-card__video-overlay" aria-hidden="true" />
      <div className="vcv-card__identity">
        <p className="vcv-card__name">{firstName}</p>
        <p className="vcv-card__title">{title}</p>
      </div>

      <div className="vcv-card__badge">
        <span className="vcv-card__badge-dot" />
        <span>Video CV</span>
      </div>
    </div>
  );

  const widget = (
    <div
      className={`vcv-widget ${positionClass}${isMobile ? ' vcv-widget--mobile' : ''}${expanded ? ' vcv-widget--expanded' : ''}`}
      style={{ '--vcv-accent': accentColor }}
      role="complementary"
      aria-label="GoodWork Video CV"
    >
      {isMobile ? (
        <div className="vcv-mobile-stack">
          {expanded ? (
            <div className="vcv-popup" id="vcv-mobile-popup" role="region" aria-label={`${firstName} video CV`}>
              {videoCard}
            </div>
          ) : null}

          <button
            type="button"
            className={`vcv-trigger${expanded ? ' vcv-trigger--open' : ''}`}
            onClick={toggleExpanded}
            aria-expanded={expanded}
            aria-controls="vcv-mobile-popup"
            aria-label={expanded ? 'Close video CV' : `Open video CV for ${firstName}`}
          >
            {videoCv.poster ? (
              <img className="vcv-trigger__poster" src={videoCv.poster} alt="" />
            ) : (
              <span className="vcv-trigger__fallback" aria-hidden="true" />
            )}
            <span className="vcv-trigger__icon" aria-hidden="true">
              {expanded ? (
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
            <span className="vcv-trigger__label">Video CV</span>
          </button>
        </div>
      ) : (
        videoCard
      )}
    </div>
  );

  return createPortal(widget, document.body);
}

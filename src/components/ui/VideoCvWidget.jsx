import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { isLoaderSessionComplete, whenSiteLoaderReady } from '../../animations/loaderAnimations.js';
import { useSite } from '../../context/SiteContext.jsx';
import { useVideoPlayback } from '../../hooks/useVideoPlayback.js';

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

function MuteIcon({ muted }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
        <path d="M16.5 12a4.5 4.5 0 01-4.5 4.5v-3.1l4.5-4.5c.6.8 1 1.8 1 3zm2.5 0c0-1.3-.4-2.5-1-3.5l1.4-1.4L18 5.7l-1.4 1.4A6.98 6.98 0 0012 5v2a5 5 0 015 5c0 .9-.3 1.8-.7 2.5l1.4 1.4c.8-1.1 1.3-2.5 1.3-3.9zM12 3L9.9 5.1 12 7.2V3zm-8.3.3L2.3 4.7l4.1 4.1L3 12h4l5 5v-6.7l4.3 4.3c-.7.5-1.4.9-2.3 1.1v2.1c1.4-.3 2.6-1 3.6-1.9l2 2 1.4-1.4L3.7 3.3z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.7-4.1v8.3c1.6-.7 2.7-2.3 2.7-4.2zM14 3.23v2.06c2.9.87 5 3.54 5 6.71s-2.1 5.84-5 6.71v2.06c4.01-.91 7-4.49 7-8.77S18.01 4.14 14 3.23z" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="11" height="11" aria-hidden="true">
      <path
        d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * VideoCvWidget – compact corner card (chatbot-style).
 * Plays video when `videoCv.src` is set; otherwise shows poster image only.
 */
export default function VideoCvWidget({ accentColor = '#510066', position = 'bottom-right' }) {
  const { site } = useSite();
  const { hero } = site.home;
  const { brand } = site.site;
  const videoCv = hero.videoCv || {};
  const poster = videoCv.poster?.trim() || '';
  const videoSrc = videoCv.src?.trim() || '';
  const hasVideo = Boolean(videoSrc);
  const hasPoster = Boolean(poster);

  const isMobile = useIsMobile();
  const [loaderReady, setLoaderReady] = useState(isLoaderSessionComplete());
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const modalVideoRef = useRef(null);
  const modalHlsRef = useRef(null);
  const resumeTimeRef = useRef(0);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const firstName = brand?.firstName || 'Sanjay';
  const title = hero?.subtitle || 'Project Lead Developer';
  const positionClass = position === 'bottom-left' ? 'vcv-widget--left' : 'vcv-widget--right';
  const videoActive = !isMobile || expanded;
  const cardPlaybackActive = hasVideo && !dismissed && loaderReady && videoActive && !fullscreen;

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

  useVideoPlayback(videoRef, hlsRef, videoSrc, cardPlaybackActive);
  useVideoPlayback(modalVideoRef, modalHlsRef, videoSrc, hasVideo && fullscreen && loaderReady);

  const getActiveVideo = useCallback(
    () => (fullscreen ? modalVideoRef.current : videoRef.current),
    [fullscreen],
  );

  useEffect(() => {
    if (!hasVideo || fullscreen) return;
    const card = videoRef.current;
    if (card) card.muted = muted;
  }, [hasVideo, muted, fullscreen]);

  useEffect(() => {
    if (!hasVideo || !fullscreen) return undefined;

    const card = videoRef.current;
    const modal = modalVideoRef.current;
    if (!modal) return undefined;

    const startTime =
      (card && Number.isFinite(card.currentTime) ? card.currentTime : 0) ||
      resumeTimeRef.current;

    const syncTime = () => {
      if (startTime > 0) {
        try {
          modal.currentTime = startTime;
        } catch {
          /* metadata not ready */
        }
      }
      modal.muted = mutedRef.current;
      modal.play().catch(() => {});
    };

    if (modal.readyState >= 1) syncTime();
    else modal.addEventListener('loadedmetadata', syncTime, { once: true });

    return () => modal.removeEventListener('loadedmetadata', syncTime);
  }, [hasVideo, fullscreen]);

  useEffect(() => {
    if (!hasVideo) return;
    const card = videoRef.current;
    if (!card) return;

    if (fullscreen) {
      resumeTimeRef.current = card.currentTime;
      card.pause();
      return;
    }

    if (cardPlaybackActive) {
      if (resumeTimeRef.current > 0) {
        card.currentTime = resumeTimeRef.current;
      }
      card.play().catch(() => {});
    }
  }, [hasVideo, fullscreen, cardPlaybackActive]);

  useEffect(() => {
    if (!hasVideo || !fullscreen) return;
    const modal = modalVideoRef.current;
    if (modal) modal.muted = muted;
  }, [hasVideo, muted, fullscreen]);

  useEffect(() => {
    if (!isMobile && expanded) setExpanded(false);
  }, [isMobile, expanded]);

  const toggleExpanded = useCallback(() => {
    setExpanded((open) => !open);
  }, []);

  const toggleMute = useCallback(() => {
    if (!hasVideo) return;

    setMuted((prev) => {
      const next = !prev;
      const video = getActiveVideo();
      if (!video) return next;

      video.muted = next;
      if (!next && video.paused) {
        video.play().catch(() => {});
      }
      return next;
    });
  }, [getActiveVideo, hasVideo]);

  const closePopup = useCallback(() => {
    setExpanded(false);
  }, []);

  const openFullscreen = useCallback(() => {
    if (hasVideo) {
      const card = videoRef.current;
      if (card && Number.isFinite(card.currentTime)) {
        resumeTimeRef.current = card.currentTime;
      }
    }
    setFullscreen(true);
  }, [hasVideo]);

  const closeFullscreen = useCallback(() => {
    if (hasVideo) {
      const modal = modalVideoRef.current;
      if (modal && Number.isFinite(modal.currentTime)) {
        resumeTimeRef.current = modal.currentTime;
      }
    }
    setFullscreen(false);
  }, [hasVideo]);

  useEffect(() => {
    if (!fullscreen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeFullscreen();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('vcv-modal-open');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('vcv-modal-open');
    };
  }, [fullscreen, closeFullscreen]);

  if ((!hasVideo && !hasPoster) || dismissed || !loaderReady) return null;

  const mediaLabel = `${firstName} video CV`;

  const renderMuteButton = () => {
    if (!hasVideo) return null;

    return (
      <button
        type="button"
        className={`vcv-card__mute${muted ? ' vcv-card__mute--muted' : ''}`}
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        aria-pressed={!muted}
      >
        <MuteIcon muted={muted} />
      </button>
    );
  };

  const renderExpandButton = () => (
    <button
      type="button"
      className="vcv-card__expand"
      onClick={openFullscreen}
      aria-label={hasVideo ? 'Open video CV in fullscreen' : 'Open video CV preview in fullscreen'}
    >
      <ExpandIcon />
    </button>
  );

  const renderCardMedia = () => {
    if (hasVideo) {
      return (
        <video
          ref={videoRef}
          className="vcv-card__video"
          poster={poster || undefined}
          muted
          loop
          playsInline
          autoPlay
        />
      );
    }

    return (
      <img
        className="vcv-card__poster"
        src={poster}
        alt={mediaLabel}
        loading="lazy"
        decoding="async"
      />
    );
  };

  const renderModalMedia = () => {
    if (hasVideo) {
      return (
        <video
          ref={modalVideoRef}
          className="vcv-modal__video"
          poster={poster || undefined}
          muted
          loop
          playsInline
          autoPlay
        />
      );
    }

    return (
      <img
        className="vcv-modal__poster"
        src={poster}
        alt={mediaLabel}
        decoding="async"
      />
    );
  };

  const videoCard = (
    <div className={`vcv-card${isMobile ? ' vcv-card--popup' : ''}${hasVideo ? '' : ' vcv-card--poster-only'}`}>
      {isMobile ? (
        <button
          type="button"
          className="vcv-card__close"
          onClick={closePopup}
          aria-label="Close video CV"
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

      {renderExpandButton()}
      {renderMuteButton()}

      {renderCardMedia()}

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

  const fullscreenModal = fullscreen ? (
    <div
      className="vcv-modal"
      role="dialog"
      aria-modal="true"
      aria-label={mediaLabel}
    >
      <button
        type="button"
        className="vcv-modal__backdrop"
        onClick={closeFullscreen}
        aria-label="Close fullscreen preview"
      />

      <div className="vcv-modal__panel">
        <button
          type="button"
          className="vcv-modal__close"
          onClick={closeFullscreen}
          aria-label="Close fullscreen preview"
        >
          ✕
        </button>

        {renderMuteButton()}
        {renderModalMedia()}

        <div className="vcv-card__video-overlay" aria-hidden="true" />
        <div className="vcv-modal__identity">
          <p className="vcv-modal__name">{firstName}</p>
          <p className="vcv-modal__title">{title}</p>
        </div>

        <div className="vcv-modal__badge">
          <span className="vcv-card__badge-dot" />
          <span>Video CV</span>
        </div>
      </div>
    </div>
  ) : null;

  const widget = (
    <div
      className={`vcv-widget ${positionClass}${isMobile ? ' vcv-widget--mobile' : ''}${expanded ? ' vcv-widget--expanded' : ''}${fullscreen ? ' vcv-widget--behind-modal' : ''}`}
      style={{ '--vcv-accent': accentColor }}
      role="complementary"
      aria-label="GoodWork Video CV"
    >
      {isMobile ? (
        <div className="vcv-mobile-stack">
          {expanded ? (
            <div className="vcv-popup" id="vcv-mobile-popup" role="region" aria-label={mediaLabel}>
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
            {poster ? (
              <img className="vcv-trigger__poster" src={poster} alt="" />
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

  return createPortal(
    <>
      {widget}
      {fullscreenModal}
    </>,
    document.body,
  );
}

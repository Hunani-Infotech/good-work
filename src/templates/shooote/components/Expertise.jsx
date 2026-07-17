import { useRef } from 'react';
import { scrollToShoooteAnchor } from '../../../animations/shoooteAnimations.js';
import GwSection from '../../../components/shared/GwSection.jsx';
import { useContent } from '../../../hooks/shooote/useContent.js';
import { useVideoPlayback } from '../../../hooks/useVideoPlayback.js';
import ScrollTextReveal from './ScrollTextReveal.jsx';

function ShoooteExpertiseVideo({ video, authorName }) {
  const videoSrc = video?.src?.trim() || '';
  const posterSrc = video?.poster?.trim() || '';
  const hasVideo = Boolean(videoSrc);
  const hasPoster = Boolean(posterSrc);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useVideoPlayback(videoRef, hlsRef, videoSrc, hasVideo);

  if (!hasVideo && !hasPoster) return null;

  return (
    <figure className="shooote-expertise-editorial__media">
      <div className="gw-section__video shooote-expertise-editorial__video">
        <div className="shooote-expertise-editorial__video-frame">
          {hasVideo ? (
            <video
              ref={videoRef}
              className="shooote-expertise-editorial__video-el"
              poster={posterSrc || undefined}
              aria-label={authorName ? `${authorName} video CV` : 'Video CV'}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              className="shooote-expertise-editorial__video-el"
              src={posterSrc}
              alt={authorName ? `${authorName} portrait` : 'Portrait'}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </figure>
  );
}

export default function Expertise() {
  const { expertise } = useContent();
  const headingLines = expertise.headingLines?.length
    ? expertise.headingLines
    : (expertise.heading ? [expertise.heading] : []);
  const hasMedia = Boolean(expertise.video?.src?.trim() || expertise.video?.poster?.trim());

  const onConnectClick = (e) => {
    e.preventDefault();
    scrollToShoooteAnchor('#connect');
  };

  return (
    <GwSection
      theme="shooote"
      id="expertise"
      className="wpo-expertise-section"
      sectionLabel={expertise.sectionLabel}
    >
      <div className={`shooote-expertise-editorial__stage${hasMedia ? '' : ' shooote-expertise-editorial__stage--copy-only'}`}>
        {hasMedia ? (
          <ShoooteExpertiseVideo
            video={expertise.video}
            authorName={expertise.authorName}
          />
        ) : null}

        {hasMedia ? (
          <span className="shooote-expertise-editorial__divider" aria-hidden="true" />
        ) : null}

        <div className="shooote-expertise-editorial__copy">
          {headingLines.length ? (
            <h2 className="shooote-expertise-editorial__heading" aria-label={expertise.heading}>
              {headingLines.map((line) => (
                <ScrollTextReveal
                  key={line}
                  as="span"
                  className="shooote-expertise-editorial__heading-line"
                  text={line}
                />
              ))}
            </h2>
          ) : null}

          {expertise.statement ? (
            <ScrollTextReveal
              as="p"
              className="shooote-expertise-editorial__lead"
              text={expertise.statement}
            />
          ) : null}

          <div className="shooote-expertise-editorial__actions">
            <a href="#connect" className="theme-btn shooote-mailto-btn" onClick={onConnectClick}>
              <i className="icon">
                <img src="/assets/shooote/images/arrow-2.svg" alt="" />
              </i>
              <i className="link-text">
                <span>{expertise.ctaLabel}</span>
              </i>
            </a>
          </div>
        </div>
      </div>
    </GwSection>
  );
}

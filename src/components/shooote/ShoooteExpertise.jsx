import { useRef } from 'react';
import { scrollToShoooteAnchor } from '../../animations/shoooteAnimations.js';
import GwSection from '../shared/GwSection.jsx';
import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import { useVideoPlayback } from '../../hooks/useVideoPlayback.js';
import ShoooteScrollTextReveal from './ShoooteScrollTextReveal.jsx';

function ShoooteExpertiseVideo({ video, authorName, caption }) {
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
      {caption ? (
        <figcaption className="shooote-expertise-editorial__caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export default function ShoooteExpertise() {
  const { expertise } = useShoooteContent();
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
            caption={expertise.eyebrow}
          />
        ) : null}

        {hasMedia ? (
          <span className="shooote-expertise-editorial__divider" aria-hidden="true" />
        ) : null}

        <div className="shooote-expertise-editorial__copy">
          {expertise.eyebrow ? (
            <p className="shooote-expertise-editorial__eyebrow">
              <ShoooteScrollTextReveal text={expertise.eyebrow} />
            </p>
          ) : null}

          {headingLines.length ? (
            <h2 className="shooote-expertise-editorial__heading" aria-label={expertise.heading}>
              {headingLines.map((line) => (
                <ShoooteScrollTextReveal
                  key={line}
                  as="span"
                  className="shooote-expertise-editorial__heading-line"
                  text={line}
                />
              ))}
            </h2>
          ) : null}

          {expertise.statement ? (
            <ShoooteScrollTextReveal
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

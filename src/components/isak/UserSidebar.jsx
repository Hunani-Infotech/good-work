import { useState } from 'react';
import { ImageSwitch } from './ImageSwitch.jsx';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import { useIsakContent } from '../../hooks/isak/useIsakContent.js';
import { useSite } from '../../context/SiteContext.jsx';
import ProfileVideoMuteIcon from './ProfileVideoMuteIcon.jsx';
import { ProfileVideoLoop } from './ProfileVideoLoop.jsx';
import ShareButton from '../ui/ShareButton.jsx';

const AVATAR_FALLBACK =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop';

export function UserSidebar() {
  const { profile } = useIsakContent();
  const { site } = useSite();
  const videoCv = site?.home?.hero?.videoCv;
  const [muted, setMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  
  const mailto = profile.email
    ? `mailto:${profile.email}?subject=${encodeURIComponent(profile.mailtoSubject)}`
    : '#contact';

  return (
    <div className="sidebar-user">
      <div className="wrap">
        <div className="user-image">
          <div className="image">
            {videoCv?.src ? (
              <ProfileVideoLoop
                imageSrc={profile.sidebarPhoto || AVATAR_FALLBACK}
                videoSrc={videoCv.src}
                imageAlt={profile.fullName}
                muted={muted}
                onPlayingChange={setVideoPlaying}
              />
            ) : (
              <img
                width={468}
                height={856}
                src={profile.sidebarPhoto}
                alt={profile.fullName}
                onError={(e) => {
                  e.currentTarget.src = AVATAR_FALLBACK;
                }}
              />
            )}
          </div>

          <div className="meta-left d-none d-sm-block">
            <div className="bg-item-svg">
              <ImageSwitch
                light="/assets/isak/images/item/vector-user.svg"
                dark="/assets/isak/images/item/vector-user_dark.svg"
                width={32}
                height={227}
              />
            </div>
            <p className="avaiable-dot vertical text-body-3 text-black-72 fw-medium">
              <span className="text-vertical">Available for Work</span>
              <span className="dot" />
            </p>
          </div>
        </div>
        <div className="user-logo d-none d-lg-block isak-md-logo-badge">
          <GoodWorkWordmark animated surface="dark" className="isak-sidebar__logo" />
        </div>
        <ul className="tf-social-icon-2 user-social isak-sidebar-social">
          {profile.sidebarSocials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                {...(s.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              >
                <i className={`icon ${s.icon}`} />
              </a>
            </li>
          ))}
        </ul>
        <div className="user-info">
          <p className="avaiable-dot text-body-3 fw-medium d-sm-none">
            <span className="dot" />
            <span>Available for Work</span>
          </p>
          <h6 className="greeting letter-space--2 text-white animationtext clip">
            Hey, I&apos;m{' '}
            <span className="cd-words-wrapper">
              {profile.rotatingNames.map((name, i) => (
                <span
                  key={name}
                  className={`item-text ${i === 0 ? 'is-visible' : 'is-hidden'}`}
                >
                  {name}
                </span>
              ))}
            </span>
          </h6>
          <p className="introduce text-white-56 letter-space--05 text-body-3">
            {profile.introBio}
          </p>
          <div className="br-line" />
          <div className="action-group">
            <a href={mailto} className="tf-btn-action">
              <span className="ic-wrap">
                <i className="icon icon-arrow-right-top" />
              </span>
              <span className="text text-body-3 letter-space--05 fw-medium">
                {profile.ctaLabel || "Let's Connect"}
              </span>
              <span className="ic-wrap">
                <i className="icon icon-arrow-right-top" />
              </span>
            </a>
            
            <ShareButton className="tf-btn-action style-outline-share">
              {({ copied }) => (
                <>
                  <span className="ic-wrap">
                    <i className="icon icon-send" />
                  </span>
                  <span className="text text-body-3 letter-space--05 fw-medium">
                    {copied ? 'Copied!' : 'Share'}
                  </span>
                  <span className="ic-wrap">
                    <i className="icon icon-send" />
                  </span>
                </>
              )}
            </ShareButton>

            {videoCv?.src && videoPlaying ? (
              <button
                type="button"
                className="profile-video-mute"
                onClick={() => setMuted((value) => !value)}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
                aria-pressed={!muted}
              >
                <ProfileVideoMuteIcon muted={muted} />
              </button>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}

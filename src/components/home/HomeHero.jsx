import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { useSite } from '../../context/SiteContext';

function resolveLottiePath(src) {
  if (!src) return '/documents/goodwork-logo-style-01.json';
  if (src.startsWith('http')) return src;
  return src.startsWith('/') ? src : `/${src}`;
}

export default function HomeHero() {
  const { site } = useSite();
  const { hero } = site.home;
  const { assets } = site.site;
  const lottieRef = useRef(null);
  const animRef = useRef(null);
  const logoLottie = hero.lottie || assets.heroLottie || '/documents/goodwork-logo-style-01.json';
  const logoImage = assets.logoFullColour;

  useEffect(() => {
    if (logoImage || !lottieRef.current) return undefined;

    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: resolveLottiePath(logoLottie),
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
    });

    animRef.current = anim;
    return () => {
      anim.destroy();
      animRef.current = null;
    };
  }, [logoImage, logoLottie]);

  return (
    <div data-nav="peach" className="wrapper-hero hero-goodwork">
      <div className="img-hero-wrapper" aria-hidden="true">
        <div className="hero-fx">
          <div className="hero-fx-orb hero-fx-orb--1" />
          <div className="hero-fx-orb hero-fx-orb--2" />
          <div className="hero-fx-orb hero-fx-orb--3" />
          <div className="hero-fx-sweep" />
          <div className="hero-fx-grid" />
          <div className="hero-fx-grain" />
        </div>
      </div>
      <div className="w-layout-blockcontainer wrapper-hero-home w-container">
        <div className="conter-content-hero hero-content-3d">
          {hero.profilePhoto ? (
            <div className="hero-profile-photo">
              <img src={hero.profilePhoto} alt="" loading="eager" />
            </div>
          ) : null}

          <div className="hero-brand-block">
            {logoImage ? (
              <img src={logoImage} alt="Good Work" className="hero-brand-logo" />
            ) : (
              <div ref={lottieRef} className="hero-brand-lottie" aria-hidden="true" />
            )}
            <p className="hero-role">{hero.subtitle}</p>
          </div>

          <div className="hero-top">
            <h1 className="heading hero-heading">
              {hero.heading.split('\n').map((line, i, arr) => (
                <span key={line}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>

          {hero.heroStatement ? (
            <p className="body-copy hero-statement">{hero.heroStatement}</p>
          ) : null}

          {hero.videoCv?.src ? (
            <div className="hero-video-cv">
              <video autoPlay loop muted playsInline poster={hero.videoCv.poster || undefined}>
                <source src={hero.videoCv.src} type="video/mp4" />
              </video>
            </div>
          ) : null}
        </div>
        <div className="hero-scroll-cue" aria-hidden="true">
          <span className="hero-scroll-cue__line" />
          <span className="hero-scroll-cue__text">Scroll</span>
        </div>
      </div>
    </div>
  );
}

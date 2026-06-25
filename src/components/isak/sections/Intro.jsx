import { useIsakContent } from '../../../hooks/isak/useIsakContent.js';

export function Intro() {
  const { profile, intro } = useIsakContent();

  return (
    <div id="home" className="section-intro flat-spacing">
      <header className="isak-intro-luxury effectFade fadeUp no-div">
        <div className="isak-intro-luxury__masthead">
          <span className="isak-intro-luxury__spine" aria-hidden="true" />
          <div className="isak-intro-luxury__copy">
            {profile.duty ? (
              <p className="isak-intro-luxury__role">{profile.duty}</p>
            ) : null}
            <h2 className="isak-intro-luxury__name split-text effect-blur-fade">
              {profile.fullName}
            </h2>
          </div>
        </div>
        <div className="isak-intro-luxury__baseline" aria-hidden="true">
          <span className="isak-luxury__gem" />
          <span className="isak-intro-luxury__rule" />
        </div>
      </header>

      <h1 className="intro-title letter-space--2">
        {intro.headline}
      </h1>

      {profile.introBio ? (
        <p className="isak-intro-bio">{profile.introBio}</p>
      ) : null}

      <div className="intro-item">
        <div className="scribble-wrap">
          <svg
            className="scribble"
            viewBox="0 0 772 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="paint0_linear_268_462"
                x1="12"
                y1="107"
                x2="752"
                y2="66"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#F5F5F5" />
                <stop className="bred" offset="0.466346" stopColor="#00DE51" />
                <stop offset="1" stopColor="#F5F5F5" />
              </linearGradient>
            </defs>
            <path
              id="scribblePath"
              d="M12 104.315C34.6667 116.269 92.8 137.913 144 128.853C208 117.528 317 33.5324 356 27.8698C395 22.2072 502 20 530 79.1463C557.711 137.682 582 217 477 281.743C423.902 314.483 308 281.433 365 188C422 94.5672 544 65.6205 597 81.6645C650 97.7085 732 88.2708 752 64.6767"
              stroke="url(#paint0_linear_268_462)"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

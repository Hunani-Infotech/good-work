import { useIsakContent } from '../../../../hooks/isak/useIsakContent.js';
import { useIsakTheme } from '../IsakThemeProvider.jsx';
import ShaderBackground from '../../../../components/ui/ShaderBackground.jsx';

export function Intro() {
  const { profile, intro } = useIsakContent();
  const { resolvedTheme } = useIsakTheme();

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

      <h1 id="hero" className="intro-title letter-space--2">
        {intro.headline}
      </h1>

      {profile.introBio ? (
        <p className="isak-intro-bio">{profile.introBio}</p>
      ) : null}

      <div className="intro-item isak-intro-shader">
        <ShaderBackground
          className="isak-intro-shader__bg"
          fallbackClassName="isak-intro-shader__fallback"
          theme={resolvedTheme === 'light' ? 'light' : 'dark'}
          scrollTriggered
        />
      </div>
    </div>
  );
}

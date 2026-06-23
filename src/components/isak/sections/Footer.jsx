import { useIsakContent } from '../../../hooks/isak/useIsakContent.js';
import { useIsakTheme } from '../IsakThemeProvider.jsx';
import GoodWorkWordmark from '../../ui/GoodWorkWordmark.jsx';

export function Footer() {
  const { footer } = useIsakContent();
  const { resolvedTheme } = useIsakTheme();

  const mailto = footer.email
    ? `mailto:${footer.email}?subject=${encodeURIComponent(footer.mailtoSubject)}`
    : null;

  // Logo surface = background behind the pill, not page theme name
  const logoSurface = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div id="footer" className="tf-footer flat-spacing">
      <div className="br-line" />
      <div className="foot-inner">
        <a
          href={mailto ?? '#'}
          className={`f-logo effectFade fadeZoom isak-footer__logo-pill isak-footer__logo-pill--${resolvedTheme}`}
        >
          <div className="logo">
            <GoodWorkWordmark surface={logoSurface} className="isak-footer__logo" />
          </div>
        </a>
        <div className="foot-bottom">
          <p className="text-nocopy text-black-56 effectFade fadeUp no-div">
            {footer.email && (
              <>
                <a href={mailto} className="link text-black-72">
                  {footer.email}
                </a>
                <br />
              </>
            )}
            Powered by GoodWork
            <br />© {new Date().getFullYear()} {footer.name}
          </p>
        </div>
      </div>
    </div>
  );
}

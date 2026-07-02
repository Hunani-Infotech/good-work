import { useIsakContent } from '../../../hooks/isak/useIsakContent.js';
import { useIsakTheme } from '../IsakThemeProvider.jsx';
import GoodWorkWordmark from '../../ui/GoodWorkWordmark.jsx';
import SocialLinks from '../../shared/SocialLinks.jsx';

export function Footer() {
  const { footer, social } = useIsakContent();
  const { resolvedTheme } = useIsakTheme();

  const mailto = footer.email
    ? `mailto:${footer.email}?subject=${encodeURIComponent(footer.mailtoSubject)}`
    : null;

  const logoSurface = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div id="footer" className="tf-footer flat-spacing">
      <div className="br-line" />
      <div className="foot-inner isak-footer__inner">
        <div className="isak-footer__brand">
          <a
            href={mailto ?? '#'}
            className={`f-logo effectFade fadeZoom isak-footer__logo-pill isak-footer__logo-pill--${resolvedTheme}`}
          >
            <div className="logo">
              <GoodWorkWordmark surface={logoSurface} className="isak-footer__logo" />
            </div>
          </a>

          <SocialLinks
            links={social}
            className="isak-footer__social"
            linkClassName="isak-footer__social-link"
            iconSize={15}
          />
        </div>

        <div className="foot-bottom isak-footer__meta">
          <p className="text-nocopy text-black-56 effectFade fadeUp no-div isak-footer__copy">
            {footer.email ? (
              <>
                <a href={mailto} className="link text-black-72">
                  {footer.email}
                </a>
                <br />
              </>
            ) : null}
            Powered by GoodWork
            {footer.copyrightName ? (
              <>
                <br />© {new Date().getFullYear()} {footer.copyrightName}
              </>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}

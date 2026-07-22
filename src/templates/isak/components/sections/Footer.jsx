import { useContent } from '../../../../hooks/isak/useContent.js';
import GoodWorkWordmark from '../../../../components/ui/GoodWorkWordmark.jsx';
import SocialLinks from '../../../../components/shared/SocialLinks.jsx';
import { GOODWORK_APP_URL } from '../../../../utils/brandLogos.js';
import FooterLineLottie from '../FooterLineLottie.jsx';

export function Footer() {
  const { footer, social } = useContent();

  const mailto = footer.email
    ? `mailto:${footer.email}?subject=${encodeURIComponent(footer.mailtoSubject)}`
    : null;

  return (
    <footer id="footer" className="tf-footer isak-footer flat-spacing">
      <div className="foot-inner isak-footer__inner">
        <div className="isak-footer__main">
          <div className="gw-footer-walker-stack isak-footer__walker-stack">
            <FooterLineLottie />
            <a
              href={GOODWORK_APP_URL}
              className="f-logo effectFade fadeZoom isak-footer__logo-pill isak-md-logo-badge"
              aria-label="GoodWork — visit app"
            >
              <div className="logo">
                <GoodWorkWordmark animated className="isak-footer__logo" />
              </div>
            </a>
          </div>

          <div className="isak-footer__actions">
            <SocialLinks
              links={social}
              className="isak-footer__social"
              linkClassName="isak-footer__social-link"
              iconSize={15}
            />

            {footer.email ? (
              <div className="foot-bottom isak-footer__meta">
                <p className="text-nocopy text-black-56 effectFade fadeUp no-div isak-footer__copy">
                  <a href={mailto} className="link text-black-72">
                    {footer.email}
                  </a>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

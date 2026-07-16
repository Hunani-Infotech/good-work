import { useIsakContent } from '../../../../hooks/isak/useIsakContent.js';
import GoodWorkFooterBrand from '../../../../components/shared/GoodWorkFooterBrand.jsx';
import GoodWorkWordmark from '../../../../components/ui/GoodWorkWordmark.jsx';
import SocialLinks from '../../../../components/shared/SocialLinks.jsx';
import { GOODWORK_APP_URL } from '../../../../utils/brandLogos.js';

export function Footer() {
  const { footer, social } = useIsakContent();

  const mailto = footer.email
    ? `mailto:${footer.email}?subject=${encodeURIComponent(footer.mailtoSubject)}`
    : null;

  return (    <div id="footer" className="tf-footer flat-spacing">
      <div className="br-line" />
      <div className="foot-inner isak-footer__inner">
        <div className="isak-footer__brand">
          <a
            href={GOODWORK_APP_URL}
            className="f-logo effectFade fadeZoom isak-footer__logo-pill isak-md-logo-badge"
            aria-label="GoodWork — visit app"
          >
            <div className="logo">
              <GoodWorkWordmark animated className="isak-footer__logo" />
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
            <GoodWorkFooterBrand
              part="copy"
              copyrightName={footer.copyrightName}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

import GoodWorkWordmark from '../../../components/ui/GoodWorkWordmark.jsx';
import SocialLinks from '../../../components/shared/SocialLinks.jsx';
import { GOODWORK_APP_URL } from '../../../utils/brandLogos.js';
import { useContent } from '../../../hooks/shooote/useContent.js';
import FooterWalkerLottie from './FooterWalkerLottie.jsx';

export default function Footer() {
  const { social } = useContent();

  return (
    <footer className="wpo-site-footer shooote-site-footer">
      <div className="container shooote-site-footer__inner">
        <FooterWalkerLottie className="shooote-footer-walker" />

        <div className="shooote-site-footer__row">
          <a
            href={GOODWORK_APP_URL}
            className="shooote-site-footer__logo-link shooote-md-logo-badge"
            aria-label="GoodWork — visit app"
          >
            <GoodWorkWordmark animated className="shooote-site-footer__logo" />
          </a>

          <SocialLinks
            links={social}
            className="shooote-site-footer__social"
            linkClassName="shooote-site-footer__social-link"
            iconSize={16}
          />
        </div>
      </div>
    </footer>
  );
}

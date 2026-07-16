import { useContent } from '../../../hooks/shooote/useContent.js';
import GoodWorkFooterBrand from '../../../components/shared/GoodWorkFooterBrand.jsx';
import SocialLinks from '../../../components/shared/SocialLinks.jsx';

export default function Footer() {
  const { logoText, social } = useContent();

  return (
    <footer className="wpo-site-footer shooote-site-footer">
      <div className="container">
        <GoodWorkFooterBrand
          surface="dark"
          copyrightName={logoText}
          className="shooote-site-footer__brand"
          logoClassName="shooote-site-footer__logo"
          logoLinkClassName="shooote-md-logo-badge"
        />

        <SocialLinks
          links={social}
          className="shooote-site-footer__social"
          linkClassName="shooote-site-footer__social-link"
          iconSize={16}
        />
      </div>
    </footer>
  );
}

import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import GoodWorkFooterBrand from '../shared/GoodWorkFooterBrand.jsx';
import SocialLinks from '../shared/SocialLinks.jsx';

export default function ShoooteFooter() {
  const { logoText, social } = useShoooteContent();

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

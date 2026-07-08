import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import SocialLinks from '../shared/SocialLinks.jsx';
import { GOODWORK_APP_URL } from '../../utils/brandLogos.js';

export default function ShoooteFooter() {
  const { logoText, social } = useShoooteContent();

  return (
    <footer className="wpo-site-footer shooote-site-footer">
      <div className="container">
        <a href={GOODWORK_APP_URL} className="shooote-site-footer__logo-link">
          <GoodWorkWordmark surface="dark" className="shooote-site-footer__logo" />
        </a>

        <SocialLinks
          links={social}
          className="shooote-site-footer__social"
          linkClassName="shooote-site-footer__social-link"
          iconSize={16}
        />

        <p className="shooote-site-footer__copy">
          Powered by GoodWork
          <br />© {new Date().getFullYear()} {logoText}
        </p>
      </div>
    </footer>
  );
}

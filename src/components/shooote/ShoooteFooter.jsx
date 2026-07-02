import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';
import SocialLinks from '../shared/SocialLinks.jsx';

export default function ShoooteFooter() {
  const { logoText, social } = useShoooteContent();

  return (
    <footer className="wpo-site-footer shooote-site-footer">
      <div className="container">
        <GoodWorkWordmark surface="dark" className="shooote-site-footer__logo" />

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

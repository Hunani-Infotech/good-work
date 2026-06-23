import { useShoooteContent } from '../../hooks/shooote/useShoooteContent.js';
import GoodWorkWordmark from '../ui/GoodWorkWordmark.jsx';

export default function ShoooteFooter() {
  const { logoText } = useShoooteContent();

  return (
    <footer className="wpo-site-footer shooote-site-footer">
      <div className="container">
        <GoodWorkWordmark surface="dark" className="shooote-site-footer__logo" />
        <p className="shooote-site-footer__copy">
          Powered by GoodWork
          <br />© {new Date().getFullYear()} {logoText}
        </p>
      </div>
    </footer>
  );
}

import { useEffect } from 'react';
import '../styles/agency.css';
import { useAgencyAnimations } from '../hooks/useScrollPageAnimations';
import Nav from '../templates/agency/components/Nav';
import Hero from '../templates/agency/components/Hero';
import Ticker from '../templates/agency/components/Ticker';
import HowItWorks from '../templates/agency/components/HowItWorks';
import TemplateShowcase from '../templates/agency/components/TemplateShowcase';
import Features from '../templates/agency/components/Features';
import Cta from '../templates/agency/components/Cta';
import CustomCursor from '../components/ui/CustomCursor';
import GoodWorkWordmark from '../components/ui/GoodWorkWordmark.jsx';

export default function AgencyHomePage() {
  useAgencyAnimations();

  useEffect(() => {
    document.title = 'Good Work CV — Build your career story';
    document.body.className = 'body agency-page';
  }, []);

  return (
    <>
      <CustomCursor variant="agency" />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <TemplateShowcase />
        <Features />
        <Cta />
        <footer className="agency-footer agency-footer--editorial">
          <div className="agency-footer__inner">
            <div className="agency-footer__brand">
              <a href="/" className="agency-footer__logo">
                <GoodWorkWordmark surface="light" className="agency-footer__logo-img" />
              </a>
              <p className="agency-footer__tagline">
                Build your career story in minutes.
              </p>
            </div>

            <span className="agency-footer__copy">© 2025 Good Work. All rights reserved.</span>

            <nav className="agency-footer__links" aria-label="Footer">
              <a href="#templates">Browse templates</a>
              <a href="mailto:hello@goodwork.asia">Contact</a>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}

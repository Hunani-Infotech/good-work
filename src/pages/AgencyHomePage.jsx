import { useEffect } from 'react';
import '../styles/agency.css';
import { useAgencyAnimations } from '../hooks/useAgencyAnimations';
import AgencyNav from '../components/agency/AgencyNav';
import AgencyHero from '../components/agency/AgencyHero';
import AgencyTicker from '../components/agency/AgencyTicker';
import HowItWorks from '../components/agency/HowItWorks';
import TemplateShowcase from '../components/agency/TemplateShowcase';
import AgencyFeatures from '../components/agency/AgencyFeatures';
import AgencyCta from '../components/agency/AgencyCta';
import CustomCursor from '../components/ui/CustomCursor';

export default function AgencyHomePage() {
  useAgencyAnimations();

  useEffect(() => {
    document.title = 'Good Work CV — Build your career story';
    document.body.className = 'body agency-page';
  }, []);

  return (
    <>
      <CustomCursor />
      <AgencyNav />
      <main>
        <AgencyHero />
        <AgencyTicker />
        <HowItWorks />
        <TemplateShowcase />
        <AgencyFeatures />
        <AgencyCta />
        <footer className="agency-footer agency-footer--editorial">
          <div className="agency-footer__inner">
            <div className="agency-footer__brand">
              <a href="/" className="agency-footer__logo">
                <img
                  src="/images/goodwork/logo-black.svg"
                  alt="Good Work"
                  className="agency-footer__logo-img"
                  decoding="async"
                />
              </a>
              <p className="agency-footer__tagline">
                Build your career story in minutes.
              </p>
            </div>

            <span className="agency-footer__copy">© 2025 Good Work. All rights reserved.</span>

            <nav className="agency-footer__links" aria-label="Footer">
              <a href="/cv/sanjay">View Template</a>
              <a href="mailto:hello@goodwork.asia">Contact</a>
            </nav>
          </div>
        </footer>
      </main>
    </>
  );
}

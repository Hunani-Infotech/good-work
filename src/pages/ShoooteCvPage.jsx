import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../templates/shooote/components/Layout.jsx';
import Hero from '../templates/shooote/components/Hero.jsx';
import Expertise from '../templates/shooote/components/Expertise.jsx';
import Narrative from '../templates/shooote/components/Narrative.jsx';
import Capabilities from '../templates/shooote/components/Capabilities.jsx';
import CtaSection from '../templates/shooote/components/CtaSection.jsx';
import Footer from '../templates/shooote/components/Footer.jsx';
import { useShoooteAnimations } from '../hooks/shooote/usePageAnimations.js';
import { scrollToShoooteAnchor } from '../animations/shoooteAnimations.js';
import { useContent } from '../hooks/shooote/useContent.js';
import '../styles/shooote.css';

export default function ShoooteCvPage() {
  const location = useLocation();
  const { siteMeta, theme } = useContent();
  useShoooteAnimations();

  useLayoutEffect(() => {
    document.documentElement.classList.add('shooote-template');
    document.body.classList.add('shooote-template');

    const root = document.documentElement;
    if (theme?.accent) root.style.setProperty('--shooote-accent', theme.accent);
    if (theme?.cream) root.style.setProperty('--shooote-cream', theme.cream);
    if (theme?.ink) root.style.setProperty('--shooote-ink', theme.ink);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/shooote/vendor.css';
    document.head.insertBefore(link, document.head.firstChild);

    return () => {
      document.documentElement.classList.remove('shooote-template');
      document.body.classList.remove('shooote-template');
      root.style.removeProperty('--shooote-accent');
      root.style.removeProperty('--shooote-cream');
      root.style.removeProperty('--shooote-ink');
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [theme?.accent, theme?.cream, theme?.ink]);

  useEffect(() => {
    document.title = siteMeta.title;
  }, [siteMeta.title]);

  useEffect(() => {
    if (location.hash) {
      const timer = window.setTimeout(() => {
        scrollToShoooteAnchor(location.hash);
      }, 900);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [location.hash]);

  return (
    <Layout>
      <div className="cv-page-screens">
        <Hero />
        <Expertise />
        <Narrative />
        <Capabilities />
      </div>
      <CtaSection />
      <Footer />
    </Layout>
  );
}


import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ShoooteLayout from '../templates/shooote/components/ShoooteLayout.jsx';
import ShoooteHero from '../templates/shooote/components/ShoooteHero.jsx';
import ShoooteExpertise from '../templates/shooote/components/ShoooteExpertise.jsx';
import ShoooteNarrative from '../templates/shooote/components/ShoooteNarrative.jsx';
import ShoooteCapabilities from '../templates/shooote/components/ShoooteCapabilities.jsx';
import ShoooteCtaSection from '../templates/shooote/components/ShoooteCtaSection.jsx';
import ShoooteFooter from '../templates/shooote/components/ShoooteFooter.jsx';
import { useShoooteAnimations } from '../hooks/shooote/useShoootePageAnimations.js';
import { scrollToShoooteAnchor } from '../animations/shoooteAnimations.js';
import { useShoooteContent } from '../hooks/shooote/useShoooteContent.js';
import '../styles/shooote.css';

export default function ShoooteCvPage() {
  const location = useLocation();
  const { siteMeta, theme } = useShoooteContent();
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
    <ShoooteLayout>
      <div className="cv-page-screens">
        <ShoooteHero />
        <ShoooteExpertise />
        <ShoooteNarrative />
        <ShoooteCapabilities />
      </div>
      <ShoooteCtaSection />
      <ShoooteFooter />
    </ShoooteLayout>
  );
}


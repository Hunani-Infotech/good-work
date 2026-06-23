import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ShoooteLayout from '../components/shooote/ShoooteLayout.jsx';
import ShoooteHero from '../components/shooote/ShoooteHero.jsx';
import ShoooteExpertise from '../components/shooote/ShoooteExpertise.jsx';
import ShoooteNarrative from '../components/shooote/ShoooteNarrative.jsx';
import ShoooteCapabilities from '../components/shooote/ShoooteCapabilities.jsx';
import ShoooteFooter from '../components/shooote/ShoooteFooter.jsx';
import { useShoooteAnimations } from '../hooks/shooote/useShoootePageAnimations.js';
import { scrollToShoooteAnchor } from '../animations/shoooteAnimations.js';
import { useShoooteContent } from '../hooks/shooote/useShoooteContent.js';

export default function ShoooteCvPage() {
  const location = useLocation();
  const { siteMeta } = useShoooteContent();
  useShoooteAnimations();

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
      <ShoooteHero />
      <ShoooteExpertise />
      <ShoooteNarrative />
      <ShoooteCapabilities />
      <ShoooteFooter />
    </ShoooteLayout>
  );
}


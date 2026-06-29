import { useEffect, useLayoutEffect } from 'react';
import '../styles/meridian-tailwind.css';
import '../styles/video-cv-widget.css';

import { useMeridianContent } from '../hooks/meridian/useMeridianContent.js';
import { useMeridianPageAnimations } from '../hooks/meridian/useMeridianPageAnimations.js';

import VideoCvWidget from '../components/ui/VideoCvWidget.jsx';
import MeridianHeader from '../meridian/components/layout/MeridianHeader.jsx';
import MeridianHeroSection from '../meridian/components/hero/MeridianHeroSection.jsx';
import MeridianManifestoSection from '../meridian/components/manifesto/MeridianManifestoSection.jsx';
import MeridianAboutSection from '../meridian/components/about/MeridianAboutSection.jsx';
import MeridianCapabilitiesSection from '../meridian/components/capabilities/MeridianCapabilitiesSection.jsx';
import MeridianContactSection from '../meridian/components/contact/MeridianContactSection.jsx';

export default function MeridianCvPage() {
  const { siteMeta, theme } = useMeridianContent();
  useMeridianPageAnimations();

  useLayoutEffect(() => {
    document.documentElement.classList.add('meridian-template');
    document.body.classList.add('meridian-template');
    document.documentElement.style.setProperty('--meridian-accent', theme.accent);

    return () => {
      document.documentElement.classList.remove('meridian-template');
      document.body.classList.remove('meridian-template');
      document.documentElement.style.removeProperty('--meridian-accent');
    };
  }, [theme.accent]);

  useEffect(() => {
    document.title = siteMeta.title;
  }, [siteMeta.title]);

  return (
    <>
      <MeridianHeader />
      <main className="meridian-cv-main">
        <MeridianHeroSection />
        <MeridianManifestoSection />
        <MeridianAboutSection />
        <MeridianCapabilitiesSection />
        <MeridianContactSection />
      </main>
      <VideoCvWidget accentColor={theme.brand} position="bottom-right" />
    </>
  );
}

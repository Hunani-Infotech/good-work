import { useEffect } from 'react';
import '../styles/meridian-tailwind.css';

import CustomCursor from '../components/ui/CustomCursor.jsx';
import { useMeridianContent } from '../hooks/meridian/useMeridianContent.js';
import { useMeridianPageAnimations } from '../hooks/meridian/useMeridianPageAnimations.js';
import { MeridianColorThemeProvider } from '../templates/meridian/context/MeridianColorThemeContext.jsx';

import MeridianHeader from '../templates/meridian/components/layout/MeridianHeader.jsx';
import MeridianHeroSection from '../templates/meridian/components/hero/MeridianHeroSection.jsx';
import MeridianManifestoSection from '../templates/meridian/components/manifesto/MeridianManifestoSection.jsx';
import MeridianAboutSection from '../templates/meridian/components/about/MeridianAboutSection.jsx';
import MeridianCapabilitiesSection from '../templates/meridian/components/capabilities/MeridianCapabilitiesSection.jsx';
import MeridianContactSection from '../templates/meridian/components/contact/MeridianContactSection.jsx';

function MeridianCvPageContent() {
  const { siteMeta } = useMeridianContent();
  useMeridianPageAnimations();

  useEffect(() => {
    document.title = siteMeta.title;
  }, [siteMeta.title]);

  return (
    <>
      <CustomCursor variant="meridian" />
      <div className="meridian-page-atmosphere" aria-hidden="true">
        <div className="meridian-page-orb meridian-page-orb--1" />
        <div className="meridian-page-orb meridian-page-orb--2" />
        <div className="meridian-page-orb meridian-page-orb--3" />
      </div>
      <MeridianHeader />
      <main className="meridian-cv-main">
        <MeridianHeroSection />
        <MeridianManifestoSection />
        <MeridianAboutSection />
        <MeridianCapabilitiesSection />
        <MeridianContactSection />
      </main>
    </>
  );
}

export default function MeridianCvPage() {
  return (
    <MeridianColorThemeProvider>
      <MeridianCvPageContent />
    </MeridianColorThemeProvider>
  );
}

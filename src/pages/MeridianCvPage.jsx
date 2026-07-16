import { useEffect } from 'react';
import '../styles/meridian-tailwind.css';

import CustomCursor from '../components/ui/CustomCursor.jsx';
import { useContent } from '../hooks/meridian/useContent.js';
import { usePageAnimations } from '../hooks/meridian/usePageAnimations.js';
import { MeridianColorThemeProvider } from '../templates/meridian/context/ColorThemeContext.jsx';

import Header from '../templates/meridian/components/layout/Header.jsx';
import HeroSection from '../templates/meridian/components/hero/HeroSection.jsx';
import ManifestoSection from '../templates/meridian/components/manifesto/ManifestoSection.jsx';
import AboutSection from '../templates/meridian/components/about/AboutSection.jsx';
import CapabilitiesSection from '../templates/meridian/components/capabilities/CapabilitiesSection.jsx';
import ContactSection from '../templates/meridian/components/contact/ContactSection.jsx';

function MeridianCvPageContent() {
  const { siteMeta } = useContent();
  usePageAnimations();

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
      <Header />
      <main className="meridian-cv-main">
        <HeroSection />
        <ManifestoSection />
        <AboutSection />
        <CapabilitiesSection />
        <ContactSection />
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

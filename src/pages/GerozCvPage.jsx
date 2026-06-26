import { useEffect, useLayoutEffect } from 'react';
import '../styles/geroz-tailwind.css';
import '../styles/video-cv-widget.css';

import { applyGerozImageCssVars, clearGerozImageCssVars } from '../data/geroz/constants.js';
import { useGerozContent } from '../hooks/geroz/useGerozContent.js';
import { useGerozPageAnimations } from '../hooks/geroz/useGerozPageAnimations.js';

import VideoCvWidget from '../components/ui/VideoCvWidget.jsx';
import CustomCursor from '../components/ui/CustomCursor.jsx';
import GerozCvHeader from '../components/geroz/GerozCvHeader.jsx';
import GerozCvFooter from '../components/geroz/GerozCvFooter.jsx';
import GerozBackToTop from '../geroz/components/utils/BackToTopBtn.jsx';
import HeroSection4 from '../geroz/components/hero/HeroSection4.jsx';
import AboutSection4 from '../geroz/components/about/AboutSection4.jsx';
import VideoSection from '../geroz/components/video/VideoSection.jsx';
import CapabilitiesSection from '../geroz/components/capabilities/CapabilitiesSection.jsx';

export default function GerozCvPage() {
  const { siteMeta, images, theme } = useGerozContent();
  useGerozPageAnimations();

  useLayoutEffect(() => {
    document.documentElement.classList.add('geroz-template');
    document.body.classList.add('geroz-template');
    applyGerozImageCssVars(images);

    return () => {
      document.documentElement.classList.remove('geroz-template');
      document.body.classList.remove('geroz-template');
      clearGerozImageCssVars();
    };
  }, [images]);

  useEffect(() => {
    document.title = siteMeta.title;
  }, [siteMeta.title]);

  return (
    <>
      <CustomCursor />
      <GerozCvHeader />
      <GerozBackToTop />
      <main className="overflow-hidden geroz-cv-main">
        <HeroSection4 />
        <VideoSection />
        <AboutSection4 />
        <CapabilitiesSection />
        <GerozCvFooter />
      </main>
      <VideoCvWidget accentColor={theme.accent} position="bottom-right" />
    </>
  );
}

import { useEffect } from 'react';
import TopBar from './TopBar.jsx';
import SharePreviewBanner from '../../../components/ui/SharePreviewBanner.jsx';
import CustomCursor from '../../../components/ui/CustomCursor.jsx';
import { useSite } from '../../../context/SiteContext.jsx';
import { resetDocumentScrollState } from '../../../animations/scrollRuntime.js';

export default function Layout({ children }) {
  const { site } = useSite();
  const theme = site.site.theme || {};

  useEffect(() => {
    document.body.className = 'body tidal-copper-template';
    resetDocumentScrollState({ keepSiteReady: true });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme.purple) root.style.setProperty('--brand-purple', theme.purple);
    if (theme.orange) root.style.setProperty('--brand-orange', theme.orange);
    if (theme.bgWarm) root.style.setProperty('--brand-bg-warm', theme.bgWarm);
    if (theme.grey) root.style.setProperty('--brand-grey', theme.grey);
    if (site.site.meta?.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = site.site.meta.favicon;
    }
  }, [theme, site.site.meta?.favicon]);

  return (
    <>
      <CustomCursor variant="tidal-copper" />
      <SharePreviewBanner />
      <TopBar />
      {children}
    </>
  );
}

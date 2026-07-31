import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToShooote } from '../../data/shooote/mapSiteToShooote.js';
import { withTemplateDemoPerson } from '../../utils/withTemplateDemoPerson.js';

export function useContent() {
  const { site, isPreviewMode } = useSite();
  return useMemo(() => {
    const demoSite = isPreviewMode ? site : withTemplateDemoPerson(site, 'shooote');
    return mapSiteToShooote(demoSite);
  }, [site, isPreviewMode]);
}

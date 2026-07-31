import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToGeroz } from '../../data/geroz/mapSiteToGeroz.js';
import { withTemplateDemoPerson } from '../../utils/withTemplateDemoPerson.js';

export function useContent() {
  const { site, isPreviewMode } = useSite();
  return useMemo(() => {
    const demoSite = isPreviewMode ? site : withTemplateDemoPerson(site, 'geroz');
    return mapSiteToGeroz(demoSite);
  }, [site, isPreviewMode]);
}

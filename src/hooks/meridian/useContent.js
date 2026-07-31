import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToMeridian } from '../../data/meridian/mapSiteToMeridian.js';
import { withTemplateDemoPerson } from '../../utils/withTemplateDemoPerson.js';

export function useContent() {
  const { site, isPreviewMode } = useSite();
  return useMemo(() => {
    const demoSite = isPreviewMode ? site : withTemplateDemoPerson(site, 'meridian');
    return mapSiteToMeridian(demoSite);
  }, [site, isPreviewMode]);
}

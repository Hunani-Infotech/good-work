import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToMeridian } from '../../data/meridian/mapSiteToMeridian.js';

export function useMeridianContent() {
  const { site } = useSite();
  return useMemo(() => mapSiteToMeridian(site), [site]);
}

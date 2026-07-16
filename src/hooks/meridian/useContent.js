import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToMeridian } from '../../data/meridian/mapSiteToMeridian.js';

export function useContent() {
  const { site } = useSite();
  return useMemo(() => mapSiteToMeridian(site), [site]);
}

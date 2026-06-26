import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToGeroz } from '../../data/geroz/mapSiteToGeroz.js';

export function useGerozContent() {
  const { site } = useSite();
  return useMemo(() => mapSiteToGeroz(site), [site]);
}

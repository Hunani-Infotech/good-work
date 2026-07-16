import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToIsak } from '../../utils/mapSiteToIsak.js';

export function useContent() {
  const { site } = useSite();
  return useMemo(() => mapSiteToIsak(site), [site]);
}

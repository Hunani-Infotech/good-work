import { useMemo } from 'react';
import { useSite } from '../../context/SiteContext.jsx';
import { mapSiteToShooote } from '../../data/shooote/mapSiteToShooote.js';

export function useContent() {
  const { site } = useSite();
  return useMemo(() => mapSiteToShooote(site), [site]);
}

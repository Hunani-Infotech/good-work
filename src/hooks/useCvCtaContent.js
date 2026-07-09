import { useMemo } from 'react';
import { useSite } from '../context/SiteContext.jsx';
import { mapSiteToCvCta } from '../utils/mapSiteToCvCta.js';

export function useCvCtaContent() {
  const { site } = useSite();
  return useMemo(() => mapSiteToCvCta(site), [site]);
}

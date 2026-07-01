const SOCIAL_PLATFORMS = [
  { id: 'linkedin', label: 'LinkedIn' },
];

/**
 * Turns { linkedin: 'https://…', facebook: '' } into the platforms that
 * actually have a URL set, so callers only ever render icons with a link.
 */
export function buildSocialLinks(socialLinks) {
  if (!socialLinks) return [];

  return SOCIAL_PLATFORMS
    .map(({ id, label }) => ({ id, label, href: socialLinks[id]?.trim() ?? '' }))
    .filter((link) => link.href);
}

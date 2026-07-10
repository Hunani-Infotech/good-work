/**
 * Shared CTA section content for all CV templates except Meridian.
 * Uses home.cta only — never hero, narrative, or capabilities copy.
 */
function splitCvCtaHeadingLines(heading) {
  const trimmed = (heading || '').trim();
  if (!trimmed) return [];

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return words;

  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

export function mapSiteToCvCta(siteData) {
  const { brand, contact } = siteData?.site ?? {};
  const cta = siteData?.home?.cta ?? {};
  const firstName = brand?.firstName ?? 'Portfolio';
  const mailtoSubject = contact?.mailtoSubjectNav ?? `Hey ${firstName}!`;
  const email = contact?.email ?? '';
  const mailto = email
    ? `mailto:${email}?subject=${encodeURIComponent(mailtoSubject)}`
    : '';

  const heading = cta.heading ?? "Let's work together.";

  return {
    tag: cta.tag ?? 'Connect',
    eyebrow: cta.eyebrow ?? 'Open for conversation',
    heading,
    headingLines: splitCvCtaHeadingLines(heading),
    statement: cta.statement ?? '',
    ctaLabel: cta.ctaLabel ?? "Let's Connect",
    actionKicker: cta.actionKicker ?? '',
    email,
    mailto,
  };
}

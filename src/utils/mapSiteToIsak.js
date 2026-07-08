import { buildSocialLinks } from './socialLinks.js';

const A = '/assets/isak/images';

const EDU_ICONS = [
  { light: `${A}/logo/logo-3.svg`, dark: `${A}/logo/logo-4.svg`, width: 32, height: 32 },
  { light: `${A}/item/edu-2.svg`, dark: `${A}/item/edu-2_dark.svg`, width: 29, height: 32 },
  { light: `${A}/item/edu-3.svg`, dark: `${A}/item/edu-3_dark.svg`, width: 120, height: 32 },
];

function parseExperienceYears(...texts) {
  const joined = texts.filter(Boolean).join(' ');
  const match = joined.match(/(\d+(?:\.\d+)?)\+?\s*years?/i);
  return match ? Math.ceil(parseFloat(match[1])) : null;
}

function bulletTitle(bullet, max = 56) {
  const first = bullet.split(/[.!?]/)[0].trim();
  if (first.length <= max) return first;
  return `${first.slice(0, max - 1).trim()}…`;
}

function buildIsakSidebarSocials(contact) {
  const items = [];

  buildSocialLinks(contact?.socialLinks).forEach((link) => {
    items.push({
      icon: 'icon-linkin',
      href: link.href,
      label: link.label,
      external: true,
    });
  });

  if (contact?.email) {
    items.push({
      icon: 'icon-send',
      href: `mailto:${contact.email}`,
      label: 'Email',
      external: false,
    });
  }

  return items;
}

function buildIntroHeadline(heading) {
  if (!heading) {
    return { lead: '', highlightA: '', highlightB: '', tail: '', plain: true };
  }
  // Always render as a single-color field — no span-based colour splits.
  return { lead: heading, highlightA: '', highlightB: '', tail: '', plain: true };
}

function buildCapabilitiesTimeline(bullets) {
  return bullets.map((description, index) => ({
    period: String(index + 1).padStart(2, '0'),
    role: bulletTitle(description, 72),
    description,
    icon: EDU_ICONS[index % EDU_ICONS.length],
  }));
}

export function mapSiteToIsak(siteData) {
  const meta = siteData?.site ?? {};
  const home = siteData?.home ?? {};
  const hero = home.hero ?? {};
  const narrative = home.narrative ?? {};
  const capabilities = home.capabilities ?? {};

  const firstName = meta.brand?.firstName ?? 'Portfolio';
  const subtitle = hero.subtitle ?? '';
  const paragraphs = narrative.paragraphs ?? [];
  const bullets = capabilities.bullets ?? [];
  const experienceYears =
    parseExperienceYears(...paragraphs, hero.heroStatement, hero.heading) ?? Math.max(bullets.length, 3);

  return {
    profile: {
      fullName: firstName,
      shortName: firstName,
      duty: subtitle,
      introBio: hero.heroStatement ?? '',
      email: meta.contact?.email ?? '',
      mailtoSubject: meta.contact?.mailtoSubjectNav ?? `Hey ${firstName}!`,
      rotatingNames: [firstName, subtitle],
      profilePhoto: hero.profilePhoto ?? '/assets/isak/images/avatar/avatar-boy.png',
      sidebarPhoto: hero.profilePhoto ?? '/assets/isak/images/avatar/avatar.png',
      ctaLabel: hero.ctaLabel ?? "Let's Connect",
      sidebarSocials: buildIsakSidebarSocials(meta.contact),
    },
    social: buildSocialLinks(meta.contact?.socialLinks),
    meta: {
      title: meta.meta?.homeTitle ?? `${firstName} | Portfolio`,
      description: meta.meta?.description ?? '',
      favicon: meta.meta?.favicon ?? '/favicon-gw.png',
    },
    intro: {
      ...buildIntroHeadline(hero.heading ?? ''),
      headline: hero.heading ?? '',
      ctaLabel: hero.ctaLabel ?? "Let's Connect",
      experienceYears,
      awardsCount: bullets.length || 3,
    },
    about: {
      tag: narrative.tag ?? 'Narrative',
      title: hero.heading ?? narrative.paragraphs?.[0] ?? '',
      paragraphs,
    },
    education: buildCapabilitiesTimeline(bullets),
    footer: {
      // quote: hero.heroStatement ?? meta.meta?.description ?? '',
      copyrightName: firstName,
      // subtitle,
      email: meta.contact?.email ?? '',
      mailtoSubject: meta.contact?.mailtoSubjectNav ?? `Hey ${firstName}!`,
      // description: meta.meta?.description ?? '',
    },
    capabilities: {
      tag: capabilities.tag ?? 'Skills',
    },
  };
}

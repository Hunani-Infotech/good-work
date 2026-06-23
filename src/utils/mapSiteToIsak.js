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

function buildIntroHeadline(heading) {
  if (!heading) {
    return { lead: '', highlightA: '', highlightB: '', tail: '', plain: true };
  }

  const withIdx = heading.indexOf(' with ');
  if (withIdx === -1) {
    return { lead: heading, highlightA: '', highlightB: '', tail: '', plain: true };
  }

  const leadPart = heading.slice(0, withIdx).trim();
  const rest = heading.slice(withIdx + 6).trim();
  const leadWords = leadPart.split(/\s+/);
  const restWords = rest.split(/\s+/);

  if (leadWords.length < 3 || restWords.length < 2) {
    return { lead: heading, highlightA: '', highlightB: '', tail: '', plain: true };
  }

  const highlightA = leadWords.slice(-2).join(' ');
  const lead = leadWords.slice(0, -2).join(' ');
  const highlightB = restWords.slice(0, 2).join(' ');
  const tail = restWords.slice(2).join(' ');

  return { lead, highlightA, highlightB, tail, plain: false };
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
      ctaLabel: hero.ctaLabel ?? "Let's talk",
      socials: meta.contact?.email
        ? [{ icon: 'icon-send', href: `mailto:${meta.contact.email}`, label: 'Email' }]
        : [],
    },
    meta: {
      title: meta.meta?.homeTitle ?? `${firstName} | Portfolio`,
      description: meta.meta?.description ?? '',
      favicon: meta.meta?.favicon ?? '/favicon-gw.png',
    },
    intro: {
      ...buildIntroHeadline(hero.heading ?? ''),
      headline: hero.heading ?? '',
      ctaLabel: hero.ctaLabel ?? "Let's talk",
      experienceYears,
      awardsCount: bullets.length || 3,
    },
    about: {
      tag: narrative.tag ?? 'About',
      title: hero.heading ?? narrative.paragraphs?.[0] ?? '',
      paragraphs,
    },
    education: buildCapabilitiesTimeline(bullets),
    footer: {
      // quote: hero.heroStatement ?? meta.meta?.description ?? '',
      // name: firstName,
      // subtitle,
      email: meta.contact?.email ?? '',
      mailtoSubject: meta.contact?.mailtoSubjectNav ?? `Hey ${firstName}!`,
      // description: meta.meta?.description ?? '',
    },
    capabilities: {
      tag: capabilities.tag ?? 'Capabilities & Skills',
    },
  };
}

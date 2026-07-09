import { buildSocialLinks } from '../../utils/socialLinks.js';

function buildMailto(email, subject) {
  if (!email) return '#contact';
  return `mailto:${email}?subject=${encodeURIComponent(subject ?? '')}`;
}

function isPlaceholderLastName(lastName) {
  const trimmed = (lastName ?? '').trim();
  return !trimmed || /^last\s*name$/i.test(trimmed);
}

/** Hero marquee layouts: stacked surname, inline name—title, or first-name only. */
function heroNameLines(firstName, lastName, subtitle) {
  const hasLastName = !isPlaceholderLastName(lastName);
  const effectiveLastName = hasLastName ? lastName.trim() : '';
  const trimmedSubtitle = subtitle?.trim() ?? '';
  const displayName = hasLastName
    ? `${firstName} ${effectiveLastName}`.trim()
    : firstName;

  let marqueeLayout = 'inline-only';
  let nameLine2 = null;
  let marqueeText = `${firstName} `;

  if (hasLastName) {
    marqueeLayout = 'stacked-name';
    nameLine2 = effectiveLastName;
    marqueeText = `${displayName} — `;
  } else if (trimmedSubtitle) {
    marqueeLayout = 'inline-paired';
    nameLine2 = trimmedSubtitle;
    marqueeText = `${firstName} — ${trimmedSubtitle} | `;
  }

  return {
    hasLastName,
    marqueeLayout,
    effectiveLastName,
    displayName,
    nameLine1: firstName,
    nameLine2,
    marqueeText,
  };
}

/**
 * Meridian template — Dennis Snellenberg portfolio layout from site.json.
 */
export function mapSiteToMeridian(site) {
  const { brand, meta, contact, theme } = site?.site ?? {};
  const { hero, narrative, capabilities } = site?.home ?? {};

  const firstName = brand?.firstName ?? 'Portfolio';
  const lastName = brand?.lastName ?? '';
  const subtitle = hero?.subtitle ?? '';
  const nameLines = heroNameLines(firstName, lastName, subtitle);
  const {
    hasLastName,
    marqueeLayout,
    effectiveLastName,
    displayName,
    nameLine1,
    nameLine2,
    marqueeText,
  } = nameLines;
  const mailtoSubject = contact?.mailtoSubjectNav ?? `Hey ${firstName}!`;
  const mailto = buildMailto(contact?.email, mailtoSubject);
  const ctaLabel = hero?.ctaLabel ?? "Let's Connect";
  const bullets = capabilities?.bullets ?? [];
  const paragraphs = narrative?.paragraphs ?? [];

  const rotatingLines = [
    hasLastName && displayName !== firstName ? displayName : null,
    firstName,
  ]
    .filter(Boolean)
    .filter((line, index, all) => all.indexOf(line) === index);

  const roleLines = (() => {
    if (!subtitle) return ['Portfolio'];
    const words = subtitle.split(/\s+/);
    if (words.length <= 2) return [subtitle];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  })();

  return {
    siteMeta: {
      title: meta?.homeTitle ?? `${displayName} — GoodWork`,
      description: meta?.description ?? hero?.heading ?? '',
    },
    theme: {
      accent: '#455ce9',
      brand: theme?.orange ?? '#f25828',
    },
    hero: {
      firstName,
      lastName: effectiveLastName,
      hasLastName,
      marqueeLayout,
      fullName: displayName,
      nameLine1,
      nameLine2,
      profilePhoto: hero?.profilePhoto ?? '/images/profiles/sanjay.png',
      portraitAlt: displayName,
      subtitle,
      roleLines,
      rotatingLines: rotatingLines.length ? rotatingLines : [firstName],
      marqueeText,
      portraitObjectPosition: hero?.portraitObjectPosition ?? 'center 20%',
    },
    nav: {
      links: [
        { label: 'Main', href: '#top', isHash: true },
        { label: 'Hero', href: '#manifesto', isHash: true },
        { label: 'Narrative', href: '#about', isHash: true },
        { label: 'Skills', href: '#capabilities', isHash: true },
        { label: "Let's Connect", href: '#contact', isHash: true },
      ],
      drawerLinks: [
        { label: 'Main', href: '#top', isHash: true },
        { label: 'Hero', href: '#manifesto', isHash: true },
        { label: 'Narrative', href: '#about', isHash: true },
        { label: 'Skills', href: '#capabilities', isHash: true },
        { label: "Let's Connect", href: '#contact', isHash: true },
      ],
    },
    social: buildSocialLinks(contact?.socialLinks),
    manifesto: {
      heading:
        hero?.heading
        ?? 'Helping brands stand out in the digital era. Together we set the new status quo.',
      body:
        hero?.heroStatement
        ?? paragraphs[0]
        ?? meta?.description
        ?? '',
    },
    about: {
      image: narrative?.backgroundImage ?? '/images/landing/image1.png',
      imageAlt: `${displayName} — professional narrative`,
      imageObjectPosition: 'center 30%',
      video: {
        src: hero?.videoCv?.src ?? '',
        poster: hero?.videoCv?.poster ?? narrative?.backgroundImage ?? '/images/landing/image1.png',
      },
      eyebrow: narrative?.tag ?? 'Narrative',
      heading: subtitle || `About ${firstName}`,
      paragraphs: paragraphs.length
        ? paragraphs
        : [hero?.heroStatement ?? meta?.description ?? ''].filter(Boolean),
    },
    capabilities: {
      eyebrow: capabilities?.tag ?? 'Skills',
      backgroundImage: capabilities?.backgroundImage ?? '/images/landing/imag2.png',
      items: bullets.map((text, index) => ({
        id: index + 1,
        number: String(index + 1).padStart(2, '0'),
        text: text.trim(),
      })),
      ctaLabel: ctaLabel,
      ctaHref: mailto,
    },
    contact: {
      heading: "Let's work together",
      headingLines: ["Let's work", 'together.'],
      profilePhoto: hero?.profilePhoto ?? '/images/profiles/sanjay.png',
      ctaLabel,
      email: contact?.email ?? '',
      emailHref: mailto,
      phone: '',
      phoneHref: '#contact',
    },
    footer: {
      version: 'GoodWork CV',
      copyrightName: firstName,
    },
  };
}

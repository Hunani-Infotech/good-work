import defaultSite from '../site.json';
import { SHOOOTE_BASE } from './constants.js';
import { buildSocialLinks } from '../../utils/socialLinks.js';

function heroNameLines(brand) {
  const firstName = (brand.firstName || 'Sanjay').trim();
  const lastName = (brand.lastName || '').trim();

  return {
    line1: firstName.toUpperCase(),
    line2: lastName ? lastName.toUpperCase() : '',
    hasLastName: Boolean(lastName),
    fullName: lastName ? `${firstName} ${lastName}` : firstName,
  };
}

/** Split a single first name so the portrait can sit inline between both halves. */
function splitFirstNameAroundPortrait(firstName) {
  const text = (firstName || '').trim().toUpperCase();
  const len = text.length;

  if (len <= 1) {
    return { left: text, right: '' };
  }

  const splitAt = Math.ceil(len / 2);
  return {
    left: text.slice(0, splitAt),
    right: text.slice(splitAt),
  };
}

function expertiseHeadingLines(heading) {
  const trimmed = (heading || '').trim();
  if (!trimmed) return [];

  const nativeIdx = trimmed.search(/\s+Native\s+and\s+Cross-Platform/i);
  if (nativeIdx !== -1) {
    return [
      trimmed.slice(0, nativeIdx).trim(),
      trimmed.slice(nativeIdx + 1).trim(),
    ];
  }

  const mid = Math.floor(trimmed.length / 2);
  const spaceIdx = trimmed.indexOf(' ', mid);
  if (spaceIdx === -1) return [trimmed];

  return [trimmed.slice(0, spaceIdx).trim(), trimmed.slice(spaceIdx + 1).trim()];
}

function heroTagline(hero) {
  if (hero.heroStatement) {
    return hero.heroStatement.trim();
  }
  if (hero.heading) {
    return hero.heading.trim();
  }
  return '';
}


export function mapSiteToShooote(site = defaultSite) {
  const { brand, meta, contact } = site.site;
  const { hero, narrative, capabilities } = site.home;
  const firstName = brand.firstName || 'Sanjay';
  const nameLines = heroNameLines(brand);
  const ctaLabel = hero.ctaLabel || "Let's Connect";
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailtoSubjectNav || `Hey ${firstName}!`)}`;

  const navLinks = [
    { label: 'Main', href: '#profile', isHash: true },
    { label: 'Hero', href: '#expertise', isHash: true },
    { label: 'Narrative', href: '#narrative', isHash: true },
    { label: 'Skills', href: '#capabilities', isHash: true },
    { label: "Let's Connect", href: '#connect', isHash: true, className: 'hire-me' },
  ];

  return {
    SHOOOTE_BASE,
    navLinks,
    social: buildSocialLinks(contact?.socialLinks),
    logoImage: hero.profilePhoto,
    logoText: firstName,
    theme: {
      accent: site.site?.theme?.orange ?? '#f25828',
      cream: '#FFFCE9',
      ink: '#1a1a1a',
    },
    siteMeta: {
      title: meta.homeTitle || `${firstName} | GoodWork`,
      tagline: hero.subtitle || '',
      location: 'GoodWork',
    },
    hero: {
      title: nameLines.fullName,
      nameLine1: nameLines.line1,
      nameLine2: nameLines.line2,
      nameParts: nameLines.hasLastName ? null : splitFirstNameAroundPortrait(firstName),
      nameCharCount: nameLines.line1.length,
      hasLastName: nameLines.hasLastName,
      role: (hero.subtitle || '').trim(),
      tagline: heroTagline(hero),
      image: hero.profilePhoto,
      sectionLabel: '01 — Main',
    },
    expertise: {
      sectionLabel: '02 — Hero',
      eyebrow: 'Video introduction',
      heading: hero.heading || '',
      headingLines: expertiseHeadingLines(hero.heading),
      statement: hero.heroStatement || '',
      ctaLabel: hero.ctaLabel || "Let's Connect",
      mailto,
      authorName: nameLines.fullName,
      video: {
        src: hero?.videoCv?.src ?? '',
        poster: hero?.videoCv?.poster ?? hero?.profilePhoto ?? '',
      },
    },
    narrative: {
      sectionLabel: '03 — Narrative',
      tag: narrative.tag || 'Professional Narrative',
      paragraphs: narrative.paragraphs || [],
      backgroundImage: narrative.backgroundImage || '',
    },
    capabilities: {
      sectionLabel: '04 — Skills',
      tag: capabilities.tag || 'Capabilities & Skills',
      bullets: capabilities.bullets || [],
      backgroundImage: capabilities.backgroundImage || '',
    },
  };
}

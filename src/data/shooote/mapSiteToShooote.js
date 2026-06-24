import defaultSite from '../site.json';
import { SHOOOTE_BASE } from './constants.js';

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
    { label: 'Profile', href: '#profile', isHash: true },
    { label: 'Expertise', href: '#expertise', isHash: true },
    { label: 'Narrative', href: '#narrative', isHash: true },
    { label: 'Capabilities', href: '#capabilities', isHash: true },
    { label: ctaLabel, href: mailto, isHash: false, className: 'hire-me' },
  ];

  return {
    SHOOOTE_BASE,
    navLinks,
    logoImage: hero.profilePhoto,
    logoText: firstName,
    siteMeta: {
      title: meta.homeTitle || `${firstName} | GoodWork`,
      tagline: hero.subtitle || '',
      location: 'GoodWork',
    },
    hero: {
      title: nameLines.fullName,
      nameLine1: nameLines.line1,
      nameLine2: nameLines.line2,
      hasLastName: nameLines.hasLastName,
      role: (hero.subtitle || '').trim(),
      tagline: heroTagline(hero),
      image: hero.profilePhoto,
      sectionLabel: '01 — Profile',
    },
    expertise: {
      sectionLabel: '02 — Hero',
      heading: hero.heading || '',
      statement: hero.heroStatement || '',
      ctaLabel: hero.ctaLabel || "Let's Connect",
      mailto,
    },
    narrative: {
      sectionLabel: '03 — Narrative',
      tag: narrative.tag || 'Professional Narrative',
      paragraphs: narrative.paragraphs || [],
      backgroundImage: narrative.backgroundImage || '',
    },
    capabilities: {
      sectionLabel: '04 — Capabilities',
      tag: capabilities.tag || 'Capabilities & Skills',
      bullets: capabilities.bullets || [],
      backgroundImage: capabilities.backgroundImage || '',
    },
  };
}

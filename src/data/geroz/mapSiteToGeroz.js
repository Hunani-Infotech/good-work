import { GEROZ_TEMPLATE_IMAGES } from './constants.js';
import { getGerozColorTheme } from './gerozColorThemes.js';
import { buildSocialLinks } from '../../utils/socialLinks.js';

function parseExperienceYears(...texts) {
  const joined = texts.filter(Boolean).join(' ');
  const match = joined.match(/(\d+(?:\.\d+)?)\+?\s*years?/i);
  return match ? Math.ceil(parseFloat(match[1])) : null;
}

function splitBulletTitle(bullet, maxWords = 7) {
  const words = bullet.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return { title: bullet, titleBreak: '' };
  }
  return {
    title: words.slice(0, maxWords).join(' '),
    titleBreak: words.slice(maxWords).join(' '),
  };
}

function buildMailto(email, subject) {
  if (!email) return '#cta';
  return `mailto:${email}?subject=${encodeURIComponent(subject ?? '')}`;
}

function buildCircleText(label) {
  const token = `.${label.replace(/\s+/g, '')}.`;
  return token.repeat(5);
}

/**
 * Maps site.json into Geroz template section content.
 */
export function mapSiteToGeroz(site) {
  const { brand, meta, contact, theme } = site?.site ?? {};
  const { hero, narrative, capabilities } = site?.home ?? {};
  const ctaSection = site?.home?.cta;

  const firstName = brand?.firstName ?? 'Portfolio';
  const lastName = brand?.lastName ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const mailtoSubject = contact?.mailtoSubjectNav ?? `Hey ${firstName}!`;
  const mailto = buildMailto(contact?.email, mailtoSubject);
  const ctaLabel = hero?.ctaLabel ?? "Let's Connect";
  const bullets = capabilities?.bullets ?? [];
  const paragraphs = narrative?.paragraphs ?? [];
  const experienceYears =
    parseExperienceYears(...paragraphs, hero?.heroStatement, hero?.heading)
    ?? Math.max(bullets.length, 4);

  const caseImages = bullets.map(
    (_, index) => GEROZ_TEMPLATE_IMAGES.cases[index % GEROZ_TEMPLATE_IMAGES.cases.length],
  );

  const colorTheme = getGerozColorTheme(theme?.colorThemeIndex ?? 0);

  return {
    siteMeta: {
      title: meta?.homeTitle ?? `${firstName} | GoodWork`,
      description: meta?.description ?? '',
      favicon: meta?.favicon ?? '/favicon-gw.png',
    },
    theme: {
      accent: colorTheme.accent,
      orange: colorTheme.accent,
      purple: colorTheme.secondary,
      bgWarm: colorTheme.bgWarm,
      grey: colorTheme.grey,
      colorThemeIndex: theme?.colorThemeIndex ?? 0,
      colorThemeId: colorTheme.id,
      colorThemeName: colorTheme.name,
    },
    contact: {
      email: contact?.email ?? '',
      mailto,
      ctaLabel,
    },
    social: buildSocialLinks(contact?.socialLinks),
    images: {
      hero: hero?.profilePhoto ?? GEROZ_TEMPLATE_IMAGES.hero,
      heroBg: narrative?.backgroundImage ?? GEROZ_TEMPLATE_IMAGES.heroBg,
      expert: hero?.profilePhoto ?? GEROZ_TEMPLATE_IMAGES.expert,
      video: narrative?.backgroundImage ?? capabilities?.backgroundImage ?? GEROZ_TEMPLATE_IMAGES.heroBg,
      footerBg: capabilities?.backgroundImage ?? GEROZ_TEMPLATE_IMAGES.footerBg,
      footerBgAlt: narrative?.backgroundImage ?? GEROZ_TEMPLATE_IMAGES.footerBgAlt,
      cases: caseImages.length ? caseImages : GEROZ_TEMPLATE_IMAGES.cases,
    },
    video: {
      src: hero?.videoCv?.src ?? '',
      poster: hero?.videoCv?.poster ?? GEROZ_TEMPLATE_IMAGES.video,
      isFile: Boolean(hero?.videoCv?.src),
    },
    hero: {
      firstName,
      lastName,
      fullName,
      subtitle: hero?.subtitle ?? '',
      statement: hero?.heroStatement ?? hero?.heading ?? meta?.description ?? '',
      profilePhoto: hero?.profilePhoto ?? GEROZ_TEMPLATE_IMAGES.hero,
      portraitAlt: fullName || firstName,
      circleText: buildCircleText(ctaLabel),
      circleHref: mailto,
      ctaLabel,
    },
      expertise: {
      tag: 'Hero',
      heading: hero?.heading ?? '',
      statement: hero?.heroStatement ?? '',
      ctaLabel: hero?.ctaLabel ?? "Let's Connect",
      ctaHref: '#cta',
    },
    about: {
      eyebrow: narrative?.tag ?? 'Narrative',
      heading: hero?.heading ?? paragraphs[0] ?? '',
      body: paragraphs[0] ?? hero?.heroStatement ?? '',
      extraParagraph: paragraphs[1] ?? '',
      thirdParagraph: paragraphs[2] ?? '',
      backgroundImage: narrative?.backgroundImage ?? GEROZ_TEMPLATE_IMAGES.heroBg,
    },
    capabilities: {
      eyebrow: capabilities?.tag ?? 'Skills',
      title: capabilities?.tag ?? 'Skills',
      backgroundImage:
        capabilities?.backgroundImage ?? GEROZ_TEMPLATE_IMAGES.footerBg,
      items: bullets.map((bullet, index) => {
        const { title, titleBreak } = splitBulletTitle(bullet);
        const categoryWords = bullet.split(' ').slice(0, 3).join(' ').toUpperCase();
        return {
          id: index + 1,
          number: String(index + 1).padStart(2, '0'),
          image: caseImages[index] ?? GEROZ_TEMPLATE_IMAGES.cases[0],
          category: categoryWords,
          title,
          titleBreak,
          href: mailto,
        };
      }),
    },
    expert: {
      marqueeTitle: (hero?.subtitle ?? firstName).toUpperCase(),
      years: experienceYears,
      experiencePrefix: 'YEARS OF EXPERIENCE IN',
      experienceField: (hero?.subtitle ?? 'MOBILE DEVELOPMENT').toUpperCase(),
      image: hero?.profilePhoto ?? GEROZ_TEMPLATE_IMAGES.expert,
      quote: hero?.heroStatement ?? paragraphs[0] ?? meta?.description ?? '',
      authorName: fullName || firstName,
      authorRole: hero?.subtitle ?? '',
      signature: firstName,
    },
    footer: {
      displayName: fullName.toUpperCase(),
      copyrightName: firstName,
      headline: hero?.heading ?? "See how we can help you, get in touch today.",
      email: contact?.email ?? '',
      emailHref: mailto,
      role: hero?.subtitle ?? '',
      links: [
        { label: 'About Me', href: '#about' },
        { label: 'Capabilities', href: '#capabilities' },
        { label: 'Contact Me', href: mailto },
      ],
    },
    nav: {
      links: [
        { label: 'Main', href: '#top', isHash: true },
        { label: 'Hero', href: '#expertise', isHash: true },
        { label: 'Narrative', href: '#about', isHash: true },
        { label: 'Skills', href: '#capabilities', isHash: true },
        { label: ctaSection?.ctaLabel ?? ctaLabel, href: '#cta', isHash: true, isCta: true },
      ],
    },
  };
}

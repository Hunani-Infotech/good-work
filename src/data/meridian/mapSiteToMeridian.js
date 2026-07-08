import { buildSocialLinks } from '../../utils/socialLinks.js';

function buildMailto(email, subject) {
  if (!email) return '#contact';
  return `mailto:${email}?subject=${encodeURIComponent(subject ?? '')}`;
}

/**
 * Meridian template — Dennis Snellenberg portfolio layout from site.json.
 */
export function mapSiteToMeridian(site) {
  const { brand, meta, contact, theme } = site?.site ?? {};
  const { hero, narrative, capabilities } = site?.home ?? {};

  const firstName = brand?.firstName ?? 'Portfolio';
  const lastName = brand?.lastName ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const displayName = fullName || firstName;
  const subtitle = hero?.subtitle ?? '';
  const mailtoSubject = contact?.mailtoSubjectNav ?? `Hey ${firstName}!`;
  const mailto = buildMailto(contact?.email, mailtoSubject);
  const ctaLabel = hero?.ctaLabel ?? 'Get in touch';
  const bullets = capabilities?.bullets ?? [];
  const paragraphs = narrative?.paragraphs ?? [];

  const isPlaceholderLastName = !lastName || /^last\s*name$/i.test(lastName.trim());
  const rotatingLines = [
    !isPlaceholderLastName && displayName !== firstName ? displayName : null,
    firstName,
  ]
    .filter(Boolean)
    .filter((line, index, all) => all.indexOf(line) === index);

  const marqueeText = `${displayName} — `;

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
      lastName,
      fullName: displayName,
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
        { label: 'Capabilities', href: '#capabilities', isHash: true },
        { label: 'About', href: '#about', isHash: true },
        { label: 'Contact', href: '#contact', isHash: true },
      ],
      drawerLinks: [
        { label: 'Home', href: '#top', isHash: true },
        { label: 'Capabilities', href: '#capabilities', isHash: true },
        { label: 'About', href: '#about', isHash: true },
        { label: 'Contact', href: '#contact', isHash: true },
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
      eyebrow: narrative?.tag ?? 'Professional Narrative',
      heading: subtitle || `About ${firstName}`,
      paragraphs: paragraphs.length
        ? paragraphs
        : [hero?.heroStatement ?? meta?.description ?? ''].filter(Boolean),
    },
    capabilities: {
      eyebrow: capabilities?.tag ?? 'Capabilities & Skills',
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
      headingLines: ["Let's work", 'together'],
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

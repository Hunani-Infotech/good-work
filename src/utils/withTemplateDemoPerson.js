import defaultSite from '../data/site.json';
import { TEMPLATE_DEMO_PEOPLE, demoDisplayName } from '../data/templateDemoPeople.js';

const DEFAULT_FIRST_NAME = defaultSite.site?.brand?.firstName ?? 'Sanjay';
const DEFAULT_PHOTO = defaultSite.home?.hero?.profilePhoto ?? '/images/profiles/sanjay.png';

/**
 * True when the active site still looks like the shared Sanjay showcase identity.
 * Custom admin / share-preview content should not be overwritten by demo people.
 */
export function isDefaultShowcaseSite(site) {
  const firstName = site?.site?.brand?.firstName;
  const photo = site?.home?.hero?.profilePhoto;
  return firstName === DEFAULT_FIRST_NAME && (!photo || photo === DEFAULT_PHOTO);
}

/**
 * Overlay a template-specific demo name + profile photo onto site content.
 * Returns the original site when the template has no demo or content was customized.
 */
export function withTemplateDemoPerson(site, templateId, { force = false } = {}) {
  const demo = TEMPLATE_DEMO_PEOPLE[templateId];
  if (!demo) return site;
  if (!force && !isDefaultShowcaseSite(site)) return site;

  const clone = structuredClone(site);
  const displayName = demoDisplayName(demo);

  clone.site = clone.site || {};
  clone.site.brand = {
    ...(clone.site.brand || {}),
    firstName: demo.firstName,
    ...(demo.lastName ? { lastName: demo.lastName } : { lastName: '' }),
  };

  if (clone.site.contact) {
    clone.site.contact = {
      ...clone.site.contact,
      email: demo.email || clone.site.contact.email,
      mailtoSubjectNav: demo.mailtoSubjectNav || `Hey ${demo.firstName}!`,
    };
  }

  if (clone.site.meta) {
    const role = clone.home?.hero?.subtitle;
    clone.site.meta = {
      ...clone.site.meta,
      homeTitle: role
        ? `${displayName} | ${role} — GoodWork`
        : `${displayName} | GoodWork`,
    };
  }

  clone.home = clone.home || {};
  clone.home.hero = {
    ...(clone.home.hero || {}),
    profilePhoto: demo.profilePhoto,
  };

  return clone;
}

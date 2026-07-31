/**
 * Showcase demo identities for CV template covers / previews.
 * Mapped from "Profile Pic & Name Landing Pages.pdf":
 *   Shooote → Sara, Geroz → Aina, Meridian → Ahmad
 * Isak (and Tidal Copper) keep the shared site.json person (Sanjay).
 */
export const TEMPLATE_DEMO_PEOPLE = {
  shooote: {
    firstName: 'Sara',
    profilePhoto: '/images/profiles/sara.jpg',
    coverImg: '/images/profiles/sara-cover.jpg',
    thumbImg: '/images/profiles/sara-thumb.jpg',
    email: 'Sara@goodwork.asia',
    mailtoSubjectNav: 'Hey Sara!',
  },
  geroz: {
    firstName: 'Aina',
    profilePhoto: '/images/profiles/aina.jpg',
    coverImg: '/images/profiles/aina-cover.jpg',
    thumbImg: '/images/profiles/aina-thumb.jpg',
    email: 'Aina@goodwork.asia',
    mailtoSubjectNav: 'Hey Aina!',
  },
  meridian: {
    firstName: 'Ahmad',
    profilePhoto: '/images/profiles/ahmad.jpg',
    coverImg: '/images/profiles/ahmad-cover.jpg',
    thumbImg: '/images/profiles/ahmad-thumb.jpg',
    email: 'Ahmad@goodwork.asia',
    mailtoSubjectNav: 'Hey Ahmad!',
  },
};

export function demoDisplayName(demo) {
  if (!demo) return '';
  return [demo.firstName, demo.lastName].filter(Boolean).join(' ').trim();
}

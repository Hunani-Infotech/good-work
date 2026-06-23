# CLAUDE.md — Project Map

## Project: GoodWork CV (react-project)

React + Vite site: GoodWork agency homepage + individual CV landing pages. Run with `npm run dev`. Build with `npm run build`.

---

## Stack

- **React 19** + **react-router-dom 7** (SPA, hash-free routing via `vercel.json`)
- **Vite 6** (no TypeScript, plain JSX)
- **GSAP 3** + **ScrollTrigger** — scroll animations
- **Lenis** — smooth scroll
- **lottie-web** — loader animation
- **lz-string** — share URL compression (admin / preview flow)

---

## Routes

| Route | Page | Animations hook |
|-------|------|-----------------|
| `/` | `AgencyHomePage` | `useAgencyAnimations` |
| `/cv/sanjay` | `CvPage` | `useCvAnimations` |
| `/admin` | `AdminPage` | `usePageReveal` |
| `/*` | `NotFoundPage` | `usePageReveal` |

---

## Directory Map

```
src/
  App.jsx
  main.jsx
  index.css                     # Imports site.css, loader.css (not cv-landing.css)
  context/
    SiteContext.jsx             # site.json + localStorage + share URLs
  data/
    site.json                   # Individual landing content (site + home)
    portfolioTemplates.js       # Agency template picker data
  pages/
    AgencyHomePage.jsx
    CvPage.jsx
    AdminPage.jsx
    NotFoundPage.jsx
  components/
    agency/                     # Agency marketing homepage
    cv/                         # Individual 4-screen landing
      CvHero.jsx                # Screen 1 — profile
      CvExpertiseSection.jsx    # Screen 2 — video + hero + CTA
      CvNarrativeSection.jsx    # Screen 3 — narrative
      CvCapabilitiesSection.jsx # Screen 4 — capabilities
      CvSection.jsx             # Shared section shell
      CvSectionChrome.jsx       # Section label + eyebrow
      CvPoweredBy.jsx
    layout/
      Layout.jsx                # CV-only shell (CvTopBar, cursor, theme vars)
      CvTopBar.jsx
    ui/
      SiteLoader.jsx
      ShareButton.jsx
      SharePreviewBanner.jsx
      CustomCursor.jsx
      LottieEmbed.jsx
      LazyVideo.jsx
      MediaImage.jsx
  animations/
    cvAnimations.js             # CV scroll timelines
    agencyAnimations.js         # Agency homepage timelines
    scrollPageBoot.js           # Shared page boot (Lenis, loader wait, teardown)
    scrollRuntime.js            # Lenis + ScrollTrigger sync
    gsapTextHelpers.js          # CV text split / reveal helpers
    loaderAnimations.js
    portfolioTemplatePicker.js
  hooks/
    useScrollPageAnimations.js  # exports useCvAnimations, useAgencyAnimations
    useSiteLoader.js
    usePageReveal.js
  styles/
    cv-landing.css              # Tidal Copper CV theme (imported in CvPage.jsx)
    agency.css
    site.css
    admin.css
    loader.css
    template-picker.css
  fonts/
    Goga-Regular.otf
    Goga-SemiBold.otf

public/
  documents/                    # Lottie JSON (loader)
  images/goodwork/              # Logo SVGs
  images/agency/                  # Agency art
  images/landing/                 # Optional CV backgrounds (Merdeka 118, youth)
  favicon-gw.png

legacy/                         # Archived vanilla JS — DO NOT edit or import
```

---

## Content model (`site.json`)

Individual landing page content only — matches the GoodWork Individual Landing Page doc:

- **`site.brand.firstName`** — hero name
- **`site.contact`** — email + mailto subject for CTA
- **`site.meta`** — page title, description, favicon, published URL
- **`home.hero`** — screen 1 + 2 (photo, title, heading, statement, video, CTA label)
- **`home.narrative`** — screen 3 (tag, paragraphs, optional background)
- **`home.capabilities`** — screen 4 (tag, bullets, optional background)

No `work` section. Validation in `src/utils/siteShare.js` requires `site` + `home` only.

---

## Key Conventions

- No TypeScript — plain `.jsx` / `.js` throughout.
- CSS is split per surface (`cv-landing.css`, `agency.css`, `site.css`) — not CSS modules.
- CV styles are **route-scoped**: `CvPage.jsx` imports `cv-landing.css`; agency imports `agency.css`.
- Animation logic lives in `src/animations/`; CV and agency hooks are in `useScrollPageAnimations.js`.
- `legacy/` is archived reference code, never imported by the React app.

---

## DO NOT Read Unless Editing

- `node_modules/`
- `legacy/` — archived reference only
- `public/documents/*.json` — large Lottie files
- `package-lock.json`

---

## Quick Navigation

| Task | Start here |
|------|-----------|
| Add a route | `src/App.jsx` + `src/pages/` |
| Edit CV sections | `src/components/cv/` |
| Edit CV styles | `src/styles/cv-landing.css` |
| Edit CV animations | `src/animations/cvAnimations.js` + `src/hooks/useScrollPageAnimations.js` |
| Edit agency homepage | `src/components/agency/` + `src/styles/agency.css` |
| Change site copy | `src/data/site.json` or `/admin` |
| Share / preview flow | `src/context/SiteContext.jsx` + `src/utils/siteShare.js` |
| Global styles / loader | `src/styles/site.css`, `src/index.css` |
| Site loader | `src/components/ui/SiteLoader.jsx` + `loaderAnimations.js` |

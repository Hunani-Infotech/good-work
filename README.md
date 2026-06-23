# GoodWork CV

Vite + React site for **GoodWork** — agency marketing homepage plus individual CV landing pages. Content is driven by **`src/data/site.json`** with optional admin editing and share URLs.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

| Route | Page |
|-------|------|
| `/` | GoodWork agency homepage |
| `/cv/sanjay` | Individual landing page (4 screens) |
| `/admin` | Content editor |
| `/*` | 404 |

Preview the CV: `http://localhost:5173/cv/sanjay`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Individual landing page (CV)

The CV route follows the **GoodWork Individual Landing Page** content spec — four scroll screens only:

| Screen | Content |
|--------|---------|
| 1 — Profile | Photo, name, professional title |
| 2 — Video | 10s looping video CV, hero header, statement, mailto CTA |
| 3 — Narrative | Professional narrative (3 paragraphs), optional Merdeka 118 background |
| 4 — Capabilities | Capabilities & skills (4 bullets), optional youth/cafe background |

Every screen shows **Powered by GoodWork** in the footer. Share button is top-right (`CvTopBar`).

## Content (`site.json`)

All editable copy lives in **`src/data/site.json`**. Shape:

```json
{
  "site": {
    "brand": { "firstName": "Sanjay" },
    "theme": { "purple": "#510066", "orange": "#f25828", "bgWarm": "#faf8f5", "grey": "#96908c" },
    "meta": { "homeTitle": "", "description": "", "favicon": "", "publishedUrl": "", "configUrl": "" },
    "contact": { "email": "", "mailtoSubjectNav": "" }
  },
  "home": {
    "hero": {
      "subtitle": "",
      "profilePhoto": "",
      "heading": "",
      "heroStatement": "",
      "ctaLabel": "Let's Connect",
      "videoCv": { "src": "", "poster": "" }
    },
    "narrative": {
      "tag": "Professional Narrative",
      "backgroundImage": "",
      "paragraphs": ["", "", ""]
    },
    "capabilities": {
      "tag": "Capabilities & Skills",
      "backgroundImage": "",
      "bullets": ["", "", "", ""]
    }
  }
}
```

- **`SiteProvider`** (`src/context/SiteContext.jsx`) loads `site.json`, with optional localStorage override and `?share=` / `?config=` URL preview.
- Edit via **`/admin`** or edit `site.json` directly, then restart dev or rebuild.
- Theme colors under `site.theme` are applied at runtime via CSS variables on CV pages.

## Project structure

```
src/
  data/
    site.json                 # CV + meta content
    portfolioTemplates.js     # Agency homepage template cards
  pages/
    AgencyHomePage.jsx        # /
    CvPage.jsx                # /cv/sanjay
    AdminPage.jsx             # /admin
    NotFoundPage.jsx
  components/
    agency/                   # Agency marketing sections
    cv/                       # Individual landing (4 screens)
      CvHero.jsx
      CvExpertiseSection.jsx
      CvNarrativeSection.jsx
      CvCapabilitiesSection.jsx
      CvSection.jsx           # Shared screen shell
      CvSectionChrome.jsx     # Label + eyebrow primitives
      CvPoweredBy.jsx
    layout/
      Layout.jsx              # CV page shell (top bar, cursor, theme)
      CvTopBar.jsx            # Share button
    ui/                       # Loader, share, cursor, media helpers
  animations/
    cvAnimations.js           # CV scroll animations
    agencyAnimations.js       # Agency homepage animations
    scrollPageBoot.js         # Shared Lenis + loader boot
    scrollRuntime.js          # Lenis / ScrollTrigger helpers
    gsapTextHelpers.js        # CV text reveal helpers
    loaderAnimations.js
  hooks/
    useScrollPageAnimations.js  # useCvAnimations + useAgencyAnimations
    useSiteLoader.js
    usePageReveal.js
  styles/
    cv-landing.css            # Imported by CvPage only
    agency.css                # Imported by AgencyHomePage
    site.css                  # Global legacy + shared
    admin.css
public/
  documents/                  # Lottie JSON (loader)
  images/goodwork/            # Brand assets
  images/agency/              # Agency marketing art
  images/landing/             # CV background photos (optional)
```

## Tech stack

- **React 19** + **React Router 7**
- **Vite 6**
- **GSAP 3** + **ScrollTrigger**
- **Lenis** smooth scroll
- **lottie-web** (site loader)
- **lz-string** (share URL compression)

## Deployment

```bash
npm run build
```

Deploy **`dist/`** to any static host (Vercel, Netlify, etc.). `vercel.json` rewrites all paths to `index.html` for client-side routing.

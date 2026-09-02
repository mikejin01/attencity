# Attencity

The website for **Attencity** — *Attention meets City!* — a brand-authority / PR / marketing
agency with U.S. and China-based teams. Built with **SvelteKit (Svelte 5)** as a fully static,
multi-page site on the **Editorial** design (Barlow Condensed + Inter, orange `#ff5000`
accent, dark hero + near-black footer), deployable to **GitHub Pages**.

The site was rebuilt from the original WordPress/Kubio site following
[`docs/rebuild-plan.md`](docs/rebuild-plan.md) (copy, section mapping, open questions).

## Pages

| Route | Title | Notes |
|---|---|---|
| `/` | Attencity — Attention meets City! | hero, social video marquee, six services, Why Attencity, Services for Individual, clients, Insights, contact CTA + form |
| `/services/` | Services | six service blocks (two with "Outcome" lines from the original) + CTA band |
| `/about/` | About | interim intro (hero line + the four "Why" points); team grid built but hidden behind `aboutPage.showTeam` |
| `/case-studies/` | Case Studies | "coming soon" statement + three clearly-marked placeholder cards, no detail pages |
| `/contact/` | Contact | info card (only confirmed details) + the form |
| `/blog/` | → redirects to `/case-studies/` | the original listed posts at `/blog/` |

"Get in touch" (navbar, hero, mobile menu, case studies) opens a global contact modal.

## Run locally

Uses [pnpm](https://pnpm.io) (`corepack enable` if you don't have it):

```bash
pnpm install
pnpm dev           # dev server at http://localhost:5173
pnpm build         # static output in ./build
pnpm preview       # serve the built site locally
```

## Editing content

**All copy and asset references live in one file:** [`src/lib/content/attencity.js`](src/lib/content/attencity.js).
Components only render what that file exports. Entries marked `interim: true` are stand-in
text awaiting the client (see plan §8).

Key switches in that file:

- `contactConfig.formEndpoint` — a JSON-accepting POST endpoint (Formspree / Basin / Web3Forms style).
  When set, both forms POST there.
- `contactConfig.email` — the real inbox. With no endpoint, forms fall back to a pre-filled `mailto:` link.
  With neither set, forms validate and show a clearly labelled "not connected yet" state (current).
- `contactConfig.phone` / `offices` — shown on the contact page when present.
- `footer.social[].href` — a social icon renders only when its URL is set (all empty today, so the
  "Follow Us" column is hidden).
- `aboutPage.showTeam` — flip to `true` once real names / roles / photos are in `aboutPage.team`.
- `home.social` — the video marquee: `title` (replace with the handle), and per clip `href` (post URL) and `network`.
  Clips live in `static/assets/attencity/social/` as `attencity-social-N.mp4` with a matching `.webp` poster.

## Deploy to GitHub Pages

A workflow is included at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
3. Push to `main` (or run the workflow manually).

The build's base path is set automatically from the repo name by `actions/configure-pages`,
so project pages under a subpath work without edits (`static/.nojekyll` keeps `_app/` intact).
Open Graph URLs use `site.url` (`https://attencity.com`) from the content file.

## Project structure

```
src/
  app.html                        document shell, favicon links, Google Fonts
  app.css                         reset, modal/form primitives (.theme-editorial tokens)
  lib/
    content/attencity.js          ALL copy + asset refs (single source of content)
    contact.svelte.js             modal open/close state + message delivery (endpoint / mailto / none)
    actions.js                    reveal-on-scroll + lazy-video actions
    editorial/
      editorial.css               the Editorial design system shared by every route
      Navbar.svelte               headroom navbar, active link, full-screen mobile menu
      Footer.svelte               footer (social column only when URLs exist)
      AttencityLogo.svelte        lockup, variant="light|dark"
      Seo.svelte                  per-route <title>, description, canonical, Open Graph
      icons.js                    line icons (Why band) + social glyphs
      sections/                   Hero, PageHero, ServiceGrid, WhyBand, SplitFeature, ClientLogos,
                                  SocialFeed, Statement, ContactCta, ServiceDetail, CtaBand,
                                  TeamGrid, ContactInfo, CaseStudyGrid
    components/
      ContactForm.svelte          Name / Email / Company / Message (dark + light variants)
      ContactModal.svelte         global "Get in touch" dialog
  routes/
    +layout.js                    prerender = true, trailingSlash = 'always'
    +layout.svelte                .sora wrapper → Navbar, page, Footer, ContactModal
    +page.svelte                  home; services/ about/ case-studies/ contact/ ; blog/ (redirect)
static/
  favicon.png, apple-touch-icon.png, icon-512.png   cut from the Attencity mark
  assets/attencity/               shipped images (WebP), clients/ (white logos), social/ (clips + posters),
                                  services/ (card photos), logo lockups, og-image
docs/
  rebuild-plan.md                 the rebuild plan + open questions (§8)
  source/                         original site: html/, extracted/ text, asset-manifest.md, sitemaps,
                                  originals/ (source images superseded by the optimised versions)
```

## Notes

- **Forms are not connected yet** — see `contactConfig` above (plan §8 Q1/Q3).
- Images were converted to WebP; the largest shipped image is ~180 KB. The eight social clips
  are muted H.264 (audio stripped, faststart) and only download when scrolled near. Source files
  are kept in `docs/source/originals/` and documented in `docs/source/asset-manifest.md`.
- The client logos are rendered as white-on-transparent versions cut from the originals so the
  strip reads consistently on the dark band; transparent/white originals from the client are
  still welcome (plan §8 Q9).
- `prefers-reduced-motion` disables the hero zoom, reveals, and modal/menu animations.

# Attencity

The website for **Attencity** — *Attention meets City!* — a New York marketing and
communications agency with U.S. and China-based teams. Built with **SvelteKit (Svelte 5)** as a
fully static, prerendered site on the **Editorial** design (Barlow Condensed + Inter, orange
`#ff5000`, dark hero + near-black footer), deployed to **GitHub Pages**.

Two planning documents describe how it got here:

- [`docs/rebuild-plan.md`](docs/rebuild-plan.md) — the original rebuild from the WordPress site.
- [`docs/content-update-plan.md`](docs/content-update-plan.md) — the 2026 content update: seven
  service pages, case studies, Insights, the new lead form, and the SEO plumbing. Section
  numbers referenced in code comments (§3.2, §6.4, …) point at that file.

## Pages

| Route | Notes |
|---|---|
| `/` | Hero slider, trust strip, social marquee, six service cards, Why Attencity, personal-branding teaser, SMG partnership + evidenced placements, 26-logo client wall, recent work, latest insights, contact CTA |
| `/services/` | Hub: seven summary cards (six for companies, one for individuals) → their own pages. Old `#brand-strategy` style anchors still resolve |
| `/services/<slug>/` | Seven landing pages: overview, what we do, how it works (3A), proof stats, related work, FAQ, CTA |
| `/case-studies/` + `/case-studies/<slug>/` | Six published case studies from the 2026 Business Deck |
| `/insights/` + `/insights/<slug>/` | Six posts (event recaps and partnership news) |
| `/about/` | Who we are, purpose & mission, the 3A × 4R methodology as inline SVG, network reach, founder, careers |
| `/contact/` | Address, phone, email, socials (with QR dialog), embedded map, form |
| `/blog/` | 301 → `/insights/` |
| `/sitemap.xml`, `/robots.txt` | generated / static |

"Get in touch" (navbar, hero, mobile menu, every CTA band) opens a global contact modal.

## Run locally

Uses [pnpm](https://pnpm.io) (`corepack enable` if you don't have it):

```bash
pnpm install
pnpm dev           # dev server at http://localhost:5173
pnpm build         # static output in ./build
pnpm preview       # serve the built site locally
```

> `vite preview` caches its file listing at boot, so **restart it after every build** or newly
> hashed assets 404.

## Editing content

Copy and asset references live in `src/lib/content/`:

| File | Holds |
|---|---|
| [`attencity.js`](src/lib/content/attencity.js) | Site identity, contact details, socials, nav, home/about/contact page copy, footer. Re-exports the other modules, so `import { … } from '$lib/content/attencity.js'` still works everywhere. |
| [`services.js`](src/lib/content/services.js) | The seven services and everything on their landing pages |
| [`network.js`](src/lib/content/network.js) | Client logos and roster, media-network lists, evidenced placements |
| [`posts.js`](src/lib/content/posts.js) | Loads `src/content/**/*.md` through mdsvex; sorting, related-content and prev/next helpers |
| [`media-sizes.js`](src/lib/content/media-sizes.js) | **Generated** — every image's intrinsic size, so no component hard-codes a width |

Key switches:

- `contactConfig.formEndpoint` — the Cloudflare Worker relay URL (see below). Empty today, so
  forms fall back to a pre-filled `mailto:` to `contactConfig.email`.
- `contactConfig.turnstileSiteKey` — set to enable the invisible Turnstile widget.
- `site.analytics.ga4Id` — set the `G-XXXXXXXXXX` id and the GA4 tag renders (nothing loads while empty).
- `site.social[].hidden` — the WeChat entry is hidden pending owner sign-off on publishing a
  personal QR (plan §10 Q3).
- `caseStudiesPage.enabled` / `insightsPage.enabled` — hide a whole section and its home block.
- `aboutPage.showTeam` — flip once real names / roles / photos exist.

### Writing a case study or an insights post

Add one markdown file to `src/content/case-studies/` or `src/content/insights/`. The filename is
the slug. Frontmatter contract:

```yaml
---
title: '…'
date: '2025-09-23'          # YYYY-MM-DD, or a bare year when the day is unknown
dateLabel: 'September 23, 2025'
excerpt: '…'                # one sentence, shown on cards
hero: 'events/f4d-1.webp'   # path under static/assets/attencity/
heroAlt: '…'
tags: ['Events', 'Media']
services: ['media-pr']      # service slugs this entry is proof for
stats:                      # case studies only — the "At a glance" tiles
  - value: '2,000+'
    label: 'attendees'
gallery:
  - file: 'events/f4d-2.webp'
    alt: '…'
seoTitle: '…'               # ≤ 48 chars — " — Attencity" is appended
seoDescription: '…'         # ≤ 155 chars
draft: true                 # optional; keeps it out of the build entirely
---
```

Listings, the home page, related-content blocks, the sitemap and the JSON-LD all pick it up
automatically. `services:` is the only link needed — service pages derive their related content
from it, so there is no second list to keep in sync.

## Images

`scripts/build-assets.py` is the one place that turns source media into shipped assets:

```bash
python3 scripts/build-assets.py            # only writes what is missing
python3 scripts/build-assets.py --force    # re-encode everything
```

It reads `docs/source/deck-media/` and `docs/source/onepager-media/`, and writes:

- **photos** → WebP, capped by width and byte budget, with an `-800.webp` sibling for anything
  used at hero size;
- **client logos** → white-on-transparent PNGs at 160 px tall, so the dark marquee reads
  consistently (it derives the mask from alpha, or from the plate colour for logos that ship on
  a solid background);
- **home service cards** → `services/<service-slug>.webp`, 900×1125 portrait crops cut from the
  full-resolution deck originals. Each entry in `CARDS` carries a `focus` point (x, y in 0–1)
  that stays centred in the crop, so the subject survives the tight vertical framing — that is
  how the CES card keeps the whole "Go Global at CES" screen in shot;
- **Open Graph cards** → `og/<page>.jpg`, 1200×630, cropped from each page's hero with a scrim
  and the lockup;
- **`src/lib/content/media-sizes.js`** → the width/height map, so `dims()` and `srcset()` can
  never drift from the files on disk.

Sources are never modified. Add a row to `PHOTOS`/`LOGOS` in the script rather than converting
by hand.

## Lead capture

The form asks for name, work email, company, **job title**, **how did you hear about us?**, and a
message, plus a newsletter opt-in. Hidden fields carry UTM parameters, referrer, landing page,
current page and form location (captured once per session in `src/lib/lead.js`), so the owner can
analyse leads by channel. A honeypot ships always; Turnstile turns on with a site key.

Delivery is `infra/lead-worker/` — a Cloudflare Worker that emails the team **and** upserts the
lead into **Flodesk** with those fields and segments. See
[`infra/lead-worker/README.md`](infra/lead-worker/README.md) for what the owner needs to provide
and how to deploy it. Until `contactConfig.formEndpoint` is set the site uses `mailto:`, and says
so honestly in the form.

## Deploy to GitHub Pages

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Every push to `main` deploys. The site is currently live at the project-page URL,
**https://mikejin01.github.io/attencity/**, so `actions/configure-pages` sets `BASE_PATH` to
`/attencity` and SvelteKit emits relative URLs that work at that prefix.

**`static/CNAME` is deliberately gitignored.** `attencity.com` still resolves to the old host,
so committing the file would make GitHub redirect the working `github.io` URL to a domain it
does not serve — taking the new site dark. To switch the domain over:

1. Point the apex A records at `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, and
   `www` CNAME at `mikejin01.github.io`.
2. Remove the `/static/CNAME` line from `.gitignore`, then `git add static/CNAME` and push.
3. **Settings → Pages** → set the custom domain and tick **Enforce HTTPS**.

`BASE_PATH` then comes back empty and the site serves from `/`, which is what the canonical
URLs and `og:image` tags (already absolute against `https://attencity.com`) assume.

### Hand-off checklist for the owner

- [ ] Create the GA4 property, paste the id into `site.analytics.ga4Id`.
- [ ] Google Search Console + Bing Webmaster Tools: verify the domain, submit `sitemap.xml`.
- [ ] Create/claim the Google Business Profile for 411 W 35th St.
- [ ] Flodesk API key, team inbox and a Cloudflare account → deploy `infra/lead-worker/`.
- [ ] Answer the remaining questions in `docs/content-update-plan.md` §10 (Xiaohongshu profile
      URL, WeChat QR, NYU / Pre-AI dates, the 2021–22 PR placements, logo permissions).

## Project structure

```
src/
  app.html                    document shell, favicon links, Google Fonts
  app.css                     reset, modal/form primitives (.theme-editorial tokens)
  content/                    markdown: case-studies/*.md, insights/*.md (mdsvex)
  lib/
    content/                  attencity.js, services.js, network.js, posts.js, media-sizes.js
    contact.svelte.js         modal state + delivery (endpoint / mailto / none)
    lead.js                   form option lists, UTM capture, GA4 generate_lead
    actions.js                reveal-on-scroll + lazy-video actions
    seo/jsonld.js             Organization, Service, FAQPage, Article, Event, Breadcrumb builders
    editorial/
      editorial.css           the Editorial design system shared by every route
      Navbar / Footer / Seo / AttencityLogo / icons.js
      sections/               Hero, PageHero, TrustStrip, ServiceGrid, ServiceSummary, WhyBand,
                              SplitFeature, PartnersBand, ClientLogos, PostGrid, StatTiles,
                              Gallery, Faq, Breadcrumbs, PostFooter, Methodology, PurposeMission,
                              NetworkReach, FounderSpotlight, TeamGrid, ContactInfo, ContactCta,
                              CtaBand, Statement, SocialFeed
    components/               ContactForm, ContactModal, Analytics
  routes/
    +layout.js                prerender = true, trailingSlash = 'always'
    +layout.svelte            .sora wrapper → Navbar, page, Footer, modal, JSON-LD, GA4
    +page.svelte              home
    services/ + services/[slug]/
    case-studies/ + case-studies/[slug]/
    insights/ + insights/[slug]/
    about/  contact/  blog/(redirect)  sitemap.xml/
infra/lead-worker/            Cloudflare Worker: email + Flodesk relay
scripts/build-assets.py       source media → shipped assets + media-sizes.js
static/
  CNAME, robots.txt, favicons
  assets/attencity/           events/ work/ press/ clients/ services/ contact/ about/ og/ social/
docs/
  rebuild-plan.md             the original rebuild plan
  content-update-plan.md      the 2026 content update plan (§ references in code point here)
  source/                     extracted deck + one-pager media, with manifests
```

## Notes

- **Forms are not connected yet** — `contactConfig.formEndpoint` is empty, so the form opens the
  visitor's mail client and says so.
- Media logos are rendered as **text**, not logos; only outlets with a clipping we publish appear
  under "Placements in", and that list is derived from the case studies that are actually live —
  hold a case study back and its outlets disappear with it (plan §3.6).
- The 2021–22 PR placements case study ships as `draft: true` pending owner confirmation that it
  is the team's own work (plan §10 Q5).
- Every image carries `width`/`height` from `media-sizes.js`; heroes are preloaded with
  `fetchpriority="high"`, everything below the fold is lazy.
- `prefers-reduced-motion` disables the hero zoom, reveals, card hovers and modal/menu animations.

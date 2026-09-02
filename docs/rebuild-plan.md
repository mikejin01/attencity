# Attencity — Website Rebuild Plan

**Goal:** rebuild https://attencity.com/ as a static SvelteKit site that keeps this project's
**Editorial template design** (fonts, buttons, colours, section rhythm, motion) and swaps in
Attencity's real pages, copy, and assets.

**Source of truth for content:** this file (copy is reproduced verbatim below) plus the raw
snapshots in [`docs/source/`](source/) (`html/` = full page HTML captured 2026‑09‑02,
`extracted/` = per-page text dumps, `asset-manifest.md` = every downloaded file).

**Assets:** already downloaded and renamed into [`static/assets/attencity/`](../static/assets/attencity/)
(25 files, ~8 MB). Mapping in [`docs/source/asset-manifest.md`](source/asset-manifest.md).

---

## Status — 2026-09-02

Steps 1–9 of §7 are implemented (`pnpm build` clean; five routes + `/blog/` redirect). What still
depends on the §8 answers, and the interim choices made meanwhile:

| Item | Current state |
|---|---|
| Form backend (Q1) | not connected; `contactConfig.formEndpoint` / `.email` in `src/lib/content/attencity.js` switch it on; forms show a visible "not connected yet" note |
| Social URLs (Q2) | all empty → "Follow Us" column hidden (icons for FB / X / YouTube / Vimeo / LinkedIn / Instagram are ready) |
| Contact details (Q3) | contact page shows only "Offices: United States · China" + a pending note; no fake phones/emails/map |
| About copy + team (Q4) | interim intro (hero line + four Why points); team grid built, hidden by `aboutPage.showTeam` |
| Case studies (Q5) | "Case studies coming soon" + three placeholder cards, no post pages |
| "help? How Name" field (Q6) | rendered as **Company** (optional) |
| Plans & pricing (Q7) | dropped from the footer |
| Video hero (Q8) | not built — background photo slider (four Pre-AI Tech Week NYC event photos, crossfade + Ken Burns) in place of the still image |
| Logos (Q9) | white-on-transparent versions cut from the originals |
| "design and operate" (Q10) | kept verbatim |
| Interim copy | services CTA body, careers body, modal sub-line, case-studies statement, social section title — all flagged `interim: true` in the content file |
| Social video marquee (§4 "remove" list) | **added back** at the user's request (2026-09-02) with eight client-supplied clips in `static/assets/attencity/social/`; needs post URLs + handle |

---

## 0. How to use this plan in a new session

Paste this as the first message of the new session:

> Read `docs/rebuild-plan.md` and follow it. Rebuild the site page by page in the order in
> section 7, keeping the Editorial template design exactly as described in section 2. Ask me
> the open questions in section 8 before touching the contact form, social links, or any
> placeholder copy. Run `pnpm build` after each page.

Everything a fresh session needs is inside the repo: the template code
(`src/lib/editorial/EditorialPage.svelte`, `src/app.css`), the copy (this file), the assets
(`static/assets/attencity/`), and the original HTML (`docs/source/html/`).

---

## 1. What the original site is

| Fact | Detail |
|---|---|
| Platform | WordPress 6.x + **Kubio** block builder (Elementor installed but unused), AIOSEO, WPForms Lite |
| Business | **Attencity** — a brand-authority / PR / marketing agency. Tagline: *"Attention meets City!"* — *"We Build Brand Authority Across Markets."* U.S. + China teams. |
| Real pages (nav) | Home `/` · Services `/services/` · About `/about/` · Case Studies `/blog/` · Contact `/contact/` |
| Leftover WP pages | `/sample-page/` (WordPress default), 3 posts `/lorem-ipsum/`, `/lorem-ipsum-2/`, `/lorem-ipsum-3/`, `/category/uncategorized/` — all placeholder, **do not rebuild** |
| Page titles | "Front Page - Attencity", "Services - Attencity", "About - Attencity", "Case Studies - Attencity", "Contact - Attencity" |
| og:image (all pages) | the logo, `logo-attencity.png` |
| Videos | **None.** The original has no video anywhere (hero is a still image). |
| Original palette (reference only, NOT to be used) | amber accent `#FFC10F`, hero `#202028`, black bands `#000`, light band `#F6F4F3` |
| Original fonts (reference only, NOT to be used) | Poppins (headings/body), Open Sans, Gowun Dodum |
| Original state | Home is finished; Services is half-done (2 of 6 services); About, Contact, Case Studies are still the Kubio theme's **lorem-ipsum placeholders** (see §6). |

---

## 2. Design rules — keep the Editorial template

The rebuild must look like the template with new content, not like the WordPress site.

**Keep exactly (from `EditorialPage.svelte` scoped CSS and `app.css`):**

- **Fonts:** `Barlow Condensed` for display headings (bold, uppercase, tight), `Inter` for body/buttons/labels. Google Fonts link already in `src/app.html`.
- **Palette (`.sora` tokens):** ink `#141416`, ink-soft `#55555b`, ink-faint `#86868b`, bg `#ffffff`, bg-alt `#f2f2f4`, accent orange `#ff5000` (hover `#e04500`, text-safe `#d94400`), dark chrome `#17181b`. The orange accent happens to match the orange in Attencity's own photography (orange desk, orange slice) — keep it.
- **Buttons:** pill (`--btn-radius: 980px`), uppercase Inter, `.14em` tracking; primary = orange fill, outline-light in the dark navbar, white buttons on the hero.
- **Section rhythm:** `page-section` + `padding-sm/md/lg`, alternating white / `#f2f2f4` / dark bands; dark hero at the top, near-black footer at the bottom.
- **Navbar:** headroom behaviour (hides on scroll-down, solid on scroll), logo left, links + outline CTA right, hamburger on mobile.
- **Cards:** the template's rounded image cards (services / why), review cards, FAQ accordion styling.
- **Motion:** hero fade-in, card hover lifts, marquee (if reused), `prefers-reduced-motion` respected.
- **Modal:** the booking modal design in `app.css` (`.theme-editorial` tokens) — repurpose as the **"Get in touch"** contact modal.

**Do not carry over from the original:** Poppins, amber `#FFC10F`, Kubio's shape overlays, WordPress footer credit line ("Created with ❤ using WordPress and Kubio").

**Logo note:** `logo-attencity.png` is a **dark** mark + "ATTENCITY" wordmark on a transparent background (500×500). On the dark navbar/footer it must be inverted (`filter: brightness(0) invert(1)`) or a white SVG/PNG should be requested from the client. Replace `HamiltonLogo.svelte` with an `AttencityLogo.svelte` that takes a `variant="light|dark"` prop. Also cut a square favicon from the mark to replace `static/favicon.svg`.

---

## 3. Site architecture

The template is one page; the original is five. Build a **multi-page SvelteKit site** that shares the Editorial shell.

```
src/routes/
  +layout.svelte          global css + Navbar + Footer + ContactModal
  +page.svelte            Home
  services/+page.svelte
  about/+page.svelte
  case-studies/+page.svelte     (original URL was /blog/ — use /case-studies/, add a /blog/ redirect page if old links matter)
  contact/+page.svelte
src/lib/
  content/attencity.js    ALL copy from §4–§5 as data (single source of content)
  editorial/
    editorial.css         the `.sora` scoped styles lifted out of EditorialPage.svelte so every route shares them
    Navbar.svelte, Footer.svelte, AttencityLogo.svelte
    sections/  Hero.svelte, ServiceGrid.svelte, WhyBand.svelte, StatementBanner.svelte,
               ClientLogos.svelte, Insights.svelte, ContactCta.svelte, TeamGrid.svelte,
               ServiceDetail.svelte, ContactInfo.svelte, CaseStudyGrid.svelte, PageHero.svelte
  components/ContactModal.svelte   (renamed ReservationModal — fields in §4.8)
```

`+layout.js` already sets `prerender = true` and `trailingSlash = 'always'`; keep both (GitHub Pages).

Step one of implementation is a **refactor, not a rewrite**: split `EditorialPage.svelte` into the components above with zero visual change (verify against the current build), then replace content section by section.

---

## 4. HOME — content and section mapping

Original order → template section to reuse. Copy is verbatim from the live site (typos preserved where noted).

### 4.1 Navbar
- Logo (inverted white) → `/`
- Links: **Home** `/` · **Services** `/services/` · **About** `/about/` · **Case Studies** `/case-studies/` · **Contact** `/contact/`
- CTA (template's outline button, replaces "Book a Car"): **Get in touch** → opens contact modal (or `/contact/`).
- The original has no header button; adding the template's CTA is intentional.

### 4.2 Hero  *(template: dark video hero → dark image hero)*
- Background: `hero-brooklyn-bridge-street.jpg` (1600×1067, Manhattan Bridge from DUMBO at dusk) as a full-bleed cover with the template's dark overlay and slow Ken Burns zoom (the template already supports a poster image when no video is present). Original used it small/contained on `#202028` with `hero-orange-slice-accent.png` (768×1000) in the bottom-right on mobile — optional accent, not required.
- H1: **Attention meets City!**
- Sub: **We Build Brand Authority Across Markets.** Attencity helps brands turn visibility into trust and trust into long-term brand assets.
- Buttons: **Get in touch** (primary → contact modal) · **View Services** (ghost → `/services/`)
- Original hero used an `<h2>`; make it the page's `<h1>`.

### 4.3 Services for Company  *(template: "Services" image-card section, extended to a 3×2 grid)*
- Eyebrow: **Services for Company**
- H2: **We design brand systems that scale across markets, media, and distribution channels.**
- Button: **View Services** → `/services/` (original wrongly linked to `/contact/`)
- Six cards. Original cards have no images — a bold orange `>` chevron precedes each title (keep that as the card mark, in Barlow Condensed). Original listed "Media & Public Relations" **twice** (7 cards) — render 6.

| # | Title | Body |
|---|---|---|
| 1 | **Brand Strategy and Localization** | Entering a new market requires more than visibility — it requires relevance. Attencity helps brands redefine their positioning, narrative, and communication for local audiences. We build culturally grounded brand strategies that enable companies to be understood, trusted, and adopted in new markets. |
| 2 | **Media & Public Relations** | We treat PR as a long-term brand asset, not a one-time exposure. Attencity develops structured media strategies that combine storytelling, press coverage, and credibility-building to move brands from attention to authority. |
| 3 | **Social Media & influencer marketing** | Social presence is built through consistent narrative and community engagement. We design platform-specific strategies, manage creator collaborations, and develop content ecosystems that strengthen brand visibility and social credibility. |
| 4 | **E-commerce Growth** | E-commerce performance is driven by the alignment of product positioning, content narrative, and platform-native distribution systems. Attencity design and operate commerce strategies that integrate marketplace positioning, content-to-conversion funnels, and creator-led distribution to drive scalable sales growth across Amazon and TikTok Shop. *(sic: "Attencity design")* |
| 5 | **Events & Activations** | Experiences create momentum. Attencity plans and executes events that connect brands with media, creators, and local communities — turning offline moments into scalable brand exposure. |
| 6 | **GEO & AI Distribution** | As discovery shifts to AI-driven platforms, brand visibility requires new distribution strategies. Attencity helps brands structure content and positioning for AI search, ensuring consistent presence across emerging discovery channels. |

- Two stray text blocks reading just "attencity" exist in the original (leftover placeholders) — drop them.

### 4.4 Why ATTENCITY  *(template: dark "Why choose us" band)*
- Layout in original: big image left, heading + four icon items right.
- Image: `why-attencity-billboard.png` (1978×2560, portrait collage of an Attencity billboard on a city street; 5.8 MB — compress to WebP ≤ 400 KB before launch).
- Eyebrow/H2: **Why** / **ATTENCITY** (original: h2 "Why" + h3 "ATTENCITY" stacked; render as one display heading "Why Attencity").
- Four items (Font Awesome icons in original: rocket, gift, coffee, magic — pick 4 line icons in the template's style):

| Icon | Title | Copy |
|---|---|---|
| rocket | **Media & Influencer Reach** | We combine PR, social, AI distribution, and real-world activations to help brands enter new markets and build long-term credibility |
| gift | **Real-World Activation Experience** | Access to 1,000+ media outlets and 5,000+ creators across the U.S. and global markets |
| coffee | **Cross-Market Localization** | U.S. and China-based teams delivering culturally grounded storytelling |
| magic | **From Attention to Authority** | Our methodology turns visibility into long-term brand assets |

- Use the template's four dark cards (icon replacing the photo) or a 40/60 image + list split; keep the dark band and card styling either way.

### 4.5 Services for Individual  *(template: "About / statement banner")*
- Light band (`#f2f2f4` in template; original used `#F6F4F3`).
- H2: **Services for Individual**
- Body: We help high-profile individuals—including founders, creators, artists, and public figures—build structured narrative, media, and social distribution systems that ensure consistent visibility, credibility, and long-term authority across platforms.
- Image: `services-individual-city-glass.png` (1047×472, low-angle glass skyscrapers). 920 KB PNG — convert to WebP.
- Button: **View services** → `/services/` (original button had no link).

### 4.6 Our Happy Clients  *(template: no equivalent — new logo strip on the dark band; reuse the social-marquee track or a static 6-up grid)*
- H2: **Our Happy Clients**
- Sub: Trusted by brands across markets that value long-term authority, not short-term visibility.
- Logos (grayscale/white on dark, equal height): `client-tcl.png` (TCL), `client-hisense.jpg` (Hisense), `client-gongcha.png` (Gong cha), `client-rokid.jpg` (Rokid, black square), `client-apothe.png` (APOTHE), `client-primebot.png` (PRIMEBOT, colour).
- Original band is `#000`; use the template's `--dark` `#17181b`. JPG logos have white boxes — apply `mix-blend-mode: screen` or request transparent versions (§8).

### 4.7 Insights  *(template: statement banner, light)*
- H2: **Insights**
- Body: We help companies build structured brand visibility, media positioning, and AI-era distribution systems that strengthen market credibility, improve discoverability across search and generative platforms, and drive long-term business growth through integrated PR, GEO, content, and digital reputation strategies.
- Original shows no posts here. Optional: add the three case-study cards (§5.4) beneath with a "View Case Studies" link once real case studies exist.

### 4.8 Contact info  *(template: full-bleed "Stay in the loop" CTA image section + the modal form)*
- Background: `contact-bg-woman-city-reflection.png` (1648×965, woman on the phone reflected in glass) with the template's dark overlay; original also used `background-attachment: fixed`.
- Eyebrow: **contact info** (render as "Contact")
- H2: **Find a better solution for your business**
- Form (WPForms on the original; labels verbatim): **Name \*** (text) · **Email \*** (email) · **help? How Name** (text — a mislabelled field, almost certainly meant to be "Company" or "Phone"; ask, §8) · **How can we help?** (textarea) · **Submit**
- Implement as the template's modal fields (Name, Email, Company, Message) inline in this section **and** in the "Get in touch" modal. Needs a form backend (§8).

### 4.9 Footer  *(template footer, near-black)*
- Wordmark/logo (white) → `/`
- **Menu:** Home · Services · About · Case Studies · Contact (original had Home / Clients / Case Studies all linking `#`; use real routes)
- **Useful links:** Plans & pricing (no such page — drop or point to `/contact/`, §8) · Contact
- **Follow Us:** Facebook · Twitter/X · YouTube · Vimeo — all four have **no URL** on the original (§8)
- Copyright: **© 2026 Attencity.** (drop "Created with ❤ using WordPress and Kubio")

### Template sections with no Attencity equivalent → remove
Featured fleet cards · Customer reviews · FAQ accordion · Visit/hours/map on home · Social video marquee (unless reused for logos) · Newsletter form (replaced by the contact CTA). Also delete the Hamilton assets (`static/assets/demo-images/`, `static/assets/videos/`, ~270 MB) once nothing references them.

---

## 5. INNER PAGES

Each inner page = Navbar → compact page hero (template hero style, ~50vh, page title) → sections → Footer.

### 5.1 `/services/`  — title "Services - Attencity"
- Page hero: **Services**, background `why-attencity-billboard.png` (original) — or reuse the Brooklyn hero image for consistency.
- The original details only **two** services; the other four exist only as home-page cards. Build the page as **six** alternating detail blocks (template's image-card/statement styling), using the card copy from §4.3 for the four that have none, and flag for the client to supply "Outcome" lines.

| Service | Description | Outcome |
|---|---|---|
| **Brand Strategy and Localization** | We define how a brand is positioned, perceived, and adapted across different markets and audiences. | A clear, consistent brand narrative that adapts across markets without losing identity. |
| **Media and Public Relations** | We design and execute media systems that build third-party credibility and narrative authority. | Credibility that is externally validated, not self-proclaimed. |
| Social Media & influencer marketing | *(use §4.3 card copy)* | *(client to supply)* |
| E-commerce Growth | *(use §4.3 card copy)* | *(client to supply)* |
| Events & Activations | *(use §4.3 card copy)* | *(client to supply)* |
| GEO & AI Distribution | *(use §4.3 card copy)* | *(client to supply)* |

- Decorative background on the original blocks: `services-lightbulbs-illustration.png` (400×322, hanging light-bulb line art) — optional accent.
- Closing CTA band: **Have any questions?** — body on the original is lorem ipsum; replace with e.g. "Tell us about your market, your product, and where you want to be seen." (§8) — button **Contact us** → `/contact/`.

### 5.2 `/about/`  — title "About - Attencity"  ⚠ entirely Kubio placeholder content
- Page hero: **About**
- Intro (original structure: H4 "We weren't joking:", H1 "Our team is the best.", image `about-hero-desk-orange.jpg` (1325×800, orange desk flat-lay), four lorem-ipsum paragraphs).
  - Proposed interim copy until the client supplies real text: reuse the four "Why Attencity" points (§4.4) and the hero sub-line as the intro paragraphs; keep the image.
- **Our team** — six 500×500 B&W portraits `team-1.jpg … team-6.jpg` with placeholder names/roles: John Doe (web designer), Jane Doe (Marketing Specialist), Mary Smith (CEO), Christina Doe (designer), John Smith (developer), Michael Doe (developer), each with lorem bios. **Build the grid (template review-card style) but ship it only if real team data arrives; otherwise hide the section.**
- Careers band: eyebrow **careers & available jobs**, H2 **We're looking for a new colleague!**, lorem body, button **Contact us** → `/contact/`. Keep structure, replace body (§8).

### 5.3 `/contact/`  — title "Contact - Attencity"  ⚠ contact details are theme placeholders
- Page hero: **Contact**
- Contact info (template's "Visit" contact card): **Phone** (843) 524-2396 · (757) 428-2651 — **email** example@email.com (mailto: office@yourcompany.com) · office@email.com (mailto: career@yourwebsite.com) — **location** 167th High Springs, Florida, 32643 · Riverwind Port Royal, South Carolina(SC). **All fake — must be replaced (§8).**
- **You can find us here** + lorem paragraph + `contact-map.jpg` (2136×1398, stylised dark-blue Florida map). Replace with an embedded map of the real office or drop.
- **Send us a message** — original literally says "A contact form can be added here." → put the real form here (same fields as §4.8).

### 5.4 `/case-studies/`  — title "Case Studies - Attencity"  ⚠ placeholder posts
- Listing of three posts, all titled "Lorem ipsum" with the excerpt "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore[…]", images `case-study-1.jpg` (tablet sign-up form), `case-study-2.jpg` (two people at a laptop), `case-study-3.jpg` (man in VR headset dissolving), all 1198×937 B&W.
- Build the listing grid (template card style) with the three cards as clearly-marked placeholders; **no individual post pages** until real case studies exist. Consider a "Case studies coming soon" statement instead (§8).

---

## 6. Placeholder / broken content inventory (from the original)

| Where | Problem | Plan |
|---|---|---|
| Home services | "Media & Public Relations" card duplicated; two stray "attencity" text blocks | Render 6 unique cards, drop strays |
| Home "View Services" | links to `/contact/` | → `/services/` |
| Home "View services" (individual) | no link | → `/services/` |
| Home form | field labelled "help? How Name" | Ask; default to "Company" |
| Footer links | Home/Clients/Case Studies/Plans & pricing/Contact all `#` | Real routes; drop "Plans & pricing" |
| Footer social | Facebook/Twitter/YouTube/Vimeo with empty hrefs | Ask for URLs; hide icons without one |
| Services page | only 2 of 6 services; lorem in "Have any questions?" | Six blocks; new CTA copy |
| About page | 100 % lorem + "John Doe" team | Interim copy from home; hide team until real |
| Contact page | fake phones/emails/addresses; Florida map | Ask for real details |
| Case Studies | 3 lorem posts | Placeholder grid or "coming soon" |
| Image alt text | every image has `alt=""` | Write real alt text during rebuild |

---

## 7. Implementation order

1. **Refactor the template into shared components** (§3) with zero visual change; add `content/attencity.js`; move `.sora` CSS to `editorial.css`. Verify `pnpm build` and compare against the current page.
2. **Logo + favicon** (`AttencityLogo.svelte`, inverted variant, favicon from the mark), update `app.html` meta description/theme-color, per-route `<title>` + description.
3. **Home** §4.1–4.9 top to bottom. Convert the two big PNGs to WebP.
4. **Contact modal** repurposed (fields §4.8) wired to the chosen backend; inline form on home + contact page.
5. **Services** §5.1.
6. **About** §5.2 (interim copy, team hidden behind a flag).
7. **Contact** §5.3 (placeholders clearly marked until real data).
8. **Case Studies** §5.4.
9. **Cleanup:** delete Hamilton demo images/videos, `HamiltonLogo.svelte`, unused CSS; README update.
10. **QA:** `pnpm build` clean, every internal link resolves, 375/768/1280 px layouts, keyboard nav for modal/menu, reduced-motion, Lighthouse ≥ 90 on performance/accessibility, no image > 400 KB.

Suggested meta description (from the original's AIOSEO auto-text): *"Attencity helps brands build authority across markets — brand strategy and localization, media and PR, social and influencer marketing, e-commerce growth, events, and GEO/AI distribution."*

---

## 8. Open questions for the client / user (ask before building the affected part)

1. **Contact form backend** — static hosting has no server. Options: Formspree / Basin / Web3Forms (free tier), Google Form embed, or `mailto:`. Which?
2. **Social URLs** for Facebook, Twitter/X, YouTube, Vimeo (all empty on the original). Any others (LinkedIn, Instagram, TikTok, Xiaohongshu)?
3. **Real contact details** — phone, email, office address(es) (U.S. and China?) — and whether to show a map.
4. **About page copy and team** — real story + team names/roles/photos, or hide the team section? *(Founder section for Lynn Zhang built 2026-09-02 from her public profile; team grid still hidden.)*
5. **Case studies** — any real ones to publish now, or show "coming soon"?
6. Form field "help? How Name" — should it be Company, Phone, or removed?
7. Keep "Plans & pricing" anywhere?
8. Do you want a **video hero**? The original has none; the template supports one (drop an MP4 at `static/assets/attencity/hero.mp4`).
9. Transparent/white versions of the client logos and the Attencity logo, if available.
10. "Attencity design and operate…" — fix grammar to "designs and operates"? (and other light copy edits)

---

## 9. Reference: template → Attencity section map (cheat sheet)

| Template section (EditorialPage.svelte) | Attencity use |
|---|---|
| `navbar` | same, links §4.1, CTA "Get in touch" |
| `page-header` hero (video) | image hero §4.2 |
| `#fleet` featured cards | **remove** |
| `#about` statement banner | Services for Individual §4.5 / Insights §4.7 |
| `#services` image cards | Services for Company grid §4.3 |
| `#why` dark cards | Why Attencity §4.4 |
| `#reviews` | **remove** (card style reused for team grid on About) |
| `#faq` | **remove** |
| `#contact` visit/map | Contact page info block §5.3 |
| `#social` marquee | optional client-logo strip §4.6 |
| `#newsletter` full-bleed CTA | Contact CTA with form §4.8 |
| `site-footer` | footer §4.9 |
| `ReservationModal` | `ContactModal` §4.8 |

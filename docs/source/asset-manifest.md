# Attencity — Source Asset Manifest

Every media file served by https://attencity.com/ (captured 2026-09-02), downloaded and renamed
into `static/assets/attencity/`. Original filenames are kept here for traceability.
WordPress also served resized variants (`-300x150`, `-768x346`, `-scaled`, …); only the
largest original of each was kept.

| Local file | Original URL (`https://attencity.com/wp-content/uploads/…`) | Size (px) | Used on | Notes |
|---|---|---|---|---|
| `logo-attencity.png` | `2026/05/attencity-logo-5.png` | 500×500 | header, footer, og:image (all pages) | dark mark + wordmark, transparent bg — needs inversion on dark chrome |
| `hero-brooklyn-bridge-street.jpg` | `2026/05/unsplash-IRkAbNRT_Yg.jpg` | 1600×1067 | home hero background | Unsplash photo, Manhattan Bridge from DUMBO |
| `hero-orange-slice-accent.png` | `2023/04/mae-mu-4-unsplash.png` | 768×1000 | home hero, mobile breakpoint bg | Kubio theme stock image |
| `why-attencity-billboard.png` | `2026/05/未命名的设计-9-scaled.png` | 1978×2560 | home "Why ATTENCITY"; services page hero bg | Canva export ("Untitled design 9"); 5.8 MB — compress. The unscaled 2898×3750 (15 MB) original also exists at `…/未命名的设计-9.png` and was not added to the repo |
| `services-individual-city-glass.png` | `2026/05/city-e1778130447995.png` | 1047×472 | home "Services for Individual" | 920 KB — convert to WebP |
| `contact-bg-woman-city-reflection.png` | `2026/05/kubio-image-83.png` | 1648×965 | home contact section background | |
| `services-lightbulbs-illustration.png` | `2026/05/kubio-image-48.png` | 400×322 | services page, block backgrounds | line-art light bulbs, Kubio stock |
| `about-hero-desk-orange.jpg` | `2023/04/adomas-aleno-unsplash.jpg` | 1325×800 | about intro | Kubio theme stock |
| `team-1.jpg` … `team-6.jpg` | `2023/04/team1.jpg` … `team6.jpg` | 500×500 | about "Our team" | Kubio theme stock portraits (placeholders) |
| `contact-map.jpg` | `2023/04/map.jpg` | 2136×1398 | contact page | stylised Florida map (placeholder) |
| `case-study-1.jpg` | `2023/04/blog1.jpg` | 1198×937 | case studies listing (post "Lorem ipsum" → `/lorem-ipsum-3/`) | placeholder |
| `case-study-2.jpg` | `2023/04/blog2.jpg` | 1198×937 | case studies listing (→ `/lorem-ipsum-2/`) | placeholder |
| `case-study-3.jpg` | `2023/04/blog3.jpg` | 1198×937 | case studies listing (→ `/lorem-ipsum/`) | placeholder |
| `client-tcl.png` | `2026/06/000100.SZ_.D-506e32aa.png` | 1552×486 | home clients | TCL logo, grey on white |
| `client-hisense.jpg` | `2026/06/Hisense-logo.jpg` | 500×250 | home clients | white box |
| `client-gongcha.png` | `2026/06/3317ca41c12aa6286be7f24dcee481db.png` | 1034×329 | home clients | Gong cha 貢茶 |
| `client-rokid.jpg` | `2026/06/channels4_profile.jpg` | 900×900 | home clients | black square, white wordmark |
| `client-apothe.png` | `2026/06/395999a1c96223bc77c99358b06c4136.png` | 1002×255 | home clients | |
| `client-primebot.png` | `2026/06/11-e1705066693455.png` | 350×98 | home clients | colour logo, low-res |

Not downloaded (not content): Kubio shape overlays (`/wp-content/plugins/kubio/lib/shapes/…`),
WPForms spinner SVG, WordPress emoji, theme CSS/JS. No video, audio, or PDF files exist on the site.

Icons used on the original (Font Awesome 4 names, inline SVG): `rocket`, `gift`, `coffee`,
`magic` (Why section) and `facebook-square`, `twitter-square`, `youtube-square`,
`vimeo-square` (footer).


---

## Processed for the build (2026-09-02)

The site ships optimised derivatives from `static/assets/attencity/`; the source files above
that were superseded now live in `docs/source/originals/` (git-tracked, not deployed).

| Shipped file | Derived from | Notes |
|---|---|---|
| `logo-lockup-light.webp`, `logo-lockup-dark.webp` (480×124, lossless) | `logo-attencity.png` | **superseded 2026-09-02** — header/footer now use `AttencityLogo.svelte` (inline SVG mark traced from the PNG with potrace + live-text Montserrat 700 wordmark, subset via Google Fonts `text=`); files kept but unreferenced |
| `events/pre-ai-tech-week-nyc-1..4.webp` (1536 wide, q85, 125–229 KB) + `-800.webp` siblings (q82, 45–66 KB) | `events/pre-ai-tech-week-nyc-1..4.png` (client-enhanced, 1536×1024, ~2 MB each; numbering differs from the earlier JPG batch: 1 = audience, 2 = stage group) | home hero slider via `srcset`; the PNG originals (8.7 MB) sit beside them unused and should move out of `static/` before launch |
| `founder-lynn-zhang.webp` (1080×1080, q85) | client JPG | About → founder section |
| `*-800.webp` (hero-brooklyn…, services-individual…, why-attencity…, contact-bg…, case-study-2) | the full-size WebPs | 800px-wide `srcset` candidates for phones |
| `og-image.png` (1200×630) | lockup | dark card with the white lockup, used for Open Graph |
| `/favicon.png` (64), `/apple-touch-icon.png` (180), `/icon-512.png` | the mark | white mark on a `#17181b` rounded square |
| `hero-brooklyn-bridge-street.webp` (1600×1067, 179 KB) | `.jpg` | q80 |
| `why-attencity-billboard.webp` (1236×1600, 116 KB) | `.png` 1978×2560, 5.7 MB | resized + q78 |
| `services-individual-city-glass.webp` (69 KB) | `.png` 898 KB | |
| `contact-bg-woman-city-reflection.webp` (147 KB) | `.png` | |
| `about-hero-desk-orange.webp`, `case-study-{1,2,3}.webp`, `team-{1..6}.webp` | `.jpg` | |
| `clients/{tcl,hisense,gongcha,rokid,apothe,primebot}.png` (height 160) | `client-*.{png,jpg}` | white-on-transparent cut from the originals (luminance → alpha; TCL/PRIMEBOT from their own alpha) |

Not shipped (kept in `originals/`): `contact-map.jpg` (placeholder Florida map),
`hero-orange-slice-accent.png`, `services-lightbulbs-illustration.png` (Kubio stock art).

### Social clips (added 2026-09-02, supplied by the client)

`docs/source/originals/social/attencity-social-{1..8}.mp4` are the files as delivered (H.264, 720×1280
or 360×640, 5–53 s, AAC audio, 32 MB total). Shipped versions in `static/assets/attencity/social/`
have the audio stripped, faststart set, and were re-encoded (libx264 CRF 27, ≤720px, 30 fps) where
that saved more than 20 %; each has a `.webp` poster frame taken at 0.5 s. Post URLs per clip are
not known yet (plan §8 Q2) — see `home.social.clips` in `src/lib/content/attencity.js`.

### Service card photos (2026-09-02)

`static/assets/attencity/services/{brand-strategy,media-pr,social-influencer,ecommerce,events,geo-ai}.webp`
are single frames pulled from the client's social clips (clip 1 @ 13.1 s and 16.8 s, clip 8 @ 20.7 s,
clip 2 @ 11.2 s, clip 7 @ 17.4 s, clip 6 @ 10.0 s), 720 px wide except `media-pr.webp`, whose source
clip is 360×640. Used by the home "Services for Company" cards.

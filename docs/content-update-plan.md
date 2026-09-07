# Attencity — Content Update Plan (v2, 2026-09-07)

**Goal:** turn the current five-page rebuild into a complete, SEO-ready agency site using the
business owner's feedback, the **2026 one-pager**, and the **31-slide 2026 Business Deck**.
This plan supersedes the "open questions" section of [`rebuild-plan.md`](rebuild-plan.md); the
design rules in that file's §2 still apply unchanged (Editorial template: Barlow Condensed +
Inter, orange `#ff5000`, dark hero, near-black footer).

> **Status — implemented 2026-09-07.** Phases 1–9 of §9 are built and the site prerenders 26
> routes with a clean `pnpm build`. What is *not* done, because it needs the owner: the Flodesk
> relay is written and documented (`infra/lead-worker/`) but not deployed, so
> `contactConfig.formEndpoint` is still empty and forms fall back to `mailto:`; there is no GA4
> id yet (`site.analytics.ga4Id`); the WeChat QR is hidden and the 2021–22 PR placements case
> study ships as `draft: true` (§10 Q3, Q5). Everything else in §10 was taken at its default —
> see the end of this file for the list of assumptions. Implementation notes live in
> [`../README.md`](../README.md).

**Sources of truth (all in the repo):**

| Source | Where | What it gives us |
|---|---|---|
| Owner comments (Chinese, 2026-09-07) | §1 below (translated) | 5 required changes |
| One-pager PDF | `docs/Attencity one pager 2026.pdf` | address, phone, email, social handles, 7-service list, "Who we are" + "Why us" copy |
| Business Deck (EN) | `docs/Business Deck/*.png` (31 rendered slides) | all long-form copy: vision, methodology, network, clients, 5 events, 7 case studies |
| **Deck media, extracted** | **`docs/source/deck-media/`** (269 files, 58 MB, `manifest.csv` + `README.md`) | full-resolution photos (up to 3808 px) and every logo, named `sNN-KK-imageXXX.ext` by slide |
| One-pager media, extracted | `docs/source/onepager-media/` | QR codes (WeChat / Instagram / RedNote) + two event photos |
| Current site copy | `src/lib/content/attencity.js` | everything that already ships |

---

## 0. How to start the next session

Paste this as the first message:

> Read `docs/content-update-plan.md` and follow it. Work through the phases in §9 in order,
> running `pnpm build` after each phase. Content comes from §3 (facts) and §5 (page specs);
> images come from `docs/source/deck-media/` as mapped in §7. Both blocking questions in §10
> are already answered (Flodesk; communications@attencity.com); for every other question use
> the default written next to it and list what you assumed at the end.

---

## 1. Owner feedback (translated) → decision

| # | Comment (original) | Meaning | Decision |
|---|---|---|---|
| 1 | CTA：最好留资加上 - 具体提问题的时候，比如：你从哪里听说我们的、你的job title这两个常见问题，方便我们分析来源，做后续渠道分析管理。 | Lead form should ask **"How did you hear about us?"** and **"Job title"** so leads can be analysed by channel. | Add both as required selects (with "Other") to every form instance, plus hidden channel fields (UTM, referrer, page). Spec in §6. |
| 2 | CTA后台最好打通我们newsletter的database，自动流入客户资产池 | Form submissions should flow automatically into the **newsletter database** (customer asset pool). | The newsletter tool is **Flodesk** (confirmed 2026-09-07). Build a small relay that emails the team **and** upserts every lead into Flodesk via its API with job-title / channel custom fields and segments. Spec in §6.3–6.4. |
| 3 | service的每个小板块都是跳转到同一个页面的话没必要每个都放learn more。后续我们针对每个页面有单独的二级页面可以设置 | Per-card "Learn more" is pointless while all cards go to the same page; keep it once each service has its own sub-page. | Build **7 dedicated service pages** now (`/services/<slug>/`). Cards keep "Learn more" and link to them. The deck has enough proof content (events, PR placements, influencer parties) to make them real pages, not stubs. |
| 4 | case study如果暂时没内容就不放 | If there are no case studies yet, don't show the section. | The deck **does** contain seven real case studies and five event recaps, so we **populate** `/case-studies/` instead of hiding it, and remove the three lorem placeholder cards. A `caseStudiesPage.enabled` switch hides the nav item + page if the owner still prefers to wait. |
| 5 | contact把官方的社交媒体账号和公司地址放上去（for authority） | Put official social accounts and the company address on Contact (authority signal). | Contact page + footer get the NYC address, phone, email, Instagram, TikTok, Xiaohongshu (RedNote), WeChat QR, an embedded map, and `LocalBusiness` structured data. |

### Owner's open question: separate landing pages for services / past events, or a blog?

**Decision: both, with one content system.**

- **Service landing pages** (7) target *commercial* searches ("PR agency New York", "TikTok Shop
  growth agency", "generative engine optimization agency"). These are the pages that convert.
- **Case studies** (`/case-studies/<slug>/`) are client-branded projects with numbers (attendance,
  placements, reach). They are proof for the service pages and rank for brand + event names
  ("Beauty & Beyond pop-up NYC", "Ellicor grand opening").
- **Insights** (`/insights/<slug>/`, the blog) hold event recaps and partnership news (CES Speed
  Award, Shanghai Day at Lincoln Center, F4D Luncheon, Post-80s at the UN, NYU festival) plus
  future thought-leadership (GEO explainers, US-market-entry guides). This is the page type that
  earns *ongoing* organic traffic; Google rewards a site that keeps publishing.
- Past events that are **client work** become case studies; past events where Attencity was
  **media partner / co-organiser** become Insights posts. One markdown content model
  (`type: case-study | insight`) feeds both listings, so writing a new entry is a single `.md` file.

---

## 2. Image source decision: PPTX, not the Canva site

- **PPTX** (`docs/[EN] Attencity 2026 Business Deck v1.pptx`) contains 269 media files with
  original resolution (event photos 1400–3800 px wide) and a per-slide relationship map. They are
  **already extracted** to `docs/source/deck-media/` with `manifest.csv` (slide, file, size, kind)
  and `README.md` (captions and intended use). Nothing further is needed from Canva.
- **Canva site** (`https://panda-533bq0.my.canva.site/`) is JavaScript-rendered, exposes no
  image URLs in its HTML, and its title is **"[CN] Attencity 2026 Business Deck"** — the Chinese
  edition. Keep the link as the source for a future `/zh/` version (§8.7).
- The 31 rendered slide PNGs in `docs/Business Deck/` (92 MB) and the PPTX (62 MB) are
  **untracked** in git. Recommendation: keep them local and add both to `.gitignore`; the
  repo already holds the extracted originals, which is what the build needs. (Owner/dev call —
  not changed in this session.)

---

## 3. Facts extracted (single source for copy)

### 3.1 Company identity

| Field | Value | Source |
|---|---|---|
| Legal name | **Attencity Marketing LLC** (one-pager) / "Attencity LLC" (one-pager body) | confirm which to print in footer (§10 Q6) |
| Positioning | "Your Full-service Marketing Agency" · "Your long-term partner for cross-market, cross-city growth" · "Helping brands localize deeply and grow sustainably in global markets" | one-pager, deck s1 |
| Tagline | Attention Meets City! | all |
| Address | **411 West 35th Street, 6th Floor, New York, NY 10001** | one-pager p1, deck s31 |
| Phone | **+1 (332) 999-3472** | one-pager, deck s31 |
| Email | **communications@attencity.com** (confirmed 2026-09-07 from the sender address of past newsletters; deck s31's "communication@" is a typo) | one-pager, newsletter |
| Website | www.attencity.com | |
| Instagram | **@attencitymarketing** → `https://www.instagram.com/attencitymarketing/` | deck s28, s31 |
| TikTok | **@attencity_marketing** → `https://www.tiktok.com/@attencity_marketing` | deck s31 |
| Xiaohongshu / RedNote | account name **纽约搞事小组**, Xiaohongshu ID **6782513500** (profile URL still needed, §10 Q3); QR card in `docs/source/onepager-media/qr-xiaohongshu-nyc-gaoshi-xiaozu.jpg` | deck s31, one-pager QR |
| WeChat | only a **personal** "add friend" QR exists (account "Icelynn", `docs/source/onepager-media/qr-wechat-icelynn.jpg`) — publish only if the owner agrees (§10 Q3) | one-pager |
| Founded | New York, 2023 (already on About) | previous session |
| Key partnership | **Shanghai Media Group (SMG)** — Attencity is SMG's official strategic partner in North America; since 2024 "SMG × Attencity" is CES's sole official Chinese-language media partner | deck s15–s19 |

### 3.2 Services (one-pager order and naming — use these as canonical titles)

| # | Title | One-pager blurb | Existing long copy (site) |
|---|---|---|---|
| 1 | **Brand Strategy & Localization** | From positioning to storytelling — building culturally relevant brands that resonate across markets. | `services[0].summary/description/outcome` |
| 2 | **Media & PR** (one-pager: "Media & PR Marketing") | Developing strategic media narratives that turn brand visibility into long-term credibility and authority. | `services[1]` + deck s21 "Our Strategy & Mission (PR)" paragraph |
| 3 | **Social Media & Influencer Marketing** | City-focused content and influencer collaborations that drive engagement. | `services[2]` + deck s29 influencer-parties copy |
| 4 | **GEO (Generative Engine Optimization)** | Monitor, optimize, and grow your visibility across AI search and recommendation ecosystems. | `services[5]` ("GEO & AI Distribution") |
| 5 | **E-commerce Growth** | Accelerate scalable growth across Amazon and TikTok Shop. | `services[3]` (fix "Attencity design and operate" → "designs and operates") |
| 6 | **Events & Activations** (one-pager: "Event Planning") | Creative concepts, seamless execution — events that leave a mark. | `services[4]` + deck s23 pop-up copy + s30 |
| 7 | **Personal Branding** (for individuals; one-pager: "Personal branding building") | Building visibility, credibility, and influence for founders, creators, artists, and public figures. | `home.servicesIndividual.body` |

Reorder the site's `services` array to this order (GEO moves up to #4) and add #7 as a full
service with `audience: 'individual'`.

### 3.3 Proof points (numbers — use consistently everywhere)

| Claim | Value | Source |
|---|---|---|
| Media outlets in network | **1,000+** | one-pager, deck s5 |
| Creators / KOLs in network | **5,000+** | one-pager, deck s5 |
| Events executed | **40+** | one-pager "Why us", deck s23 |
| Brands supported | **50+** | one-pager |
| Event attendees reached | **4,000+** (deck s23; note single events below exceed this — prefer per-event numbers) | deck s23 |
| Media-channel resource library | **600+** channels | deck s23 |
| Press-release distribution | **~600 placements, est. 177M+ potential audience** (SoHo 2024 release: 571 placements / 177M) | deck s23 |
| Influencer parties | **70+ influencers per event** | deck s29 |
| KEDM parties | **300–500+ per event; one drew 2,800+ in 6 hours** | deck s30 |
| CES Speed Award 2026 | 3 forums, 5 award categories, 15 honoured companies (TCL, Hisense, Segway, LumiMind…) | deck s15 |

### 3.4 Copy blocks to reuse verbatim (light proofreading only)

- **Who we are** (one-pager): "Attencity LLC is a New York City–based marketing and
  communications firm specializing in data-driven, culturally intelligent strategies that help
  brands connect with diverse audiences across the global markets. Through a hybrid model of
  project-based engagements and long-term strategic partnerships, we deliver scalable solutions
  that drive visibility, engagement, and cross-border growth."
- **Why us intro** (one-pager): "Attencity combines media, creators, AI-driven distribution, and
  localized market strategy to help companies expand across borders with relevance, credibility,
  and long-term impact." + four points: Global Media & Creator Network · Proven Market Activation
  Experience · Cross-Market Localization · From Attention to Authority (replace the current
  `whyPoints` copy with the one-pager versions — they carry the numbers).
- **Origin of the name** (deck s2): "Attencity comes from 'Attention Meets City'. We believe
  genuine brand influence is born from the connections between people, between people and cities,
  and between brands and society…" (full paragraph on slide 2).
- **Our Purpose / Our Mission** (deck s3): purpose sentence + four mission points ("Built for the
  long run, not a moment of buzz" · "Built around our 4R model…" · "China–US cross-cultural
  localization" · "Hands-on partnership, systematic delivery").
- **Methodology 3A × 4R** (deck s4): 3A = Attention (Being Seen) · Authority (Being Trusted) ·
  Asset (What Lasts); 4R = BR Brand Asset Building · PR Communications Management · CR Channel
  Penetration · IR Investor Relations Management; loop "Seen → Trusted → Built". Rebuild the ring
  diagram in HTML/SVG in the Editorial palette — do not embed the slide.
- **PR strategy** (deck s21) → Media & PR service page intro.
- **Pop-up / offline** (deck s23) and **influencer / KEDM** (s29–s30) → Events and Social pages.

### 3.5 Clients by category (deck s8–s12; logos in `deck-media`, see README for file names)

- **Tech & Electronics:** CES / Consumer Technology Association, Mobvoi, Meitu, Segway, TCL,
  Exumn, Rokid, Hisense, PRIMEBOT, Altair X, Xtand, newtone, Snaplii, SolarLink Energy
  Construction, Screna, LumiMind
- **Lifestyle, Beauty & Skincare:** URIID, NOFLEX, biuty, MC (MiPalette), GOB Gorgeous Beauty,
  edensoft, APOTHE, SAM'U, Ulike, GleaMore, mi
- **Fashion / Art / Entertainment:** Manhattan Elite Club, Artecho, Marbella, SVAI, cozy art
  land, The Rose New York, Lamu, VShow, Kosmera, FINDU, 101 Studios
- **CPG & Retail:** Gong cha, Ellicor, Meirya, Lelecha, HungryPanda (熊猫外卖)
- **Education / Services / Organizations:** hibee, Rigel Atlas, 向美国际, EliteLink Education,
  GYZ Studio, Merlyn for Education, Solo Unicorn Club, iTalkBB, GFM.News, EpicQuest, 經緯竹子
  (New York Bamboo), GAGRO 合抱之木, Brand USA, CSSAEA, Break real, 汉天卫视 (China TV Media
  Group USA)

### 3.6 Network reach (deck s5–s7) — present as *network*, not as *clients*

- **China media:** SMG International, Record China, ENEX, WAM Media Group, STV, 看看新闻, 东方卫视,
  ShanghaiEye
- **US media (network):** WSJ, USA Today, Forbes, Billboard, AP, Variety, Yahoo Finance, Wired,
  Business Insider, NBC, TechCrunch; tech (VentureBeat, Bloomberg Technology, The Verge, TNW,
  IEEE Spectrum, TechRadar, Digital Trends); business (Bloomberg, MarketWatch, CNBC,
  Investopedia, Quartz, Morningstar, Motley Fool); arts (Artforum, ARTnews, The Art Newspaper,
  artnet, frieze, ArtReview, Hyperallergic, Flash Art, Juxtapoz)
- **NGOs / universities / associations:** ~20 Chinese universities' alumni associations, NYU
  CSSA, Columbia CUCSSA, Cornell CSSA, GNY Chinese Association for Science & Technology, Shanghai
  Association in USA, AIRA, AAAA, Manhattan Elite Club, Solo Unicorn Club, New York Chinese
  Cultural Center, Chinese Progressive Association, CAPSC, Creative China Center, 大紐約華人聯合會
- **Evidenced placements** (safe to say "placements in"): The Wall Street Journal and USA Today
  (Shanghai Day, deck s19); Yahoo Finance, Business Insider, MarketWatch, Seeking Alpha,
  Cision/PR Newswire, Boston Herald, Benzinga, AP (paid content), Digital Journal, The Globe and
  Mail, AsiaOne, Barchart (deck s22–s23 screenshots).

> Legal note: third-party media logos on a marketing site are a trademark grey area. Prefer a
> **text list** for the "network" claims and reserve logos for the "placements" strip, and only
> where a screenshot proves it. Ask the owner whether they hold permission for the rest (§10 Q7).

### 3.7 Case studies (client work → `/case-studies/`)

| Slug | Title | Client / partner | Date | Numbers | Photos (deck-media) |
|---|---|---|---|---|---|
| `beauty-and-beyond-k-skincare-popup` | Beauty & Beyond — three-day Korean skincare pop-up | APOTHE + K-beauty brands · AP Space, 555 W 25th St | Dec 5–7, 2025 | 2,000+ attendees; creator-only day 1 | s24-01…05 |
| `mipalette-nyc-popup` | MiPalette custom travel-makeup pop-up | MiPalette (MC) · MEC Gorgeous Beauty, 225 W 34th St | Aug 15, 2026 | 300+ attendees | s25-01…05 |
| `soho-lunar-new-year-valentines-popup` | SoHo Chinese New Year × Valentine's Day pop-up | 30+ vendors, 15+ sponsors · 69 Mercer St | Feb 9–10, 2024 | 8,000+ attendees; 571 placements / 177M reach | s26-01…05, s23-01 |
| `ellicor-grand-opening` | Ellicor grand-opening pop-up toy events | Ellicor × 99 Ranch (LA Westwood, Sugar Land TX, Austin, LA Little Tokyo) | Apr 19–20, 2025 | 7,500+ attendees | s27-01…04, s28-02 |
| `influencer-parties` | Influencer parties (Attencity × StarHub at The Rose NY) | StarHub | 2025 (confirm) | 70+ influencers per event | s29-01…04 |
| `kedm-party-series` | KEDM Party & KEDM After Dark | nightlife series, NYC | recurring | 300–500+ per event; 2,800+ in 6 h | s30-01…03 |
| `cross-border-pr-placements` | Cross-border PR placements (iTalkBB × UnionPay; MOYI × CCB NY; Cypherium; HSIA) | various | 2021–2022 | Business Insider, Boston Herald, Yahoo, MarketWatch, Seeking Alpha, Cision | s22-01…07 |

⚠ The PR placements are dated **2021–2022**, before Attencity's 2023 founding. Publish this
entry only if the owner confirms they are Attencity/team work (§10 Q5). The **Forbes/Noom**
article (s21) is a 2021 Forbes editorial with no visible Attencity link — **do not use** unless
confirmed.

### 3.8 Insights posts (media-partner / co-organiser events → `/insights/`)

| Slug | Title | Date | Photos |
|---|---|---|---|
| `ces-2026-speed-award-china-day` | CES 2026 · Speed Award World Tech Summit · China Day | Jan 6–9, 2026 | s15-01…08 |
| `shanghai-day-lincoln-center-2025` | "Shanghai Day" lights up Lincoln Center's Summer for the City | Jul 26, 2025 | s19-01…06 |
| `f4d-first-ladies-luncheon-2025` | Covering the F4D First Ladies Luncheon during UNGA week | Sep 23, 2025 | s17-01…05 |
| `post-80s-in-the-un-premiere` | "Post-80s in the UN" documentary premieres at UN Headquarters | Sep 2, 2025 | s18-01…04 |
| `nyu-innovation-summit-2025` | NYU Innovation Summit & Startup Competition — great innovation deserves to be seen | 2025 (exact date §10 Q4) | s16-04, s16-07 |
| `pre-ai-tech-week-nyc` | Pre-AI Tech Week NYC (photos already in `static/assets/attencity/events/`) | date §10 Q4 | existing |

Deck typos to fix when porting: "seen by te world" → "the world"; "Texas ugarland" → "Sugar Land,
Texas"; "300+ 人次00+ 人次" → "300+"; "Attencity design and operate" → "designs and operates".

---

## 4. Site architecture (after this update)

```
/                          Home (updated sections, §5.1)
/services/                 Services hub: 7 cards → sub-pages (+ anchors kept for old links)
/services/<slug>/          7 service landing pages (§5.2)
/case-studies/             Listing (filter by service)                         ← was placeholder
/case-studies/<slug>/      7 case-study pages (§5.3)
/insights/                 Listing (blog)                                       ← new
/insights/<slug>/          6 posts to start (§5.4)
/about/                    Who we are · Vision & Mission · 3A×4R · Network · Founder · Careers
/contact/                  Address, phone, email, socials, map, form (§5.6)
/blog/                     301 → /insights/   (currently → /case-studies/; change)
/sitemap.xml, /robots.txt  generated (§8)
```

**Nav:** Home · Services · Case Studies · Insights · About · Contact · [Get in touch].
**Footer:** lockup + address + phone + email · Services (7 links) · Company (About, Case
Studies, Insights, Contact) · Follow (Instagram, TikTok, Xiaohongshu, WeChat) · © line.

**Content system:** add `mdsvex`; posts live in `src/content/case-studies/*.md` and
`src/content/insights/*.md` with frontmatter (`title, slug, type, date, excerpt, hero, gallery[],
services[], client, stats[], seoTitle, seoDescription, lang`). `src/lib/content/posts.js` loads
them with `import.meta.glob`, sorts by date, and exposes `related(serviceSlug)`. Listing pages
link to every entry so the prerender crawler reaches all `[slug]` routes.

---

## 5. Page specs

### 5.1 Home (`/`)

1. **Hero** — keep the event-photo slider and H1 "Attention meets City!". Lead → "Your long-term
   partner for cross-market, cross-city growth." Text → "Helping brands localize deeply and grow
   sustainably in global markets." Buttons unchanged. Add three CES 2026 stage photos to the
   slider pool (s15-01, s15-02, s15-08).
2. **Trust strip (new, thin)** — "1,000+ media outlets · 5,000+ creators · 40+ events · 50+ brands
   · U.S. + China teams".
3. **Services for Company** — six cards (services 1–6 in §3.2 order), each linking to its page;
   "Learn more" stays. Button "All services" → `/services/`.
4. **Why Attencity** — one-pager copy (§3.4) with numbers; keep the billboard image.
5. **Services for Individual** — becomes the **Personal Branding** teaser → `/services/personal-branding/`.
6. **Partners & media (new)** — SMG partnership sentence + CES official-partner sentence, then a
   "Placements in" logo row limited to evidenced outlets (§3.6).
7. **Our clients** — logo marquee grown from 6 to ~24 logos across the five categories (pick the
   crispest files; see §7). Category tabs optional.
8. **Recent work (new)** — three latest case studies (cards) → `/case-studies/`.
9. **Latest insights (new)** — three latest posts → `/insights/` (replaces the "Insights"
   statement block).
10. **Social feed** — keep; set `title` to "@attencitymarketing" and link clips to Instagram.
11. **Contact CTA** — new form (§6).

### 5.2 Service pages (`/services/<slug>/`) — one template, seven data entries

Sections: PageHero (service title, one-line promise, hero photo) → **Overview** (2–3 short
paragraphs from §3.2 sources) → **What we do** (4–6 bullets) → **How it works** (3–4 steps,
mapped to 3A×4R) → **Proof** (2–3 stats + related case studies + related insights) → **FAQ**
(3–5 Q&A; also emitted as `FAQPage` JSON-LD) → **CTA band** with the form modal.

| Slug | H1 / title tag | Primary keyword targets | Proof to pull |
|---|---|---|---|
| `brand-strategy-localization` | Brand Strategy & Localization Agency in New York | US market entry for Chinese brands, brand localization agency, cross-border brand strategy | vision/mission copy, Ellicor, Gong cha logos |
| `media-pr` | Media & PR Agency for Cross-Market Brands | PR agency New York, Chinese-language media partner, press release distribution US, SMG partner | s21 copy, WSJ/USA Today (Shanghai Day), placements case study, 1,000+ outlets |
| `social-influencer-marketing` | Social Media & Influencer Marketing Agency NYC | influencer marketing agency New York, KOL marketing US, creator campaigns | 5,000+ creators, influencer parties (70+/event), s5 US-influencer roster (names only) |
| `geo-generative-engine-optimization` | GEO — Generative Engine Optimization Services | generative engine optimization agency, AI search visibility, ChatGPT/Perplexity brand visibility | methodology; thin on proof → write a "what is GEO" explainer post first (owner to supply examples, §10 Q8) |
| `ecommerce-growth` | E-commerce Growth: Amazon & TikTok Shop | TikTok Shop agency US, Amazon launch agency for Chinese brands | Ulike, Ellicor, HungryPanda logos; creator-led distribution copy |
| `events-activations` | Events & Brand Activations in New York | pop-up event agency NYC, brand activation agency New York, product launch event | 40+ events, all pop-up case studies, KEDM, CES |
| `personal-branding` | Personal Branding for Founders, Creators & Public Figures | personal branding agency New York, founder PR, thought-leadership PR | founder speaking photos (NYU, Pre-AI Tech Week), media network |

`/services/` hub keeps the six-block layout as a **summary** (title, one-liner, "Read more") and
adds Personal Branding as the seventh; existing `#slug` anchors stay so old links still land.

### 5.3 Case-study page template

PageHero (title, client, date, location) → **At a glance** stat tiles (attendance, vendors,
sponsors, placements, reach) → **Brief / What we did / Results** (3 short blocks from the deck
copy) → **Gallery** (4–8 photos, lightbox optional) → related service chips → prev/next → CTA.
Emit `Article` JSON-LD (+ `Event` with `eventStatus: EventScheduled` and the past date where
venue/date are known).

### 5.4 Insights post template

PageHero (title, date, "By Lynn Zhang", reading time) → body (mdsvex) → gallery → related
services → CTA. `NewsArticle` JSON-LD with `author` = Person (Lynn Zhang) and `publisher` =
Organization. Listing supports tags (`Events`, `Media`, `GEO`, `Market entry`).

### 5.5 About (`/about/`)

Order: PageHero → **Who we are** (one-pager paragraph + "Attention meets City" origin story from
s2, keep orange-desk image) → **Our purpose & mission** (s3) → **Methodology 3A × 4R** (SVG ring
+ four cards) → **Network reach** (three columns of text lists from §3.6; a few logos where
crisp) → **Founder spotlight** (existing) → **Careers** band. Team grid stays hidden.

### 5.6 Contact (`/contact/`)

Left column: address (with "Get directions" link), phone (`tel:`), email (`mailto:`), hours if
supplied, social links with icons (Instagram, TikTok, Xiaohongshu, WeChat → opens QR in a small
modal), embedded Google Map (iframe `https://www.google.com/maps?q=411+W+35th+St+New+York+NY+10001&output=embed`,
lazy-loaded, with a static fallback link). Right column: the new form. Remove `pendingNote`.
JSON-LD `ProfessionalService` (subtype of LocalBusiness) with `address`, `telephone`, `email`,
`sameAs` (all socials), `areaServed` (US, CN), `founder`.

---

## 6. Lead capture: form fields, delivery, newsletter sync

### 6.1 Fields (same component in modal, home CTA, contact page, service CTAs)

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | text | yes | |
| Work email | email | yes | |
| Company | text | no | |
| **Job title** | select + "Other (please specify)" text | yes | Founder / C-level · Marketing or Brand lead · PR / Communications · E-commerce / Sales · Agency / Partner · Investor · Media / Press · Creator / Public figure · Student · Other |
| **How did you hear about us?** | select + "Other" text | yes | Google / search · Instagram · TikTok · Xiaohongshu (RedNote) · WeChat · LinkedIn · An event (CES, pop-up, party) · Referral / word of mouth · Press or media coverage · AI assistant (ChatGPT etc.) · Other |
| Message | textarea | yes | label stays "How can we help?" |
| Newsletter opt-in | checkbox | no | "Keep me posted on Attencity insights and event invitations" — default **checked** for US audience; unchecked if the owner prefers strict opt-in (§10 Q9) |
| Hidden | — | — | `page`, `form_location` (modal/home/contact/service:slug), `referrer`, `utm_source/medium/campaign/content/term` (read on first page view, kept in `sessionStorage`), `landing_page`, `submitted_at`, `lang` |
| Anti-spam | honeypot + Cloudflare Turnstile (invisible) | — | free |

Analytics: fire GA4 `generate_lead` with `job_title`, `heard_from`, `form_location`.

### 6.2 Storage of the answers (so the owner can analyse channels)

Every submission lands in three places: (1) notification email to the team, (2) **Flodesk** as a
subscriber with custom fields `job_title`, `heard_from`, `source=website`, `utm_*`, and segment
membership, (3) a Google Sheet row (optional but the cheapest "CRM" for channel analysis).
Static hosting cannot do this itself, and the Flodesk API key must never ship in browser code,
hence the relay below.

### 6.3 Delivery: Cloudflare Worker relay (decided)

Flodesk has no native "receive a POST from any form" endpoint and Formspree has no Flodesk
plugin, so a tiny relay is the only single-form solution. Zapier/Make could stand in for the
Worker (Formspree → Zapier → Flodesk) at a monthly cost and with fewer fields; keep that as the
fallback if the owner refuses another account.

```
browser  POST JSON  →  Cloudflare Worker  /lead   (infra/lead-worker/, free tier)
                        ├─ validate + honeypot + Turnstile verify
                        ├─ Resend (or SMTP) → notification email to the team inbox
                        ├─ Flodesk  POST https://api.flodesk.com/v1/subscribers   (upsert by email)
                        └─ Google Sheets Apps Script webhook (optional row per lead)
```

Secrets live in Worker environment variables (`FLODESK_API_KEY`, `RESEND_API_KEY`,
`TURNSTILE_SECRET`, `SHEET_WEBHOOK_URL`, `NOTIFY_TO`). The front end only needs
`contactConfig.formEndpoint = 'https://<worker>.workers.dev/lead'`; the existing JSON POST code
path already handles it. Until the Worker is deployed, keep the honest "not connected" state.

### 6.4 Flodesk mapping (API facts checked 2026-09-07 at developers.flodesk.com)

| Item | Detail |
|---|---|
| Auth | HTTP Basic, API key as username, empty password: `Authorization: Basic base64("<API_KEY>:")`. Key is generated by the owner in Flodesk → Settings → Integrations → API. |
| Upsert | `POST /v1/subscribers` with `{ email, first_name, last_name, custom_fields: {…}, segment_ids: […], double_optin, optin_ip, optin_timestamp }`. Same call creates or updates; `double_optin` only applies on first creation. |
| Custom fields (create once in Flodesk → Audience → Custom fields; reference by **key**) | `job_title`, `heard_from`, `company`, `source` (= `website`), `form_location`, `utm_source`, `utm_medium`, `utm_campaign`, `landing_page`, `last_message_at`, `newsletter_optin` (`yes`/`no`) |
| Segments (create in Flodesk; reference by **id**, fetch once with `GET /v1/segments`) | `Website leads` (every submission — this is the "customer asset pool") · `Newsletter` (only when the opt-in box is ticked; point Flodesk workflows/newsletters at this one) · optional per-channel segments `Source: Instagram`, `Source: TikTok`, `Source: Xiaohongshu`, `Source: WeChat`, `Source: Event`, `Source: Referral`, `Source: Search`, `Source: Press`, `Source: AI`, `Source: Other` (10 ids, well under the 50-per-call cap) |
| Name split | Flodesk wants `first_name` / `last_name`; the form has one Name field → split on the first space, rest to last name. |
| Opt-in evidence | send `optin_ip` (Worker sees `CF-Connecting-IP`) and `optin_timestamp` (ISO 8601) so consent is recorded in Flodesk. |
| Double opt-in | default `false` (single opt-in, US audience). If the owner wants confirmation emails, set `double_optin: true` for the `Newsletter` segment path only (§10 Q9). |
| Rate limit | 100 requests/minute on `POST /subscribers` — irrelevant at contact-form volume; retry once on 429/5xx, and still send the team email if Flodesk fails so no lead is lost. |
| Message body | Flodesk custom fields are not for long text; keep the enquiry message in the email + Sheet row only. |
| Status | API-created subscribers show as `active` (or `unconfirmed` when double opt-in is on); the owner can filter the `Website leads` segment by any custom field inside Flodesk for channel analysis. |

---

## 7. Assets: what to take from `docs/source/deck-media/` and where it goes

Processing rules (same as before): convert to WebP with `sips`/Pillow, generate `-800` siblings
for hero-size images, keep ≤ 200 KB per file (≤ 400 KB for full-bleed heroes), write real `alt`
text, never delete originals. Logos: keep PNG with transparency, normalise to 160 px height,
produce a white version for the dark marquee.

| Destination (`static/assets/attencity/…`) | From deck-media | Use |
|---|---|---|
| `events/ces-2026-1..8.webp` | s15-01 … s15-08 | CES insight post gallery; s15-01/02/08 also into the home hero slider |
| `events/shanghai-day-1..5.webp` + `press/shanghai-day-clipping.webp` | s19-01…05, s19-06 | Shanghai Day post |
| `events/f4d-1..5.webp` | s17-01…05 | F4D post |
| `events/post80s-un-1..4.webp` | s18-01…04 | Post-80s post |
| `events/nyu-1..2.webp` | s16-04, s16-07 (low-res; ask for originals §10 Q4) | NYU post; s16-07 (Lynn at podium) also for Personal Branding page |
| `work/beauty-beyond-1..5.webp` | s24-01…05 | case study |
| `work/mipalette-1..5.webp` | s25-01…05 | case study |
| `work/soho-popup-1..5.webp` | s26-01…05 | case study; s26-01 (queue on Mercer St) is a strong hero |
| `work/ellicor-1..5.webp` | s27-01…04, s28-02 | case study |
| `work/influencer-party-1..4.webp` | s29-01…04 | case study; s29-01 (3808 px) is hero-grade |
| `work/kedm-1..3.webp` | s30-01…03 | case study |
| `work/gallery-*.webp` | s28-03, -06, -07, -12, -13, -16 | Events service page mosaic |
| `press/*.webp` | s22-01…07 | PR placements case study (screenshots; crop to headline) |
| `clients/<name>.png` | s08–s12 logo files (see README for names) | client marquee; files under ~300 px wide need SVG/hi-res from the owner |
| `media/*.png` | s05–s06 media logos | "Placements in" strip (evidenced outlets only) |
| `about/methodology.svg` | rebuilt, not extracted | 3A×4R diagram |
| `og/<slug>.png` | generated at build from each hero | per-page Open Graph image |
| `contact/wechat-qr.webp`, `contact/xiaohongshu-qr.webp` | `docs/source/onepager-media/qr-wechat-icelynn.jpg`, `…/qr-xiaohongshu-nyc-gaoshi-xiaozu.jpg` (see that folder's README) | QR modals on Contact (WeChat only after §10 Q3) |
| `events/post80s-un-5.webp`, `about/lynn-with-guests.webp` | `docs/source/onepager-media/photo-post80s-un-smg-backdrop.jpg`, `…/photo-lynn-with-guests-window.jpg` | Post-80s post gallery; About / Personal Branding |

Do **not** publish: s05 influencer profile screenshots (s05-12, s05-35, s05-36 — third-party
personal accounts), the stock backgrounds (s01, s02, s03, s13, s14, s20, s31 — licence unknown),
or the Forbes/Noom screenshot (s21-01) until confirmed.

---

## 8. SEO & technical checklist

1. **Metadata:** unique `<title>` (≤ 60 chars, pattern "Page — Attencity") and description
   (≤ 155) per route; `Seo.svelte` gains `type`, `image`, `publishedTime`, `jsonLd` props.
2. **Structured data (JSON-LD):** `Organization` + `ProfessionalService` sitewide (name, logo,
   address, telephone, email, `sameAs` socials, founder); `Service` on each service page;
   `FAQPage` where FAQs exist; `Article`/`NewsArticle` on posts and case studies; `Person` for
   Lynn Zhang; `BreadcrumbList` on all inner pages. Validate with Google's Rich Results test.
3. **Crawlability:** `src/routes/sitemap.xml/+server.js` (prerendered, lists every route with
   `lastmod`) and `static/robots.txt` (`Allow: /`, `Sitemap:` line). Change `/blog/` redirect to
   `/insights/`. Keep `trailingSlash = 'always'` and self-referencing canonicals.
4. **Custom domain:** add `static/CNAME` = `attencity.com`, set GitHub Pages custom domain +
   HTTPS, make the workflow build with `BASE_PATH=''` when the CNAME exists (configure-pages
   returns an empty base path for custom domains — verify in the first deploy log). Point the
   apex/`www` DNS at GitHub Pages and 301 `www` → apex.
5. **Measurement:** no Google Analytics property exists for Attencity today (checked
   2026-09-07). Create GA4 (owner's Google account), add the tag via a tiny `Analytics.svelte`
   with consent-friendly defaults, register **Google Search Console** (submit sitemap) and
   **Bing Webmaster**, and create/claim a **Google Business Profile** for 411 W 35th St.
6. **Performance & a11y:** keep LCP image preloaded, `fetchpriority="high"` on hero, lazy-load
   galleries and the map iframe, explicit `width/height` everywhere, WebP only, Lighthouse ≥ 90
   mobile on Home, one service page, one post.
7. **Internal linking:** service ↔ case studies ↔ insights cross-links; footer lists all seven
   services; every post ends with a service CTA. Breadcrumbs on inner pages.
8. **E-E-A-T signals:** bylines + author box (Lynn Zhang), About page with methodology and
   address, dated posts, outbound links to the covered institutions (Lincoln Center, CES, UN,
   NYU), press clipping images with captions.
9. **Content cadence (post-launch):** one Insights post per month minimum; event recaps within
   a week of the event; a GEO topic cluster (3–4 explainers) because Attencity *sells* GEO and
   should rank for it. Future: Chinese edition under `/zh/` from the Canva CN deck with
   `hreflang` pairs.

---

## 9. Implementation order (each phase ends with a clean `pnpm build`)

1. **Data + assets prep** — extend `attencity.js` (`site.contact`, `site.social`, 7 services in
   the new order, stats), add `mdsvex`, create `src/content/` with the 13 markdown entries from
   §3.7–3.8 (copy ported + typos fixed), convert the mapped images (§7) to WebP.
2. **Contact + footer + nav** — address/phone/email/socials/map on Contact, footer columns,
   nav with Case Studies + Insights, new social icons (TikTok, Xiaohongshu, WeChat), `/blog/` →
   `/insights/`.
3. **Form v2** — new fields, hidden channel fields, honeypot/Turnstile hook, GA4 event; front
   end finished even before the backend exists. Then build the Cloudflare Worker relay with the
   Flodesk upsert (§6.3–6.4) in `infra/lead-worker/`, with a README on creating the custom fields
   and segments in Flodesk and pasting the ids into the Worker config. Test with a throwaway
   email and confirm the subscriber appears in the `Website leads` segment with all fields set.
4. **Service pages** — template + 7 entries, hub page updated, cards link through.
5. **Case studies + Insights** — listing pages, `[slug]` routes, related-content logic, remove
   placeholder cards.
6. **Home** — trust strip, partners/media band, larger client marquee, recent work + latest
   insights sections, hero copy tweak.
7. **About** — who we are, purpose/mission, 3A×4R diagram, network reach.
8. **SEO plumbing** — JSON-LD, sitemap, robots, CNAME, per-page OG images, GA4 + GSC + Bing +
   Business Profile hand-off checklist for the owner.
9. **QA** — link check, 375/768/1280 layouts, keyboard nav, reduced motion, Lighthouse, Rich
   Results test on one page of each type, README update, memory note.

---

## 10. Questions for the owner (defaults in brackets)

**Blocking**

1. ~~Which newsletter/CRM tool holds the "newsletter database"?~~ **Answered 2026-09-07: Flodesk.**
   Still needed from the owner before the relay can go live (front end and Worker can be built
   without them): (a) a Flodesk API key (Settings → Integrations → API), (b) the team inbox for
   notifications, (c) a Cloudflare account (free) to host the Worker, or permission to create one.
   [default while waiting: Worker built and tested against a dev Flodesk key if provided, else
   the form stays in "not connected" state]
2. ~~Email: communications@ or communication@attencity.com?~~ **Answered 2026-09-07:
   `communications@attencity.com`** (the address past newsletters were sent from). Use it for
   `contactConfig.email`, the Contact page, footer, JSON-LD, and as the relay's notification inbox
   unless the owner names a different one.

No blocking questions remain — the next session can start building immediately.

**Answer when convenient (defaults are safe)**

3. Xiaohongshu profile URL for 纽约搞事小组 (ID 6782513500 is known), and may the site show the **personal** WeChat QR ("Icelynn") publicly, or is there an official-account QR? [show Xiaohongshu QR + ID; hold WeChat until answered]
4. Exact dates + original photos for the NYU Innovation Summit 2025 and Pre-AI Tech Week NYC.
5. Are the 2021–2022 PR placements (iTalkBB, MOYI, Cypherium, HSIA) and the Forbes/Noom piece
   Attencity's work? [publish the four placements as "team track record" only after a yes; never
   use Forbes/Noom without a yes]
6. Legal name for the footer: "Attencity Marketing LLC" or "Attencity LLC"? [Attencity Marketing LLC]
7. Permission to display client logos and media logos? [clients: yes; media: text list + evidenced placements only]
8. GEO service: any client example, tool, or deliverable we can describe? [ship the page with methodology + FAQ]
9. Newsletter checkbox pre-checked or opt-in, and should Flodesk send a double opt-in
   confirmation email? [pre-checked, single opt-in, US audience]
10. Keep "Case Studies" as the nav label, or "Work"? [Case Studies]
11. Office hours to print on Contact? [omit]
12. Any awards/certifications to list ("certification from credible international institutions", deck s13)? [omit until named]

---

## 11. Things intentionally left out

- Team grid stays hidden (no team data in the deck).
- No pricing page (never existed).
- Media logos for the *network* claim are rendered as text, not logos, pending Q7.
- Stock backgrounds from the deck are not reused (licence unknown; the site has its own photos).

---

## 12. What was assumed at build time (2026-09-07)

Defaults taken from §10 where no answer had arrived. Each is a one-line change if the owner
decides otherwise.

| # | Question | Assumed | Where to change |
|---|---|---|---|
| 3 | Xiaohongshu URL / WeChat QR | Xiaohongshu shown as handle + ID + QR dialog (no link, since the profile URL is still unknown); WeChat hidden entirely | `site.social` in `src/lib/content/attencity.js` — set `hidden: false` and/or add `href` |
| 4 | NYU + Pre-AI Tech Week dates | Published with `date: '2025'` and a `dateLabel` of "2025"; the sitemap widens a year-only date to Jan 1 | frontmatter in `src/content/insights/` |
| 5 | 2021–22 PR placements | **Not published** — the case study exists with `draft: true` and a note explaining why. Its five outlets (Yahoo Finance, MarketWatch, Seeking Alpha, Cision, Boston Herald) therefore do not appear in the home "Placements in" strip either, which is derived from published proof | `src/content/case-studies/cross-border-pr-placements.md` |
| 6 | Legal name | "Attencity Marketing LLC" in the footer and JSON-LD | `site.legalName` |
| 7 | Logo permissions | 26 client logos shown as white silhouettes; media outlets rendered as **text lists**, with only evidenced outlets linked under "Placements in" | `clientLogos` / `networkGroups` in `src/lib/content/network.js` |
| 8 | GEO proof | Page ships on methodology + a four-question FAQ, with no client example claimed | `services.js` → `geo-generative-engine-optimization` |
| 9 | Newsletter opt-in | Pre-checked, single opt-in | `ContactForm.svelte` (`newsletter = true`) and `FLODESK_DOUBLE_OPTIN` in the Worker |
| 10 | Nav label | "Case Studies" | `nav.links` |
| 11 | Office hours | Omitted | `contactPage.info` |
| 12 | Awards / certifications | Omitted | — |

Two changes were made beyond the plan, both reversible:

- `docs/Business Deck/` and the PPTX were added to `.gitignore` (154 MB; the extracted originals
  in `docs/source/deck-media/` are what the build needs — plan §2 recommended this).
- The four unused Pre-AI Tech Week PNG originals were moved out of `static/assets/attencity/events/`
  to `docs/source/event-originals/`; they were shipping 9 MB to Pages without being referenced.

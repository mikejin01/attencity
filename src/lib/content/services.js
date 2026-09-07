// =====================================================================
// The seven services. Order and titles follow the 2026 one-pager
// (docs/content-update-plan.md §3.2); long copy comes from the current
// site, the one-pager, and Business Deck slides 3, 4, 21, 23, 29 and 30.
//
// Each entry drives three surfaces:
//   • home card         → short, image, imageAlt
//   • /services/ hub    → title, summary, outcome
//   • /services/<slug>/ → page.* (§5.2)
// `legacyAnchor` keeps the old /services/#anchor links from the first
// build landing somewhere sensible.
// =====================================================================

export const services = [
	{
		slug: 'brand-strategy-localization',
		legacyAnchor: 'brand-strategy',
		audience: 'company',
		title: 'Brand Strategy & Localization',
		navTitle: 'Brand Strategy & Localization',
		image: 'services/brand-strategy.webp',
		imageAlt: 'A camouflage-wrapped concept car on a trade-show floor with visitors talking beside it',
		short:
			'Culturally grounded positioning and narrative that help brands be understood, trusted, and adopted in new markets.',
		summary:
			'Entering a new market requires more than visibility — it requires relevance. Attencity helps brands redefine their positioning, narrative, and communication for local audiences. We build culturally grounded brand strategies that enable companies to be understood, trusted, and adopted in new markets.',
		description:
			'We define how a brand is positioned, perceived, and adapted across different markets and audiences.',
		outcome:
			'A clear, consistent brand narrative that adapts across markets without losing identity.',
		page: {
			h1: 'Brand Strategy & Localization',
			promise: 'From positioning to storytelling — brands that resonate across markets.',
			seoTitle: 'Brand Strategy & Localization Agency',
			seoDescription:
				'Culturally grounded positioning, narrative and go-to-market strategy for brands entering the US. New York based, with teams in the U.S. and China.',
			hero: { image: 'work/ellicor-1.webp', position: 'center 55%' },
			overview: [
				'Entering a new market requires more than visibility — it requires relevance. Most cross-border launches fail not because the product is wrong, but because the story was translated instead of rebuilt.',
				'We start from the local context: who the audience already trusts, what the category conversation sounds like, and where your product fits inside it. From there we redefine positioning, narrative and communication so the brand can be understood on its own terms.',
				'The output is a brand system — positioning, messaging framework, proof points and content assets — that every downstream channel can run on without drifting.'
			],
			whatWeDo: [
				{ title: 'Market and category audit', copy: 'Competitor set, category language, cultural references and the gaps a new entrant can actually own.' },
				{ title: 'Positioning and narrative', copy: 'A single defensible position plus the messaging hierarchy that carries it into PR, social, commerce and sales.' },
				{ title: 'Localization, not translation', copy: 'We rebuild the story for the local context so it is understood, trusted and shared — the China–US divide is the one we know best.' },
				{ title: 'Naming, visual and verbal identity', copy: 'Adaptation of existing identity systems for a US audience, or new ones where the original will not travel.' },
				{ title: 'Launch architecture', copy: 'The sequencing of media, creators, commerce and events that turns a launch into a compounding asset.' }
			],
			howItWorks: [
				{ title: 'Attention — read the market', copy: 'Audit the category, the audience and the existing brand equity you are carrying in.' },
				{ title: 'Authority — build the position', copy: 'Define positioning, narrative framework and proof, then pressure-test it with local audiences.' },
				{ title: 'Asset — hand over the system', copy: 'Messaging, content assets and guidelines your team and ours can both execute against.' }
			],
			stats: [
				{ value: '50+', label: 'brands supported' },
				{ value: '2', label: 'markets, one team (US + China)' }
			],
			faq: [
				{
					q: 'We already have a global brand book. Do we need this?',
					a: 'Usually you need a layer on top of it, not a replacement. We keep the global identity intact and rebuild the parts that do not survive the move — reference points, tone, proof points and the claims that carry legal or cultural risk in the US.'
				},
				{
					q: 'How long does a localization engagement take?',
					a: 'A focused positioning and narrative project typically runs six to eight weeks. Launch architecture and asset production run alongside or after, depending on how fixed your launch date is.'
				},
				{
					q: 'Do you work with brands outside China?',
					a: 'Yes. The China–US corridor is where we have the deepest network, but the method — read the market, rebuild the story, hand over a system — applies to any brand entering a market where it has no existing trust.'
				}
			]
		}
	},
	{
		slug: 'media-pr',
		legacyAnchor: 'media-pr',
		audience: 'company',
		title: 'Media & PR',
		navTitle: 'Media & PR',
		image: 'services/media-pr.webp',
		imageAlt: 'A spokesperson speaking to camera in front of floor-to-ceiling windows',
		short:
			'PR as a long-term brand asset: structured media strategies that move brands from attention to authority.',
		summary:
			'We treat PR as a long-term brand asset, not a one-time exposure. Attencity develops structured media strategies that combine storytelling, press coverage, and credibility-building to move brands from attention to authority.',
		description:
			'We design and execute media systems that build third-party credibility and narrative authority.',
		outcome: 'Credibility that is externally validated, not self-proclaimed.',
		page: {
			h1: 'Media & PR for Cross-Market Brands',
			promise: 'Media narratives that turn visibility into credibility and authority.',
			seoTitle: 'Media & PR Agency in New York',
			seoDescription:
				'A New York PR agency for cross-market brands: US and Chinese-language media strategy and distribution across a network of 1,000+ outlets.',
			hero: { image: 'events/shanghai-day-1.webp', position: 'center 45%' },
			overview: [
				'We treat PR as part of a brand’s long-term asset base, not a short-term exposure tool. Our strategy focuses on helping brands make the critical leap from being seen, to being trusted, to being chosen and invested in.',
				'We do not chase one-off media buzz. We build a lasting, reusable PR asset system around brand positioning, narrative framework, content assets and media credibility — with systematic communications planning, so the brand is understood in the right context through the right channels.',
				'Across the China–US cultural divide we do not just translate. We rebuild the story for local context, so brands are understood, trusted and shared in the US market.'
			],
			whatWeDo: [
				{ title: 'Media strategy and narrative planning', copy: 'The story arc for a quarter or a year, mapped to launches, funding news, category moments and events.' },
				{ title: 'Press office and pitching', copy: 'Ongoing outreach into a network of 1,000+ US and Chinese-language outlets across tech, business, lifestyle and arts desks.' },
				{ title: 'Press-release production and distribution', copy: 'Written for the desk, then distributed across a 600+ channel resource library with tracked pickup reporting.' },
				{ title: 'Chinese-language media', copy: 'As Shanghai Media Group’s strategic partner in North America, we place and produce for the Chinese-language market as a first-class channel, not an afterthought.' },
				{ title: 'Spokesperson and media training', copy: 'Message discipline, interview preparation and on-camera coaching before the cameras arrive.' }
			],
			howItWorks: [
				{ title: 'Attention — earn the first look', copy: 'Angle development, media mapping and the first wave of placements that put the brand in the conversation.' },
				{ title: 'Authority — build third-party proof', copy: 'Sustained coverage, bylines, panels and partnerships that make credibility externally validated rather than self-proclaimed.' },
				{ title: 'Asset — make it reusable', copy: 'Clippings, quotes and narrative assets folded back into sales decks, site pages and AI-visible content.' }
			],
			stats: [
				{ value: '1,000+', label: 'media outlets in network' },
				{ value: '600+', label: 'distribution channels' },
				{ value: '571', label: 'placements from one release' }
			],
			faq: [
				{
					q: 'Can you guarantee coverage in a specific outlet?',
					a: 'No agency honestly can for editorial coverage, and we will not pretend otherwise. What we can commit to is the volume and quality of pitching, a distribution floor through our syndication network, and transparent reporting on what landed.'
				},
				{
					q: 'What is the SMG partnership?',
					a: 'Attencity is Shanghai Media Group’s official strategic partner in North America. Since 2024, “SMG × Attencity” has been CES’s sole official Chinese-language media partner. In practice it means Chinese-language broadcast and digital coverage is something we produce, not something we buy.'
				},
				{
					q: 'Do you do crisis communications?',
					a: 'We handle issues management for existing clients — statement drafting, media holding lines and stakeholder sequencing. We are not a standalone crisis retainer shop.'
				}
			]
		}
	},
	{
		slug: 'social-influencer-marketing',
		legacyAnchor: 'social-influencer',
		audience: 'company',
		title: 'Social Media & Influencer Marketing',
		navTitle: 'Social & Influencer',
		image: 'services/social-influencer.webp',
		imageAlt: 'Two guests posing at an Attencity × StarHub influencer party backdrop',
		short:
			'Platform-specific strategies, creator collaborations, and content ecosystems that build social credibility.',
		summary:
			'Social presence is built through consistent narrative and community engagement. We design platform-specific strategies, manage creator collaborations, and develop content ecosystems that strengthen brand visibility and social credibility.',
		description:
			'We build the creator and content systems that turn social presence into social credibility.',
		outcome: 'A creator ecosystem that keeps producing after the campaign ends.',
		page: {
			h1: 'Social Media & Influencer Marketing',
			promise: 'City-focused content and creator collaborations that drive real engagement.',
			seoTitle: 'Influencer Marketing Agency NYC',
			seoDescription:
				'Influencer and social marketing in New York: a 5,000+ creator network, influencer parties with 70+ creators, and platform-native content.',
			hero: { image: 'work/influencer-party-1.webp', position: 'center 40%' },
			overview: [
				'Social presence is built through consistent narrative and community engagement, not a burst of paid posts. We design platform-specific strategies, manage creator collaborations, and develop content ecosystems that strengthen visibility and social credibility over time.',
				'We form deep partnerships with creators across our 5,000+ network, from millions-of-followers talent to the mid-tier voices a category actually trusts. For clients without a stable creator network, we build an efficient, scalable influence pipeline through systematic sourcing and content planning.',
				'Where it helps, we bring creators together in person. Our influencer parties assemble 70+ creators per event and produce co-created photo and video content that keeps working long after the night ends.'
			],
			whatWeDo: [
				{ title: 'Creator sourcing and vetting', copy: 'Matched on audience overlap and category credibility, not follower count alone — with rate benchmarking and contracting.' },
				{ title: 'Always-on content systems', copy: 'Platform-native content calendars for Instagram, TikTok, Xiaohongshu and YouTube, built around one narrative.' },
				{ title: 'Campaign management', copy: 'Briefs, approvals, usage rights, whitelisting and paid amplification of the posts that earn it.' },
				{ title: 'Influencer events', copy: 'Creator-only launch days, parties and previews that generate a month of content in a night.' },
				{ title: 'Reporting that means something', copy: 'Reach, engagement and content output tracked against the brand narrative, not vanity dashboards.' }
			],
			howItWorks: [
				{ title: 'Attention — get into feeds', copy: 'Creator mix, hooks and formats designed for the platforms your audience actually uses.' },
				{ title: 'Authority — earn belief', copy: 'Repeat collaborations and category voices that make the brand feel established rather than advertised.' },
				{ title: 'Asset — own the library', copy: 'Licensed creator content becomes your paid, commerce and site library.' }
			],
			stats: [
				{ value: '5,000+', label: 'creators in network' },
				{ value: '70+', label: 'influencers per party' },
				{ value: '2,800+', label: 'attendees at one KEDM night' }
			],
			faq: [
				{
					q: 'Which platforms do you cover?',
					a: 'Instagram, TikTok and YouTube for the US audience; Xiaohongshu (RedNote) and WeChat for Chinese-speaking audiences in the US and back home. Most of our clients need both sides running as one campaign.'
				},
				{
					q: 'Do we own the content the creators make?',
					a: 'Usage rights are negotiated up front and written into every contract. We default to terms that let you run the content in paid media and on your own channels, because content you cannot reuse is a rental, not an asset.'
				},
				{
					q: 'Can you run an influencer event for our launch?',
					a: 'Yes — that is the format we run most. A creator-only day before a public pop-up, or a standalone party. See the influencer parties and Beauty & Beyond case studies for how those are structured.'
				}
			]
		}
	},
	{
		slug: 'geo-generative-engine-optimization',
		legacyAnchor: 'geo-ai',
		audience: 'company',
		title: 'GEO (Generative Engine Optimization)',
		navTitle: 'GEO',
		image: 'services/geo-ai.webp',
		imageAlt: 'A glowing technology-company display screen above a robotic demo on a show floor',
		short:
			'Monitor, optimize, and grow your visibility across AI search and recommendation ecosystems.',
		summary:
			'As discovery shifts to AI-driven platforms, brand visibility requires new distribution strategies. Attencity helps brands structure content and positioning for AI search, ensuring consistent presence across emerging discovery channels.',
		description:
			'We structure content and positioning so brands stay visible where discovery is moving — AI answers and recommendations.',
		outcome: 'A brand that AI assistants can describe correctly, and choose to mention.',
		page: {
			h1: 'GEO — Generative Engine Optimization',
			promise: 'Monitor, optimize and grow visibility across AI search and recommendation.',
			seoTitle: 'Generative Engine Optimization (GEO)',
			seoDescription:
				'Audit how ChatGPT, Perplexity, Gemini and AI Overviews describe your brand, fix the sources they read, and track visibility month over month.',
			hero: { image: 'events/ces-2026-1.webp', position: 'center 40%' },
			overview: [
				'A growing share of buying research never reaches a results page. People ask an assistant, read one synthesised answer, and act on it. If that answer is wrong, thin, or does not mention you, the funnel ends before your site is ever loaded.',
				'GEO is the practice of making a brand legible to those systems. Assistants do not rank pages; they assemble answers from sources they consider reliable — reference sites, press coverage, structured data, review corpora and well-formed pages. GEO works on all of them at once.',
				'It is the same job we already do in PR, told to a different reader. The third-party credibility that convinces a journalist is what convinces a model, which is why we run GEO next to media rather than as a separate SEO product.'
			],
			whatWeDo: [
				{ title: 'Visibility audit', copy: 'We ask the assistants your buyers use — ChatGPT, Perplexity, Gemini, Google AI Overviews — a defined set of category questions and record what they say about you and your competitors.' },
				{ title: 'Source repair', copy: 'Fix the pages, profiles and reference entries the answers are actually drawing from, including the ones you do not control.' },
				{ title: 'Structured data and entity work', copy: 'Organization, Service, FAQ and Article schema, consistent naming, and unambiguous facts so a model can attribute claims to you.' },
				{ title: 'Answer-shaped content', copy: 'Explainers and comparison pages written the way a question gets asked, with the specifics a model needs to quote.' },
				{ title: 'Tracking', copy: 'Re-run the same prompt set on a schedule so visibility becomes a trend line rather than an anecdote.' }
			],
			howItWorks: [
				{ title: 'Attention — measure the baseline', copy: 'Prompt set, competitor set, and a record of what the assistants say today.' },
				{ title: 'Authority — fix the sources', copy: 'Earned coverage, structured data and content that give the models something correct to read.' },
				{ title: 'Asset — hold the position', copy: 'Scheduled re-tests and a content cadence that keeps the brand in the answer as models update.' }
			],
			stats: [
				{ value: '4', label: 'assistants tracked as standard' },
				{ value: 'Monthly', label: 'visibility re-tests' }
			],
			faq: [
				{
					q: 'Is GEO just SEO with a new name?',
					a: 'They overlap but optimise for different things. SEO competes for a position in a list of links. GEO competes to be included in a single synthesised answer, which depends far more on third-party corroboration and on facts being stated unambiguously in places the model trusts.'
				},
				{
					q: 'Can you guarantee a mention in ChatGPT?',
					a: 'No, and be sceptical of anyone who does. Model outputs vary by prompt, session and version. What we can do is measure your baseline, improve the sources those answers are built from, and show the trend over time.'
				},
				{
					q: 'How do you measure it?',
					a: 'A fixed prompt set run on a schedule across the assistants your buyers use, scored for whether you appear, how you are described, and which sources are cited. Same prompts every month, so the comparison is honest.'
				},
				{
					q: 'Does GEO replace our PR programme?',
					a: 'It depends on it. The coverage, mentions and reference entries PR produces are the raw material GEO organises. Running them together is why the two sit in one team here.'
				}
			]
		}
	},
	{
		slug: 'ecommerce-growth',
		legacyAnchor: 'ecommerce',
		audience: 'company',
		title: 'E-commerce Growth',
		navTitle: 'E-commerce Growth',
		image: 'services/ecommerce.webp',
		imageAlt: 'A tiered in-store product display for a pet-treat brand launch',
		short:
			'Commerce strategies that turn positioning, content, and creator-led distribution into scalable sales on Amazon and TikTok Shop.',
		summary:
			'E-commerce performance is driven by the alignment of product positioning, content narrative, and platform-native distribution systems. Attencity designs and operates commerce strategies that integrate marketplace positioning, content-to-conversion funnels, and creator-led distribution to drive scalable sales growth across Amazon and TikTok Shop.',
		description:
			'We design and operate the marketplace, content and creator systems that move product.',
		outcome: 'Scalable sales growth on Amazon and TikTok Shop, not a one-week spike.',
		page: {
			h1: 'E-commerce Growth: Amazon & TikTok Shop',
			promise: 'Accelerate scalable growth across Amazon and TikTok Shop.',
			seoTitle: 'TikTok Shop & Amazon Growth Agency',
			seoDescription:
				'US e-commerce growth for cross-border brands: marketplace positioning, content-to-conversion funnels and creator-led distribution on Amazon and TikTok Shop.',
			hero: { image: 'work/beauty-beyond-5.webp', position: 'center 50%' },
			overview: [
				'E-commerce performance comes from the alignment of three things: how the product is positioned, what the content says, and how it reaches people on the platform’s own terms. Brands that treat them as separate workstreams pay for the gap in conversion rate.',
				'We design and operate commerce strategies that integrate marketplace positioning, content-to-conversion funnels and creator-led distribution — the same creator network that runs our influencer campaigns feeds the shop.',
				'For cross-border brands, this is usually the first place localization gets tested. A listing written for a domestic buyer rarely converts a US one, and the review corpus takes months to correct.'
			],
			whatWeDo: [
				{ title: 'Marketplace positioning', copy: 'Category selection, competitive pricing, listing architecture and the claims that survive US compliance.' },
				{ title: 'Listing and storefront production', copy: 'Copy, imagery, A+ content and video built for the platform, not adapted from a domestic catalogue.' },
				{ title: 'TikTok Shop operations', copy: 'Affiliate recruitment, sample seeding, live sessions and creator-led distribution at volume.' },
				{ title: 'Content-to-conversion funnels', copy: 'The path from a creator video to a product page that actually closes, measured end to end.' },
				{ title: 'Review and rating strategy', copy: 'Compliant programmes for building the early review base that determines everything downstream.' }
			],
			howItWorks: [
				{ title: 'Attention — get discovered', copy: 'Listing and content built for how the platform surfaces products, plus creator volume at the top.' },
				{ title: 'Authority — earn the click', copy: 'Reviews, ratings and social proof that make a new listing credible to a first-time buyer.' },
				{ title: 'Asset — compound it', copy: 'A creator roster, a content library and a review base that keep working after the launch budget stops.' }
			],
			stats: [
				{ value: '5,000+', label: 'creators for affiliate seeding' },
				{ value: '2', label: 'platforms operated end to end' }
			],
			faq: [
				{
					q: 'Do you operate the store, or just advise?',
					a: 'Either. Most cross-border clients want us operating — listings, affiliates, lives and reporting — because the platform mechanics change faster than an internal team can track from another timezone.'
				},
				{
					q: 'Can you help with US market entry logistics?',
					a: 'We handle the commercial side: entity-agnostic listing setup, compliance-safe claims, and the content and creator programme. Freight, customs and 3PL we co-ordinate with your partners rather than replace them.'
				},
				{
					q: 'How does this connect to the influencer work?',
					a: 'Same creator network, different objective. Influencer campaigns build narrative; TikTok Shop affiliates drive transactions. Running them from one roster is what makes both cheaper.'
				}
			]
		}
	},
	{
		slug: 'events-activations',
		legacyAnchor: 'events',
		audience: 'company',
		title: 'Events & Activations',
		navTitle: 'Events & Activations',
		image: 'services/events.webp',
		imageAlt: 'Dog owners and their dogs gathered at an in-store brand activation',
		short:
			'Events that connect brands with media, creators, and local communities, turning offline moments into scalable exposure.',
		summary:
			'Experiences create momentum. Attencity plans and executes events that connect brands with media, creators, and local communities — turning offline moments into scalable brand exposure.',
		description:
			'We plan, design and execute pop-ups, launches, forums and parties — then make the coverage travel.',
		outcome: 'An offline moment that produces a month of online content.',
		page: {
			h1: 'Events & Brand Activations in New York',
			promise: 'Creative concepts, seamless execution — events that leave a mark.',
			seoTitle: 'Pop-up & Brand Activation Agency NYC',
			seoDescription:
				'Pop-ups, launches, forums and influencer parties in New York. 40+ events delivered, from 300-person creator nights to 8,000-attendee weekends.',
			hero: { image: 'work/soho-popup-1.webp', position: 'center 45%' },
			overview: [
				'Attencity specialises in offline activation spaces. We have planned and executed 40+ events and exhibitions, from creator-only preview days to multi-city retail openings, and we run the media programme around them rather than handing it off.',
				'We plan, design and execute pop-ups, social events, forums, brand showcases and themed exhibitions — sourcing the venue, building the space, recruiting vendors and creators, and staffing the day.',
				'The reason events sit next to PR here is simple: an activation that nobody covers is a party. Every event we run is briefed with the coverage, the creator content and the follow-on assets already planned.'
			],
			whatWeDo: [
				{ title: 'Concept and creative', copy: 'The idea, the space design and the reason a New Yorker would give up an afternoon for it.' },
				{ title: 'Venue and production', copy: 'Sourcing, build, permits, vendors, staffing and run-of-show across Manhattan and beyond.' },
				{ title: 'Vendor and sponsor recruitment', copy: 'Our SoHo pop-up ran with 30+ vendors and 15+ sponsors — we bring the ecosystem, not just the room.' },
				{ title: 'Creator and media programme', copy: 'Creator-only days, press invitations and the on-site content capture that makes the event reusable.' },
				{ title: 'Post-event distribution', copy: 'Recap content, press release and syndication — one 2024 release produced 571 placements and an estimated 177M potential audience.' }
			],
			howItWorks: [
				{ title: 'Attention — fill the room', copy: 'Concept, creator invitations, community partners and paid support where the guest list needs it.' },
				{ title: 'Authority — make it count', copy: 'Media on site, interviews, and a narrative the coverage can hang on.' },
				{ title: 'Asset — keep it working', copy: 'Photography, creator content and press clippings folded back into the brand’s library.' }
			],
			stats: [
				{ value: '40+', label: 'events and exhibitions executed' },
				{ value: '8,000+', label: 'attendees at one weekend pop-up' },
				{ value: '571', label: 'placements from one event release' }
			],
			faq: [
				{
					q: 'What size events do you run?',
					a: 'From 70-creator private parties to an 8,000-attendee two-day pop-up in SoHo. The format changes; the operating model — concept, build, creators, media, recap — does not.'
				},
				{
					q: 'Do you only work in New York?',
					a: 'New York is home and where most of our work happens. We have also run multi-city retail activations, including Ellicor openings in Los Angeles, Austin and Sugar Land, Texas.'
				},
				{
					q: 'Can you handle sponsors and vendors as well?',
					a: 'Yes. Vendor and sponsor recruitment is usually part of the brief — it is how a single-brand budget turns into a destination event.'
				}
			]
		}
	},
	{
		slug: 'personal-branding',
		legacyAnchor: 'individual',
		audience: 'individual',
		title: 'Personal Branding',
		navTitle: 'Personal Branding',
		image: 'services-individual-city-glass.webp',
		imageAlt: 'Low-angle view of glass skyscrapers reflecting the sky',
		short:
			'Visibility, credibility and influence for founders, creators, artists and public figures.',
		summary:
			'We help high-profile individuals — including founders, creators, artists, and public figures — build structured narrative, media, and social distribution systems that ensure consistent visibility, credibility, and long-term authority across platforms.',
		description:
			'We build the narrative, media and social systems that give an individual durable authority.',
		outcome: 'A public profile that opens doors without you having to explain yourself first.',
		page: {
			h1: 'Personal Branding for Founders, Creators & Public Figures',
			promise: 'Building visibility, credibility and influence for the person, not just the company.',
			seoTitle: 'Personal Branding Agency New York',
			seoDescription:
				'Personal branding for founders, creators, artists and public figures: narrative, media placement, speaking and social systems that build authority.',
			hero: { image: 'events/nyu-1.webp', position: 'center 40%' },
			overview: [
				'For founders and public figures, the personal profile often moves faster than the company’s — and carries further. Investors, partners and press look the person up before they look up the brand.',
				'We help high-profile individuals build structured narrative, media and social distribution systems that produce consistent visibility, credibility and long-term authority across platforms.',
				'This is the same 3A method we run for companies, applied to one person: be seen in the right rooms, be trusted through third-party proof, and turn both into assets — a talk, a byline, a profile — that keep working.'
			],
			whatWeDo: [
				{ title: 'Narrative and positioning', copy: 'The two or three things you should be known for, and the story that makes them credible.' },
				{ title: 'Media and profile placement', copy: 'Interviews, profiles and bylines in outlets your audience already reads, in English and Chinese.' },
				{ title: 'Speaking and panels', copy: 'Sourcing and preparing the stages — summits, festivals, industry forums — where the right people are listening.' },
				{ title: 'Social presence', copy: 'A sustainable content cadence on the one or two platforms that matter for you, run with you rather than for you.' },
				{ title: 'Asset building', copy: 'Bio, headshots, speaker kit, clipping library and the structured data that makes you findable — including by AI assistants.' }
			],
			howItWorks: [
				{ title: 'Attention — be visible', copy: 'Define the audience, the platforms and the first set of rooms worth being in.' },
				{ title: 'Authority — be trusted', copy: 'Third-party proof: coverage, stages, bylines and the endorsements that come with them.' },
				{ title: 'Asset — be findable', copy: 'A profile, clipping library and reference footprint that hold up when someone searches you cold.' }
			],
			stats: [
				{ value: '1,000+', label: 'media outlets in network' },
				{ value: '5,000+', label: 'creators for collaboration' }
			],
			faq: [
				{
					q: 'Is this only for founders?',
					a: 'No. We work with founders, creators, artists and public figures. The common factor is that your personal reputation is doing commercial work — raising money, booking stages, attracting talent or selling your own work.'
				},
				{
					q: 'How much of my time does it take?',
					a: 'Plan on two to four hours a month for interviews and content capture once the narrative is set. We do the sourcing, preparation and production; we cannot outsource being you.'
				},
				{
					q: 'Do you write posts as me?',
					a: 'We draft, you approve, and your voice stays yours. Ghostwritten content that does not sound like you fails the moment someone meets you in person.'
				}
			]
		}
	}
];

/** Company-facing services (the six home cards). */
export const companyServices = services.filter((s) => s.audience === 'company');

/** Look-up by slug. */
export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

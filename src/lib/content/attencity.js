// =====================================================================
// Attencity — ALL site copy and asset references in one place.
// Copy is reproduced verbatim from https://attencity.com/ (captured
// 2026-09-02) per docs/rebuild-plan.md §4–§5. Anything marked
// `interim: true` is stand-in text awaiting the client (plan §8).
// =====================================================================
import { base } from '$app/paths';

/** Absolute (base-aware) path to a file in static/assets/attencity/. */
export const asset = (file) => `${base}/assets/attencity/${file}`;
/** Base-aware internal route. Routes always end with a slash (trailingSlash = 'always'). */
export const route = (path) => `${base}${path}`;
/** srcset for a hero-sized WebP that also has an 800px `-800.webp` sibling. */
export const srcset = (file, fullWidth) =>
	`${asset(file.replace(/\.webp$/, '-800.webp'))} 800w, ${asset(file)} ${fullWidth}w`;

export const site = {
	name: 'Attencity',
	tagline: 'Attention meets City!',
	promise: 'We Build Brand Authority Across Markets.',
	url: 'https://attencity.com',
	description:
		'Attencity helps brands build authority across markets — brand strategy and localization, media and PR, social and influencer marketing, e-commerce growth, events, and GEO/AI distribution.',
	ogImage: 'og-image.png'
};

export const nav = {
	links: [
		{ label: 'Home', href: '/' },
		{ label: 'Services', href: '/services/' },
		{ label: 'About', href: '/about/' },
		{ label: 'Case Studies', href: '/case-studies/' },
		{ label: 'Contact', href: '/contact/' }
	],
	cta: 'Get in touch'
};

/**
 * Contact delivery — plan §8 Q1/Q3.
 *  - formEndpoint: a JSON-accepting POST endpoint (Formspree / Basin / Web3Forms style).
 *    When set, both forms POST there.
 *  - email: the real inbox. With no endpoint, forms fall back to a pre-filled mailto: link.
 *  - With neither, forms validate and show a clearly labelled "not connected yet" state.
 */
export const contactConfig = {
	formEndpoint: '',
	email: '',
	phone: '',
	offices: ['United States', 'China']
};

/** The six services. `short` = home card blurb (condensed); `summary` = original card copy,
 *  reused on /services/ where the original has no `description`; `outcome` = /services/ page copy. */
export const services = [
	{
		slug: 'brand-strategy',
		short: 'Culturally grounded positioning and narrative that help brands be understood, trusted, and adopted in new markets.',
		title: 'Brand Strategy and Localization',
		image: 'services/brand-strategy.webp',
		imageAlt: 'A camouflage-wrapped concept car on a trade-show floor with visitors talking beside it',
		summary:
			'Entering a new market requires more than visibility — it requires relevance. Attencity helps brands redefine their positioning, narrative, and communication for local audiences. We build culturally grounded brand strategies that enable companies to be understood, trusted, and adopted in new markets.',
		description:
			'We define how a brand is positioned, perceived, and adapted across different markets and audiences.',
		outcome:
			'A clear, consistent brand narrative that adapts across markets without losing identity.'
	},
	{
		slug: 'media-pr',
		short: 'PR as a long-term brand asset: structured media strategies that move brands from attention to authority.',
		title: 'Media & Public Relations',
		image: 'services/media-pr.webp',
		imageAlt: 'A spokesperson speaking to camera in front of floor-to-ceiling windows',
		summary:
			'We treat PR as a long-term brand asset, not a one-time exposure. Attencity develops structured media strategies that combine storytelling, press coverage, and credibility-building to move brands from attention to authority.',
		description:
			'We design and execute media systems that build third-party credibility and narrative authority.',
		outcome: 'Credibility that is externally validated, not self-proclaimed.'
	},
	{
		slug: 'social-influencer',
		short: 'Platform-specific strategies, creator collaborations, and content ecosystems that build social credibility.',
		title: 'Social Media & influencer marketing',
		image: 'services/social-influencer.webp',
		imageAlt: 'Two guests posing at an Attencity × StarHub influencer party backdrop',
		summary:
			'Social presence is built through consistent narrative and community engagement. We design platform-specific strategies, manage creator collaborations, and develop content ecosystems that strengthen brand visibility and social credibility.',
		description: null, // §5.1: only two services are detailed on the original — card copy is reused
		outcome: null // client to supply
	},
	{
		slug: 'ecommerce',
		short: 'Commerce strategies that turn positioning, content, and creator-led distribution into scalable sales on Amazon and TikTok Shop.',
		title: 'E-commerce Growth',
		image: 'services/ecommerce.webp',
		imageAlt: 'A tiered in-store product display for a pet-treat brand launch',
		summary:
			'E-commerce performance is driven by the alignment of product positioning, content narrative, and platform-native distribution systems. Attencity design and operate commerce strategies that integrate marketplace positioning, content-to-conversion funnels, and creator-led distribution to drive scalable sales growth across Amazon and TikTok Shop.', // sic: "Attencity design and operate" — §8 Q10
		description: null,
		outcome: null
	},
	{
		slug: 'events',
		short: 'Events that connect brands with media, creators, and local communities, turning offline moments into scalable exposure.',
		title: 'Events & Activations',
		image: 'services/events.webp',
		imageAlt: 'Dog owners and their dogs gathered at an in-store brand activation',
		summary:
			'Experiences create momentum. Attencity plans and executes events that connect brands with media, creators, and local communities — turning offline moments into scalable brand exposure.',
		description: null,
		outcome: null
	},
	{
		slug: 'geo-ai',
		short: 'Content and positioning structured for AI search, so brands stay visible across emerging discovery channels.',
		title: 'GEO & AI Distribution',
		image: 'services/geo-ai.webp',
		imageAlt: 'A glowing technology-company display screen above a robotic demo on a show floor',
		summary:
			'As discovery shifts to AI-driven platforms, brand visibility requires new distribution strategies. Attencity helps brands structure content and positioning for AI search, ensuring consistent presence across emerging discovery channels.',
		description: null,
		outcome: null
	}
];

/** "Why ATTENCITY" points — reused on the About page as the interim intro. */
export const whyPoints = [
	{
		icon: 'megaphone',
		title: 'Media & Influencer Reach',
		copy: 'We combine PR, social, AI distribution, and real-world activations to help brands enter new markets and build long-term credibility'
	},
	{
		icon: 'pin',
		title: 'Real-World Activation Experience',
		copy: 'Access to 1,000+ media outlets and 5,000+ creators across the U.S. and global markets'
	},
	{
		icon: 'globe',
		title: 'Cross-Market Localization',
		copy: 'U.S. and China-based teams delivering culturally grounded storytelling'
	},
	{
		icon: 'trend',
		title: 'From Attention to Authority',
		copy: 'Our methodology turns visibility into long-term brand assets'
	}
];

export const home = {
	title: null, // → "Attencity — Attention meets City!" via Seo defaults
	hero: {
		/** Background slider — crossfades through static/assets/attencity/events/ every
		 *  `interval` ms. Each slide is a full-size WebP with an `-800.webp` sibling for phones
		 *  (srcset). The first slide is the LCP image and is preloaded. `alt` documents each
		 *  photo; the slides render decoratively (alt="") behind the H1. */
		interval: 6000,
		slides: [
			{
				image: 'events/pre-ai-tech-week-nyc-3.webp',
				width: 1536,
				height: 1024,
				position: 'center 40%',
				alt: 'A speaker at the Pre-AI Tech Week NYC podium in front of the Silicon Valley AI Film Festival backdrop'
			},
			{
				image: 'events/pre-ai-tech-week-nyc-2.webp',
				width: 1527,
				height: 1030,
				position: 'center 45%',
				alt: 'Award recipients and hosts on stage at Pre-AI Tech Week NYC'
			},
			{
				image: 'events/pre-ai-tech-week-nyc-4.webp',
				width: 1536,
				height: 1024,
				position: 'center 35%',
				alt: 'Two guests in conversation in front of the Pre-AI Tech Week NYC screen'
			},
			{
				image: 'events/pre-ai-tech-week-nyc-1.webp',
				width: 1536,
				height: 1024,
				position: 'center 40%',
				alt: 'A full audience watching the hosts on stage at Pre-AI Tech Week NYC'
			}
		],
		title: 'Attention meets City!',
		lead: 'We Build Brand Authority Across Markets.',
		text: 'Attencity helps brands turn visibility into trust and trust into long-term brand assets.',
		primary: 'Get in touch',
		secondary: 'View Services',
		secondaryHref: '/services/'
	},
	servicesCompany: {
		eyebrow: 'Services for Company',
		title: 'We design brand systems that scale across markets, media, and distribution channels.',
		cardCta: 'Learn more',
		cta: 'View Services',
		ctaHref: '/services/'
	},
	why: {
		title: 'Why Attencity',
		image: 'why-attencity-billboard.webp',
		imageWidth: 1236,
		alt: 'An Attencity digital billboard on a city street at dusk, showing a team working around a desk'
	},
	servicesIndividual: {
		title: 'Services for Individual',
		body: 'We help high-profile individuals—including founders, creators, artists, and public figures—build structured narrative, media, and social distribution systems that ensure consistent visibility, credibility, and long-term authority across platforms.',
		image: 'services-individual-city-glass.webp',
		alt: 'Low-angle view of glass skyscrapers reflecting the sky',
		cta: 'View services',
		ctaHref: '/services/'
	},
	clients: {
		title: 'Our Happy Clients',
		sub: 'Trusted by brands across markets that value long-term authority, not short-term visibility.',
		logos: [
			{ name: 'TCL', file: 'clients/tcl.png' },
			{ name: 'Hisense', file: 'clients/hisense.png' },
			{ name: 'Gong cha', file: 'clients/gongcha.png' },
			{ name: 'Rokid', file: 'clients/rokid.png' },
			{ name: 'APOTHE', file: 'clients/apothe.png' },
			{ name: 'PRIMEBOT', file: 'clients/primebot.png' }
		]
	},
	/** Social feed marquee — clips in static/assets/attencity/social/. Set `href` (post URL)
	 *  and `network` per clip, and replace `title` with the handle once known (§8 Q2). */
	social: {
		eyebrow: 'Follow along',
		title: 'Attencity on social',
		interim: true,
		clips: Array.from({ length: 8 }, (_, i) => ({
			file: `social/attencity-social-${i + 1}.mp4`,
			poster: `social/attencity-social-${i + 1}.webp`,
			href: '',
			network: 'Instagram',
			label: `Attencity social clip ${i + 1}`
		}))
	},
	insights: {
		title: 'Insights',
		body: 'We help companies build structured brand visibility, media positioning, and AI-era distribution systems that strengthen market credibility, improve discoverability across search and generative platforms, and drive long-term business growth through integrated PR, GEO, content, and digital reputation strategies.'
	},
	contactCta: {
		eyebrow: 'Contact',
		title: 'Find a better solution for your business',
		image: 'contact-bg-woman-city-reflection.webp'
	}
};

/** Shared "Get in touch" modal copy. `sub` is interim (§8 — same line proposed for the Services CTA). */
export const contactModal = {
	eyebrow: 'Contact',
	title: 'Get in touch',
	sub: 'Tell us about your market, your product, and where you want to be seen.',
	interim: true
};

export const servicesPage = {
	title: 'Services',
	hero: {
		eyebrow: 'What we do',
		sub: 'We design brand systems that scale across markets, media, and distribution channels.',
		image: 'services-individual-city-glass.webp',
		imageWidth: 1047
	},
	cta: {
		title: 'Have any questions?',
		body: 'Tell us about your market, your product, and where you want to be seen.', // interim — original is lorem ipsum (§8)
		interim: true,
		button: 'Contact us',
		href: '/contact/'
	}
};

export const aboutPage = {
	title: 'About',
	hero: {
		eyebrow: 'About Attencity',
		sub: 'U.S. and China-based teams delivering culturally grounded storytelling.',
		image: 'why-attencity-billboard.webp',
		imageWidth: 1236
	},
	// Interim intro (§5.2): hero sub-line + the four "Why Attencity" points, until real copy arrives.
	intro: {
		eyebrow: 'About Attencity',
		title: 'We Build Brand Authority Across Markets.',
		lead: 'Attencity helps brands turn visibility into trust and trust into long-term brand assets.',
		image: 'about-hero-desk-orange.webp',
		alt: 'Flat-lay of an orange desk with a laptop, notebook, and coffee',
		interim: true
	},
	// Founder spotlight — compiled from Lynn's public profile and Pre-AI Tech Week NYC coverage (Sept 2026).
	founder: {
		eyebrow: 'Meet the founder',
		name: 'Lynn Zhang',
		role: 'Founder, Attencity · Director, MC International US',
		image: 'founder-lynn-zhang.webp',
		alt: 'Lynn Zhang, founder of Attencity, reading a magazine in front of a wall of fashion titles',
		lead: 'Lynn founded Attencity in New York in 2023 to help AI, retail, consumer, and K-beauty brands grow in the U.S. market through brand strategy, data analytics, and partnerships.',
		body: [
			'She came to brand-building from the data side. Before Attencity, Lynn spent six years in marketing and customer analytics at H&M, Cole Haan, and Block72, most recently as CRM & Marketing Data Manager at H&M. That background shapes how Attencity works: every campaign is built around outcomes that can be measured, not just visibility.',
			"Lynn also serves as Director at MC International US and is active in New York's cross-border innovation community. She opened Pre-AI Tech Week NYC with remarks on the convergence of local and global innovation ecosystems and the launch of the Silicon Valley AI Film Festival's New York chapter."
		],
		facts: [
			{ label: 'Founded Attencity', value: 'New York, 2023' },
			{ label: 'Previously', value: 'H&M · Cole Haan · Block72' },
			{ label: 'Education', value: 'M.S. Integrated Marketing, New York University · B.S. Information Systems Security, Tongji University' },
			{ label: 'Focus', value: 'U.S. market growth for AI, retail, consumer, and K-beauty brands' }
		]
	},
	showTeam: false, // §5.2 — flip to true once real names/roles/photos exist
	team: {
		eyebrow: 'Our team',
		title: 'The people behind the work',
		members: [
			{ name: 'John Doe', role: 'Web designer', image: 'team-1.webp' },
			{ name: 'Jane Doe', role: 'Marketing Specialist', image: 'team-2.webp' },
			{ name: 'Mary Smith', role: 'CEO', image: 'team-3.webp' },
			{ name: 'Christina Doe', role: 'Designer', image: 'team-4.webp' },
			{ name: 'John Smith', role: 'Developer', image: 'team-5.webp' },
			{ name: 'Michael Doe', role: 'Developer', image: 'team-6.webp' }
		]
	},
	careers: {
		eyebrow: 'Careers & available jobs',
		title: "We're looking for a new colleague!",
		body: "Interested in working with Attencity? Tell us about yourself and the kind of role you're looking for.", // interim — original is lorem ipsum (§8)
		interim: true,
		button: 'Contact us',
		href: '/contact/'
	}
};

export const contactPage = {
	title: 'Contact',
	hero: {
		eyebrow: 'Contact',
		sub: 'Find a better solution for your business',
		image: 'contact-bg-woman-city-reflection.webp',
		imageWidth: 1648
	},
	info: {
		title: 'Contact info',
		// Shown while phone/email/address are unconfirmed (§8 Q3). The original's details were theme placeholders.
		pendingNote: 'Full contact details are being finalised. The form is the fastest way to reach us in the meantime.'
	},
	form: {
		title: 'Send us a message'
	}
};

export const caseStudiesPage = {
	title: 'Case Studies',
	hero: {
		eyebrow: 'Our work',
		sub: 'From attention to authority.',
		image: 'case-study-2.webp',
		imageWidth: 1198
	},
	// §5.4 — no real case studies yet. Placeholder cards, clearly marked, no detail pages.
	comingSoon: {
		title: 'Case studies coming soon',
		body: "We're preparing our first published case studies. In the meantime, get in touch to hear how we've helped brands build authority across markets.",
		interim: true
	},
	placeholders: [
		{ label: 'Coming soon', title: 'Case study 01', image: 'case-study-1.webp', alt: 'Tablet showing a sign-up form' },
		{ label: 'Coming soon', title: 'Case study 02', image: 'case-study-2.webp', alt: 'Two people working at a laptop' },
		{ label: 'Coming soon', title: 'Case study 03', image: 'case-study-3.webp', alt: 'Man wearing a VR headset' }
	]
};

export const footer = {
	menuLabel: 'Menu',
	usefulLabel: 'Useful links',
	useful: [
		// "Plans & pricing" dropped — no such page exists (§8 Q7)
		{ label: 'Contact', href: '/contact/' }
	],
	followLabel: 'Follow Us',
	// §8 Q2 — all four were empty on the original. Icons render only when `href` is set.
	social: [
		{ name: 'Facebook', icon: 'facebook', href: '' },
		{ name: 'X (Twitter)', icon: 'x', href: '' },
		{ name: 'YouTube', icon: 'youtube', href: '' },
		{ name: 'Vimeo', icon: 'vimeo', href: '' },
		{ name: 'LinkedIn', icon: 'linkedin', href: '' },
		{ name: 'Instagram', icon: 'instagram', href: '' }
	],
	copyright: '© 2026 Attencity.'
};

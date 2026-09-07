// =====================================================================
// Structured data builders (plan §8.2).
//
// Every URL here is absolute against site.url — crawlers never see the
// `base` prefix, and with the custom domain (static/CNAME) base is empty
// anyway. Keep these functions pure so they can run during prerender.
// =====================================================================
import { site } from '$lib/content/attencity.js';

const abs = (path) => `${site.url}${path}`;
const assetUrl = (file) => `${site.url}/assets/attencity/${file}`;

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
export const FOUNDER_ID = `${site.url}/about/#lynn-zhang`;

const postalAddress = () => ({
	'@type': 'PostalAddress',
	streetAddress: site.contact.street,
	addressLocality: site.contact.locality,
	addressRegion: site.contact.region,
	postalCode: site.contact.postalCode,
	addressCountry: site.contact.country
});

/** Organization + ProfessionalService + WebSite — emitted once, in the layout. */
export function organizationGraph() {
	const sameAs = site.social.filter((s) => !s.hidden && s.href).map((s) => s.href);
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': ['Organization', 'ProfessionalService'],
				'@id': ORG_ID,
				name: site.name,
				legalName: site.legalName,
				url: site.url,
				logo: assetUrl(site.logo),
				image: assetUrl(site.ogImage),
				description: site.description,
				slogan: site.tagline,
				foundingDate: site.founded,
				founder: { '@id': FOUNDER_ID },
				address: postalAddress(),
				telephone: site.contact.phone,
				email: site.contact.email,
				areaServed: site.contact.areaServed.map((n) => ({ '@type': 'Country', name: n })),
				sameAs
			},
			{
				'@type': 'Person',
				'@id': FOUNDER_ID,
				name: 'Lynn Zhang',
				jobTitle: 'Founder',
				worksFor: { '@id': ORG_ID },
				url: abs('/about/#founder')
			},
			{
				'@type': 'WebSite',
				'@id': SITE_ID,
				url: site.url,
				name: site.name,
				publisher: { '@id': ORG_ID },
				inLanguage: 'en-US'
			}
		]
	};
}

/** BreadcrumbList for any inner page. `trail` is [{ name, path }, …]. */
export function breadcrumbs(trail) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.name,
			item: abs(item.path)
		}))
	};
}

/** Service page. */
export function serviceGraph(service) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': abs(`/services/${service.slug}/#service`),
		name: service.title,
		serviceType: service.title,
		description: service.page.seoDescription,
		url: abs(`/services/${service.slug}/`),
		provider: { '@id': ORG_ID },
		areaServed: site.contact.areaServed.map((n) => ({ '@type': 'Country', name: n })),
		audience: {
			'@type': 'Audience',
			audienceType: service.audience === 'individual' ? 'Founders, creators and public figures' : 'Brands and businesses'
		}
	};
}

/** FAQPage — pass the same `faq` array the page renders. */
export function faqGraph(faq) {
	if (!faq?.length) return null;
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faq.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: { '@type': 'Answer', text: item.a }
		}))
	};
}

/**
 * Article for a case study, NewsArticle for an insights post.
 * `post` is the frontmatter object from src/lib/content/posts.js.
 */
export function postGraph(post) {
	const isCase = post.type === 'case-study';
	const path = isCase ? `/case-studies/${post.slug}/` : `/insights/${post.slug}/`;
	return {
		'@context': 'https://schema.org',
		'@type': isCase ? 'Article' : 'NewsArticle',
		'@id': abs(`${path}#article`),
		headline: post.title,
		description: post.excerpt,
		image: assetUrl(`og/${isCase ? 'case-studies' : 'insights'}-${post.slug}.jpg`),
		datePublished: post.date,
		dateModified: post.date,
		mainEntityOfPage: abs(path),
		author: isCase ? { '@id': ORG_ID } : { '@id': FOUNDER_ID },
		publisher: { '@id': ORG_ID },
		inLanguage: 'en-US',
		...(post.tags?.length ? { keywords: post.tags.join(', ') } : {})
	};
}

/**
 * Event for a case study that has a real venue and date. Past events are
 * `EventScheduled` with `eventStatus`; attendance goes in the description
 * rather than being invented as structured capacity.
 */
export function eventGraph(post) {
	if (!post.location || !post.date || post.date.length < 10) return null;
	return {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: post.title,
		startDate: post.date,
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		location: { '@type': 'Place', name: post.location, address: post.location },
		image: assetUrl(post.hero),
		description: post.excerpt,
		organizer: { '@id': ORG_ID },
		url: abs(`/case-studies/${post.slug}/`)
	};
}

/** ItemList for the two listing pages, so the set is discoverable at once. */
export function itemListGraph(posts, basePath) {
	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: posts.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: p.title,
			url: abs(`${basePath}${p.slug}/`)
		}))
	};
}

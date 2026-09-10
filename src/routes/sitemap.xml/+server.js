/* global __WP_BUILD__ */
// Prerendered sitemap listing every route the site publishes (plan §8.3).
// `lastmod` uses each post's own date; static pages use the build date.
import { site, services, caseStudiesPage, insightsPage } from '$lib/content/attencity.js';
import { caseStudies, insights } from '$lib/content/posts.js';

// Prerendered for the static build; in the WordPress shell nothing is
// prerendered — WordPress serves the page and the SPA renders it.
export const prerender = !__WP_BUILD__;

const BUILT = new Date().toISOString().slice(0, 10);

/** A post date may be year-only (an event whose exact day we do not have). */
const lastmod = (date) => (date && date.length === 10 ? date : `${(date ?? BUILT).slice(0, 4)}-01-01`);

export function GET() {
	/** @type {{loc: string, lastmod: string, priority: string}[]} */
	const urls = [
		{ loc: '/', lastmod: BUILT, priority: '1.0' },
		{ loc: '/services/', lastmod: BUILT, priority: '0.9' },
		{ loc: '/about/', lastmod: BUILT, priority: '0.7' },
		{ loc: '/contact/', lastmod: BUILT, priority: '0.7' },
		...services.map((s) => ({ loc: `/services/${s.slug}/`, lastmod: BUILT, priority: '0.9' }))
	];
	if (caseStudiesPage.enabled) {
		urls.push({ loc: '/case-studies/', lastmod: BUILT, priority: '0.8' });
		for (const p of caseStudies) {
			urls.push({ loc: `/case-studies/${p.slug}/`, lastmod: lastmod(p.date), priority: '0.7' });
		}
	}
	if (insightsPage.enabled) {
		urls.push({ loc: '/insights/', lastmod: BUILT, priority: '0.8' });
		for (const p of insights) {
			urls.push({ loc: `/insights/${p.slug}/`, lastmod: lastmod(p.date), priority: '0.6' });
		}
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) =>
			`	<url>\n		<loc>${site.url}${u.loc}</loc>\n		<lastmod>${u.lastmod}</lastmod>\n		<priority>${u.priority}</priority>\n	</url>`
	)
	.join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

// =====================================================================
// Case studies (src/content/case-studies/*.md) and Insights posts
// (src/content/insights/*.md), loaded through mdsvex.
//
// This module reads FRONTMATTER ONLY (`import: 'metadata'`), so importing it
// on the home page or a listing does not pull every post body into the
// bundle. The `[slug]` routes glob the components themselves.
//
// Frontmatter contract (all posts):
//   title, date (YYYY-MM-DD), excerpt, hero, heroAlt
//   tags[]            — listing filters
//   services[]        — service slugs this entry is proof for
//   gallery[]         — { file, alt } photos rendered under the body
//   seoTitle, seoDescription
// Case studies additionally use: client, location, dateLabel, stats[]
// Insights additionally use: author, dateLabel
// =====================================================================

const caseStudyMeta = import.meta.glob('/src/content/case-studies/*.md', {
	eager: true,
	import: 'metadata'
});
const insightMeta = import.meta.glob('/src/content/insights/*.md', {
	eager: true,
	import: 'metadata'
});

const slugOf = (path) => path.split('/').pop().replace(/\.md$/, '');

/** Newest first; entries with `draft: true` never ship. */
function collect(modules, type) {
	return Object.entries(modules)
		.map(([path, meta]) => ({ ...meta, slug: meta.slug ?? slugOf(path), type }))
		.filter((p) => !p.draft)
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const caseStudies = collect(caseStudyMeta, 'case-study');
export const insights = collect(insightMeta, 'insight');
export const allPosts = [...caseStudies, ...insights].sort((a, b) =>
	a.date < b.date ? 1 : a.date > b.date ? -1 : 0
);

export const caseStudyBySlug = Object.fromEntries(caseStudies.map((p) => [p.slug, p]));
export const insightBySlug = Object.fromEntries(insights.map((p) => [p.slug, p]));

/** The route a post lives at (base path is applied by `route()`). */
export const postHref = (post) =>
	post.type === 'case-study' ? `/case-studies/${post.slug}/` : `/insights/${post.slug}/`;

/**
 * Case studies and insights tagged with a service slug (§5.2 "Proof").
 * Capped at `limit` each: these are proof points on a service page, not an
 * archive — the listings are one click away.
 */
export const relatedTo = (serviceSlug, limit = 3) => ({
	caseStudies: caseStudies.filter((p) => p.services?.includes(serviceSlug)).slice(0, limit),
	insights: insights.filter((p) => p.services?.includes(serviceSlug)).slice(0, limit)
});

/** Previous/next within the same collection, for the post footer. */
export function neighbours(post) {
	const list = post.type === 'case-study' ? caseStudies : insights;
	const i = list.findIndex((p) => p.slug === post.slug);
	return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
}

/** Every tag in use, in order of first appearance, for the listing filters. */
export function tagsOf(list) {
	const seen = [];
	for (const p of list) for (const t of p.tags ?? []) if (!seen.includes(t)) seen.push(t);
	return seen;
}

/** "September 23, 2025" from an ISO date, for display and <time datetime>. */
export const formatDate = (iso) =>
	new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});

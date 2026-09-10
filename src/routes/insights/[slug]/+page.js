/* global __WP_BUILD__ */
// One prerendered page per insights post.
import { error } from '@sveltejs/kit';
import { insights, insightBySlug } from '$lib/content/posts.js';

// Prerendered for the static build; in the WordPress shell nothing is
// prerendered — WordPress serves the page and the SPA renders it.
export const prerender = !__WP_BUILD__;

export function entries() {
	return insights.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	if (!insightBySlug[params.slug]) error(404, `Unknown post: ${params.slug}`);
	return { slug: params.slug };
}

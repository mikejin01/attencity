/* global __WP_BUILD__ */
// One prerendered page per published case study. The body component is
// globbed inside +page.svelte, so only the slug travels in the payload.
import { error } from '@sveltejs/kit';
import { caseStudies, caseStudyBySlug } from '$lib/content/posts.js';

// Prerendered for the static build; in the WordPress shell nothing is
// prerendered — WordPress serves the page and the SPA renders it.
export const prerender = !__WP_BUILD__;

export function entries() {
	return caseStudies.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	// In the WordPress build the slug may belong to a post written in the
	// dashboard, which only the browser can resolve. Let it through and let
	// the page render its own not-found state if nothing turns up.
	if (!__WP_BUILD__ && !caseStudyBySlug[params.slug]) error(404, `Unknown case study: ${params.slug}`);
	return { slug: params.slug };
}

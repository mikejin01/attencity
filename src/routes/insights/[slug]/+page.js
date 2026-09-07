// One prerendered page per insights post.
import { error } from '@sveltejs/kit';
import { insights, insightBySlug } from '$lib/content/posts.js';

export const prerender = true;

export function entries() {
	return insights.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	if (!insightBySlug[params.slug]) error(404, `Unknown post: ${params.slug}`);
	return { slug: params.slug };
}

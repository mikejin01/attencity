/* global __WP_BUILD__ */
// One prerendered page per service. Only the slug crosses into the payload —
// the copy itself is imported by the component, so it is not duplicated into
// every generated HTML file.
import { error } from '@sveltejs/kit';
import { services, serviceBySlug } from '$lib/content/services.js';

// Prerendered for the static build; in the WordPress shell nothing is
// prerendered — WordPress serves the page and the SPA renders it.
export const prerender = !__WP_BUILD__;

export function entries() {
	return services.map((s) => ({ slug: s.slug }));
}

export function load({ params }) {
	if (!serviceBySlug[params.slug]) error(404, `Unknown service: ${params.slug}`);
	return { slug: params.slug };
}

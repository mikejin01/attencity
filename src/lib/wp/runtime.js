/* global __WP_BUILD__ */
// =====================================================================
// The seam between this app and WordPress.
//
// In the normal static build every export here collapses to the plain
// SvelteKit behaviour, so nothing in the app has to know WordPress exists.
// In the WP_BUILD shell (scripts/build-wordpress-theme.mjs) they resolve
// against the live WordPress install instead.
// =====================================================================
import { base } from '$app/paths';

/** The `window.wpRest` payload printed by the theme, or an empty object. */
export const wpRest = () => (typeof window === 'undefined' ? {} : (window.wpRest ?? {}));

/**
 * Where this app's own static files live.
 *
 * Under WordPress the app is served from the site root but its files sit in
 * `/wp-content/themes/<slug>/`, so a root-absolute `/assets/...` would 404.
 * `paths.base` cannot fix it: routes must stay at the root while assets need
 * the theme prefix, and one base cannot be both.
 *
 * The theme directory is read from a `data-` attribute on <body> rather than
 * from `window.wpRest`. An <img src> resolves the instant it renders and
 * cannot wait for the /bootstrap fallback, so the path has to survive an
 * optimisation plugin that strips or defers inline scripts. An attribute does.
 */
export function assetRoot() {
	if (!__WP_BUILD__) return base;
	if (typeof document !== 'undefined') {
		const dir = document.body?.dataset?.attencityTheme;
		if (dir) return dir.replace(/\/$/, '');
	}
	const uri = wpRest().themeUri;
	return uri ? String(uri).replace(/\/$/, '') : '';
}

/**
 * The REST route that captures a contact submission (namespace xo/v1), or '' outside WordPress.
 * Consumed by src/lib/contact.svelte.js, which falls back to mailto when this
 * is empty — so a theme served without the endpoint still never drops a lead.
 */
export function leadEndpoint() {
	if (!__WP_BUILD__) return '';
	const root = wpRest().root;
	return root ? `${String(root).replace(/\/$/, '')}/xo/v1/lead` : '';
}

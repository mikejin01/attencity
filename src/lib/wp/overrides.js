/* global __WP_BUILD__ */
// =====================================================================
// Live content overrides.
//
// Anything a logged-in user edits on the site is stored in the WordPress
// database and SHADOWS the defaults in src/lib/content/. This module applies
// that shadow once, at module load, by walking the content tree and replacing
// any string whose dot-path has a saved override.
//
// Keys are dot-paths into the content tree (`home.hero.title`,
// `home.hero.slides.0.image`). The playbook keys overrides per route because
// its keys are generic; here every path is already globally unique, so a flat
// map is both simpler and correct across client-side navigation — a per-route
// map applied at load would go stale the moment the visitor navigates.
// =====================================================================
import { wpRest } from './runtime.js';

/** The saved map of dot-path → value. Empty outside WordPress. */
export function savedOverrides() {
	if (!__WP_BUILD__) return {};
	const c = wpRest().content;
	return c && typeof c === 'object' ? c : {};
}

/**
 * Replace, in place, every string in `tree` whose dot-path has an override.
 * Mutates rather than clones: the content module exports these objects by
 * reference and components already hold them.
 *
 * @param {Record<string, unknown>} roots  top-level name → object
 */
export function applyOverrides(roots) {
	if (!__WP_BUILD__) return roots;
	const map = savedOverrides();
	if (!map || Object.keys(map).length === 0) return roots;

	const seen = new WeakSet();
	const walk = (node, path) => {
		if (node === null || typeof node !== 'object') return;
		if (seen.has(node)) return;
		seen.add(node);
		for (const key of Object.keys(node)) {
			const child = node[key];
			const p = `${path}.${key}`;
			if (typeof child === 'string') {
				if (Object.prototype.hasOwnProperty.call(map, p)) node[key] = map[p];
			} else {
				walk(child, p);
			}
		}
	};
	for (const [name, root] of Object.entries(roots)) walk(root, name);
	return roots;
}

/** The current value for a dot-path, or the shipped default. */
export function overrideOr(key, fallback) {
	const map = savedOverrides();
	return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : fallback;
}

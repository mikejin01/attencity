/* global __WP_BUILD__ */
// =====================================================================
// Posts written in the WordPress dashboard.
//
// The site ships with its case studies and insights as markdown in
// src/content/ (see src/lib/content/posts.js). Those stay exactly as they
// are. This module adds anything the client has since written and merges the
// two into one list, newest first.
//
// The list arrives inline with the page, in the theme's wpRest payload, so a
// listing renders complete on first paint. Fetching it instead would resolve
// after the grid had drawn and shove a new card into it — a layout shift every
// visitor would see. Only the post being viewed carries its body; opening
// another post through client-side navigation fetches that one body on demand.
//
// A markdown post and a WordPress post are told apart by `body`.
// =====================================================================
import { wpRest } from './runtime.js';

class WPPosts {
	insights = $state([]);
	caseStudies = $state([]);
	/** True once we know what there is, inline or fetched. */
	loaded = $state(false);
	#fetched = false;

	/** Read the list the theme printed into the page. Synchronous by design. */
	init() {
		if (!__WP_BUILD__) return;
		const p = wpRest().posts;
		if (p && typeof p === 'object') {
			this.insights = Array.isArray(p.insights) ? p.insights : [];
			this.caseStudies = Array.isArray(p.caseStudies) ? p.caseStudies : [];
			this.loaded = true;
			return;
		}
		// No inline payload: an optimisation plugin may have stripped the script.
		this.#fetchAll();
	}

	async #fetchAll() {
		if (this.#fetched) return;
		this.#fetched = true;
		try {
			const root = String(wpRest().root ?? '/wp-json/').replace(/\/$/, '');
			const res = await fetch(`${root}/xo/v1/posts`, { credentials: 'same-origin' });
			if (res.ok) {
				const data = await res.json();
				this.insights = Array.isArray(data.insights) ? data.insights : [];
				this.caseStudies = Array.isArray(data.caseStudies) ? data.caseStudies : [];
			}
		} catch {
			/* leave the lists as they are — the shipped posts still render */
		} finally {
			this.loaded = true;
		}
	}

	/**
	 * Make sure this post has its body. Needed when a visitor arrives at a post
	 * through client-side navigation, since the inline payload belonged to
	 * whichever page they landed on first.
	 */
	async ensureBody(kind, slug) {
		if (!__WP_BUILD__) return;
		const found = this.#raw(kind, slug);
		if (!found || found.body != null) return;
		await this.#fetchAll();
	}

	#raw(kind, slug) {
		const list = kind === 'case-study' ? this.caseStudies : this.insights;
		return list.find((p) => p.slug === slug);
	}

	bySlug(kind, slug) {
		const found = this.#raw(kind, slug);
		// `type` is what PostFooter and postHref key off, so a dashboard post has
		// to carry it just like a shipped one.
		return found ? { ...found, type: kind } : undefined;
	}
}

export const wpPosts = new WPPosts();

/**
 * Shipped posts plus anything written in WordPress, newest first.
 * A WordPress post with the same slug as a shipped one wins, so a post can be
 * taken over in the dashboard without touching the repo.
 *
 * @param {any[]} builtin
 * @param {any[]} fromWp
 * @param {'insight'|'case-study'} type
 */
export function mergePosts(builtin, fromWp, type) {
	if (!__WP_BUILD__ || fromWp.length === 0) return builtin;
	const overridden = new Set(fromWp.map((p) => p.slug));
	return [...builtin.filter((p) => !overridden.has(p.slug)), ...fromWp.map((p) => ({ ...p, type }))].sort(
		(a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
	);
}

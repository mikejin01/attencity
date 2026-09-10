/* global __WP_BUILD__ */
// =====================================================================
// Edit-mode state for logged-in WordPress users.
//
// A logged-in user sees an "Edit page" button. Turning it on makes every
// element marked with the `editable` / `editableImage` actions (actions.js)
// live-editable; Save posts the whole draft to the theme in one request.
//
// Nothing here runs in the static build: __WP_BUILD__ is false, isLoggedIn
// never becomes true, and the toolbar never renders.
// =====================================================================
import { wpRest } from './runtime.js';

/** Registered editables, so Cancel can put the DOM back without a reload. */
const registry = new Map(); // key -> { restore(value) }

class WPEdit {
	isLoggedIn = $state(false);
	isEditing = $state(false);
	saving = $state(false);
	/** '' | 'saved' | 'error' — drives the toolbar's transient message. */
	status = $state('');
	/** Unsaved edits: dot-path → new value. */
	draft = $state({});

	get dirty() {
		return Object.keys(this.draft).length > 0;
	}

	get count() {
		return Object.keys(this.draft).length;
	}

	/**
	 * Called once from the root layout. Treats several signals as "logged in",
	 * because a cached or optimised page can arrive without the inline payload.
	 */
	async init() {
		if (!__WP_BUILD__ || typeof document === 'undefined') return;
		const known =
			wpRest().isLoggedIn === true ||
			document.body.classList.contains('logged-in') ||
			document.body.classList.contains('admin-bar') ||
			!!document.getElementById('wpadminbar');
		if (known) {
			this.isLoggedIn = true;
			return;
		}
		// The payload is an inline script, which speed plugins like to defer or
		// strip. Ask the theme directly before concluding the visitor is a guest.
		if (!wpRest().root) await this.#loadBootstrap();
		this.isLoggedIn = wpRest().isLoggedIn === true;
	}

	async #loadBootstrap() {
		try {
			const res = await fetch('/wp-json/xo/v1/bootstrap', { credentials: 'same-origin' });
			if (res.ok) window.wpRest = { ...(window.wpRest ?? {}), ...(await res.json()) };
		} catch {
			/* offline or the route is unavailable — stay a guest, never throw */
		}
	}

	register(key, restore) {
		registry.set(key, restore);
		return () => registry.delete(key);
	}

	update(key, value) {
		this.draft = { ...this.draft, [key]: value };
		this.status = '';
	}

	start() {
		this.isEditing = true;
		this.status = '';
	}

	cancel() {
		for (const [key, restore] of registry) {
			if (key in this.draft) restore(undefined);
		}
		this.draft = {};
		this.isEditing = false;
		this.status = '';
	}

	async save() {
		if (!this.dirty) {
			this.isEditing = false;
			return;
		}
		this.saving = true;
		this.status = '';
		try {
			const root = String(wpRest().root ?? '/wp-json/').replace(/\/$/, '');
			const res = await fetch(`${root}/xo/v1/save-page-data`, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': wpRest().nonce ?? '' },
				body: JSON.stringify({ content: this.draft })
			});
			if (!res.ok) throw new Error(`save-page-data responded ${res.status}`);
			// Fold the saved values into the payload so a later Cancel restores to
			// what is now live, not to the copy the theme shipped with.
			window.wpRest = {
				...(window.wpRest ?? {}),
				content: { ...(wpRest().content ?? {}), ...this.draft }
			};
			this.draft = {};
			this.isEditing = false;
			this.status = 'saved';
		} catch {
			this.status = 'error';
		} finally {
			this.saving = false;
		}
	}
}

export const wpEdit = new WPEdit();

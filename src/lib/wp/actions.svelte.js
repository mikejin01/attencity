/* global __WP_BUILD__ */
// =====================================================================
// The two editable primitives, as Svelte actions rather than wrapper
// components.
//
// Why actions: a wrapper changes the DOM, and the playbook's own scar (§4.1a)
// is a wrapper whose controls escaped to a distant positioned ancestor and
// rendered nowhere near their image. An action adds no element, so it cannot
// shift layout, cannot break a descendant CSS selector, and has nothing to
// anchor wrongly — the image overlay is positioned from the image's own
// bounding box in a fixed layer that sits above everything.
// =====================================================================
import { wpEdit } from './edit.svelte.js';

/* ------------------------------------------------------------- shared bits */

let layer = null;

function overlayLayer() {
	if (layer) return layer;
	layer = document.createElement('div');
	layer.className = 'xo-edit-layer';
	document.body.appendChild(layer);
	return layer;
}

let stylesInjected = false;
function injectStyles() {
	if (stylesInjected || typeof document === 'undefined') return;
	stylesInjected = true;
	const css = document.createElement('style');
	css.textContent = `
.xo-edit-layer { position: fixed; inset: 0; pointer-events: none; z-index: 2147483000; }
.xo-editable-text {
	outline: 2px dashed rgba(245, 196, 0, 0.9);
	outline-offset: 3px;
	cursor: text;
	border-radius: 2px;
}
.xo-editable-text:focus { outline-style: solid; background: rgba(245, 196, 0, 0.08); }
.xo-img-overlay {
	position: absolute;
	display: flex; align-items: center; justify-content: center; gap: 8px;
	flex-direction: column; padding: 8px;
	background: rgba(11, 22, 34, 0.55);
	opacity: 0; transition: opacity 0.15s ease;
	pointer-events: auto;
}
.xo-img-overlay:hover, .xo-img-overlay:focus-within, .xo-img-overlay.is-open { opacity: 1; }
.xo-img-overlay button {
	font: 600 13px/1.2 system-ui, sans-serif;
	padding: 8px 14px; border-radius: 999px; border: 0;
	background: #fff; color: #17181b; cursor: pointer;
}
@media (hover: none) { .xo-img-overlay { opacity: 1; background: none; justify-content: flex-end; } }
`;
	document.head.appendChild(css);
}

/**
 * Run `fn` whenever edit mode changes, and clean up on destroy.
 * `$effect.root` is used because an action has no component effect context of
 * its own to hang a plain `$effect` on.
 */
function watchEditMode(fn) {
	const stop = $effect.root(() => {
		$effect(() => {
			fn(wpEdit.isEditing);
		});
	});
	return stop;
}

/* ------------------------------------------------------------------- text */

/**
 * Make an element's text editable in edit mode.
 *
 *   <h1 use:editable={'home.hero.title'}>{home.hero.title}</h1>
 *
 * The element keeps its own markup and styling; only contenteditable and an
 * outline are added, so nothing reflows when edit mode turns on.
 *
 * @param {HTMLElement} node
 * @param {string} key  dot-path into the content tree
 */
export function editable(node, key) {
	if (!__WP_BUILD__) return;
	const original = node.textContent;

	const commit = () => {
		const next = node.innerText.replace(/ /g, ' ').trim();
		if (next !== (wpEdit.draft[key] ?? original)) wpEdit.update(key, next);
	};
	const onKeydown = (e) => {
		// Enter commits a single-line field instead of inserting a <div>.
		if (e.key === 'Enter' && !e.shiftKey && node.dataset.xoMultiline !== 'true') {
			e.preventDefault();
			node.blur();
		}
		if (e.key === 'Escape') {
			node.textContent = original;
			node.blur();
		}
	};

	const unregister = wpEdit.register(key, (value) => {
		node.textContent = value === undefined ? original : value;
	});

	const stop = watchEditMode((on) => {
		if (on) {
			injectStyles();
			node.setAttribute('contenteditable', 'plaintext-only');
			node.classList.add('xo-editable-text');
			node.addEventListener('blur', commit);
			node.addEventListener('keydown', onKeydown);
		} else {
			node.removeAttribute('contenteditable');
			node.classList.remove('xo-editable-text');
			node.removeEventListener('blur', commit);
			node.removeEventListener('keydown', onKeydown);
		}
	});

	return {
		destroy() {
			stop();
			unregister();
		}
	};
}

/* ------------------------------------------------------------------ images */

/**
 * Make an <img> replaceable from the WordPress Media Library.
 *
 *   <img use:editableImage={s.image} src={asset(s.image)} …>
 *
 * The argument is the image's own path, the same value passed to asset(), so a
 * component never has to know where its image sits in the content tree.
 *
 * The overlay lives in a fixed layer and is positioned from the image's own
 * rect, so it always covers exactly the image and can never escape to another
 * ancestor. It is created only in edit mode and removed when edit mode ends.
 *
 * @param {HTMLImageElement} node
 * @param {string} file  the image path, as passed to asset()
 */
export function editableImage(node, file) {
	if (!__WP_BUILD__) return;
	const key = `img.${file}`;
	const original = node.getAttribute('src');
	let box = null;
	let frame = 0;

	const place = () => {
		if (!box) return;
		const r = node.getBoundingClientRect();
		box.style.transform = `translate(${r.left}px, ${r.top}px)`;
		box.style.width = `${r.width}px`;
		box.style.height = `${r.height}px`;
	};
	const track = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(place);
	};

	const apply = (url) => {
		node.setAttribute('src', url);
		// A replaced photo has its own dimensions; a stale srcset would keep
		// serving the old file at some viewport widths.
		node.removeAttribute('srcset');
		wpEdit.update(key, url);
	};

	const pick = () => {
		const media = window.wp?.media;
		if (!media) {
			const url = window.prompt('Image URL', node.getAttribute('src') ?? '');
			if (url) apply(url.trim());
			return;
		}
		const frameUi = media({ title: 'Replace image', multiple: false, library: { type: 'image' } });
		frameUi.on('select', () => {
			const a = frameUi.state().get('selection').first().toJSON();
			if (a?.url) apply(a.url);
		});
		frameUi.open();
	};

	const mount = () => {
		if (box) return;
		injectStyles();
		box = document.createElement('div');
		box.className = 'xo-img-overlay';
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.textContent = 'Replace image';
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			pick();
		});
		box.appendChild(btn);
		overlayLayer().appendChild(box);
		place();
		window.addEventListener('scroll', track, { passive: true, capture: true });
		window.addEventListener('resize', track, { passive: true });
	};

	const unmount = () => {
		if (!box) return;
		window.removeEventListener('scroll', track, { capture: true });
		window.removeEventListener('resize', track);
		cancelAnimationFrame(frame);
		box.remove();
		box = null;
	};

	const unregister = wpEdit.register(key, (value) => {
		if (value === undefined && original !== null) node.setAttribute('src', original);
		else if (value !== undefined) node.setAttribute('src', value);
	});

	const stop = watchEditMode((on) => (on ? mount() : unmount()));

	return {
		destroy() {
			stop();
			unmount();
			unregister();
		}
	};
}

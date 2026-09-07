// Svelte actions used across components.

/**
 * Reveal-on-scroll: fades/translates an element into view once.
 *
 * Anything the visitor can already see on load is left exactly as the
 * prerendered HTML painted it. Two reasons: hiding already-painted content to
 * animate it back in flashes, and — for an element taller than the space left
 * below the fold — a percentage-of-element threshold never fires, so the
 * content stayed blank until the visitor scrolled. That is what left the
 * case-study and insights listings white on ~800px-tall viewports.
 *
 * @param {HTMLElement} node
 */
export function reveal(node) {
	if (typeof IntersectionObserver === 'undefined') return;

	let io;
	// Decided after the first frame so the measurement sees settled layout and
	// the scroll position SvelteKit restores on navigation.
	const frame = requestAnimationFrame(() => {
		if (node.getBoundingClientRect().top < window.innerHeight) return;
		node.classList.add('reveal');
		io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add('in');
						io.unobserve(node);
					}
				}
			},
			// threshold 0 with a small FIXED inset: a percentage threshold is
			// measured against the element, so a 560px card needs more of the
			// viewport than a short one before it will ever fire.
			{ threshold: 0, rootMargin: '0px 0px -60px 0px' }
		);
		io.observe(node);
	});

	return {
		destroy() {
			cancelAnimationFrame(frame);
			io?.disconnect();
		}
	};
}

/**
 * Lazily loads + plays a muted background clip only while it's on (or near)
 * screen, and pauses it off-screen. Keeps heavy social videos from downloading
 * on first paint and stealing bandwidth from the hero. Pair with `preload="none"`
 * and NO `autoplay` attribute on the <video>.
 * Pass `{ autoplay: false }` to load on approach but leave playback to the user
 * (used under prefers-reduced-motion).
 * @param {HTMLVideoElement} node
 * @param {{ autoplay?: boolean }} [opts]
 */
export function lazyVideo(node, opts = {}) {
	const autoplay = opts.autoplay !== false;
	node.muted = true; // required for programmatic play() without a user gesture
	node.preload = 'none';
	const play = () => {
		if (!autoplay) {
			node.preload = 'metadata';
			return;
		}
		const p = node.play();
		if (p && typeof p.catch === 'function') p.catch(() => {});
	};
	if (typeof IntersectionObserver === 'undefined') {
		play();
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) play();
				else node.pause();
			}
		},
		{ rootMargin: '200px 0px' }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}

/**
 * Adds `.scrolled` to the node once the window scrolls past `offset`px.
 * @param {HTMLElement} node
 * @param {number} offset
 */
export function scrolled(node, offset = 40) {
	const update = () => node.classList.toggle('scrolled', window.scrollY > offset);
	update();
	window.addEventListener('scroll', update, { passive: true });
	return {
		destroy() {
			window.removeEventListener('scroll', update);
		}
	};
}

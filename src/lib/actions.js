// Svelte actions used across components.

/**
 * Reveal-on-scroll: fades/translates an element into view once.
 * Falls back to visible immediately if IntersectionObserver is unavailable.
 * @param {HTMLElement} node
 */
export function reveal(node) {
	node.classList.add('reveal');
	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('in');
		return;
	}
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in');
					io.unobserve(node);
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
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

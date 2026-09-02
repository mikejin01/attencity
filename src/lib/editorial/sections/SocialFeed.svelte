<!-- Social feed marquee (template's #social carousel): auto-scrolling track of
     portrait video cards, prev/next + play/pause controls, per-card pause,
     clips lazy-loaded only when near the viewport. Cards link to the post when
     `href` is set in home.social.clips. -->
<script>
	import { onMount } from 'svelte';
	import { home, asset } from '$lib/content/attencity.js';
	import { lazyVideo } from '$lib/actions.js';

	const s = home.social;
	const reduced =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	let trackEl = $state(null);
	let marqueeX = 0;
	let marqueePlaying = $state(!reduced);
	let pausedVideos = $state({});
	let raf;

	function marqueeLoop() {
		if (trackEl && marqueePlaying) {
			marqueeX -= 0.6; // ~36px/s
			const half = trackEl.scrollWidth / 2;
			if (-marqueeX >= half) marqueeX += half;
			trackEl.style.transform = `translate3d(${marqueeX}px,0,0)`;
		}
		raf = requestAnimationFrame(marqueeLoop);
	}
	function marqueeStep(dir) {
		if (!trackEl) return;
		const card = trackEl.querySelector('.card');
		const step = (card ? card.offsetWidth : 400) + 20;
		marqueeX += dir * step;
		const half = trackEl.scrollWidth / 2;
		if (-marqueeX >= half) marqueeX += half;
		if (marqueeX > 0) marqueeX -= half;
		trackEl.style.transition = 'transform .45s ease-in-out';
		trackEl.style.transform = `translate3d(${marqueeX}px,0,0)`;
		setTimeout(() => trackEl && (trackEl.style.transition = 'none'), 460);
	}
	function toggleCardVideo(i, e) {
		const vid = e.currentTarget.parentElement.querySelector('video');
		if (!vid) return;
		if (vid.paused) {
			vid.play();
			pausedVideos = { ...pausedVideos, [i]: false };
		} else {
			vid.pause();
			pausedVideos = { ...pausedVideos, [i]: true };
		}
	}

	onMount(() => {
		raf = requestAnimationFrame(marqueeLoop);
		return () => cancelAnimationFrame(raf);
	});
</script>

<section class="page-section padding-sm" id="social">
	<div class="container container--md">
		<div class="content-blocks text-center">
			<div class="content-blocks__block"><span class="section-eyebrow">{s.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title">{s.title}</h2></div>
		</div>
	</div>
	<div class="container container--fluid">
		<div class="auto-media-carousel" role="region" aria-roledescription="carousel" aria-label="Social feed">
			<button class="carousel-btn prev" type="button" aria-label="Previous slide" onclick={() => marqueeStep(1)}>
				<svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" /></svg>
			</button>
			<button class="carousel-btn next" type="button" aria-label="Next slide" onclick={() => marqueeStep(-1)}>
				<svg viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" transform="translate(100, 100) rotate(180)" /></svg>
			</button>
			<button
				class="carousel-btn play-pause"
				type="button"
				class:playing={marqueePlaying}
				class:paused={!marqueePlaying}
				aria-label={marqueePlaying ? 'Pause carousel' : 'Play carousel'}
				onclick={() => (marqueePlaying = !marqueePlaying)}><span></span></button
			>
			<div class="carousel-track" bind:this={trackEl}>
				{#each [...s.clips, ...s.clips] as clip, i}
					<div class="card content-hover">
						{#if clip.href}
							<a href={clip.href} target="_blank" rel="noopener noreferrer" aria-label="View this post on {clip.network ?? 'social media'}" class="ig-link">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z" /></svg>
							</a>
						{/if}
						<div class="media-container">
							<!-- svelte-ignore a11y_media_has_caption -->
							<video
								src={asset(clip.file)}
								poster={asset(clip.poster)}
								loop
								muted
								playsinline
								preload="none"
								aria-label={clip.label ?? `Social clip ${(i % s.clips.length) + 1}`}
								use:lazyVideo={{ autoplay: !reduced }}
							></video>
							<button
								class="video-toggle"
								type="button"
								class:playing={!pausedVideos[i] && !reduced}
								class:paused={pausedVideos[i] || reduced}
								aria-label={pausedVideos[i] || reduced ? 'Play video' : 'Pause video'}
								onclick={(e) => toggleCardVideo(i, e)}
							></button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

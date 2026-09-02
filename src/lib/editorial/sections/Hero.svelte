<!-- Home hero: full-bleed background slider (event photos) under the template's dark
     overlay. Slides crossfade on a timer; the active slide gets the slow Ken Burns zoom.
     Auto-advance pauses while the tab is hidden and is off under prefers-reduced-motion
     (the dots still work there). The first slide is the LCP image and is preloaded. -->
<script>
	import { onMount } from 'svelte';
	import { home, asset, route, srcset } from '$lib/content/attencity.js';
	import { openContact } from '$lib/contact.svelte.js';
	const h = home.hero;
	const slides = h.slides;

	let active = $state(0);
	let timer;

	const stop = () => {
		clearInterval(timer);
		timer = undefined;
	};
	const start = () => {
		stop();
		if (slides.length < 2 || document.hidden) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		timer = setInterval(() => (active = (active + 1) % slides.length), h.interval);
	};
	const goTo = (i) => {
		active = i;
		start(); // restart the countdown from the slide the user picked
	};

	onMount(() => {
		start();
		document.addEventListener('visibilitychange', start);
		return () => {
			stop();
			document.removeEventListener('visibilitychange', start);
		};
	});
</script>

<svelte:head>
	<!-- the first slide is the LCP element on every visit — fetch it before the CSS/JS bundles finish -->
	<link rel="preload" as="image" imagesrcset={srcset(slides[0].image, slides[0].width)} imagesizes="100vw" fetchpriority="high" />
</svelte:head>

<div class="page-header">
	<section class="page-section padding-lg ninety-percent-height hero">
		<div class="page-section__background">
			<div class="page-section__overlay" style="opacity: 0.5"></div>
			{#each slides as s, i (s.image)}
				<img
					class="hero-img hero-slide"
					class:is-active={i === active}
					src={asset(s.image)}
					srcset={srcset(s.image, s.width)}
					sizes="100vw"
					width={s.width}
					height={s.height}
					alt=""
					style="object-position: {s.position ?? 'center'}"
					fetchpriority={i === 0 ? 'high' : 'low'}
					decoding="async"
					aria-hidden={i !== active}
				/>
			{/each}
		</div>
		<div class="container container--md">
			<div class="content-blocks text-center hero-content">
				<div class="content-blocks__block"><h1 class="h1">{h.title}</h1></div>
				<div class="content-blocks__block">
					<p class="hero-sub">
						<strong class="hero-sub__lead">{h.lead}</strong>
						<span class="hero-sub__text">{h.text}</span>
					</p>
				</div>
				<div class="content-blocks__block">
					<div class="content-block__links hero-links">
						<button class="btn btn-primary" type="button" onclick={openContact}>{h.primary}</button>
						<a class="btn btn-outline-light" href={route(h.secondaryHref)}>{h.secondary}</a>
					</div>
				</div>
			</div>
		</div>
		{#if slides.length > 1}
			<div class="hero-dots" role="group" aria-label="Background photos">
				{#each slides as s, i (s.image)}
					<button
						class="hero-dot"
						class:is-active={i === active}
						type="button"
						aria-label="Show photo {i + 1} of {slides.length}"
						aria-pressed={i === active}
						onclick={() => goTo(i)}
					></button>
				{/each}
			</div>
		{/if}
		<div class="scroll-arrow-container">
			<a href="#social" class="scroll-arrow" aria-label="Scroll down">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9l8 7 8-7" /></svg>
			</a>
		</div>
	</section>
</div>

<!-- Home hero: full-bleed background slider (event photos) under the template's dark
     overlay. Slides crossfade on a timer; the active slide gets the slow Ken Burns zoom.
     Auto-advance pauses while the tab is hidden and is off under prefers-reduced-motion
     (the dots still work there). The first slide is the LCP image and is preloaded. -->
<script>
	import { onMount } from 'svelte';
	import { home, asset, route, srcset, dims } from '$lib/content/attencity.js';
	import { openContact } from '$lib/contact.svelte.js';
	import { editable, editableImage, editableLink } from '$lib/wp/actions.svelte.js';
	const h = home.hero;
	const slides = h.slides;

	let active = $state(0);
	/** Only the first slide is fetched with the document — it is the LCP image.
	 *  The rest are ~100 KB each and none can be seen for at least `interval`
	 *  ms, so we fetch one slide ahead of the rotation: the next one arrives
	 *  when the browser is idle, and the others only if the visitor stays. */
	let maxLoaded = $state(0);
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
	// keep one slide in hand ahead of whatever is on screen
	$effect(() => {
		if (active + 1 > maxLoaded) maxLoaded = active + 1;
	});
	const goTo = (i) => {
		active = i;
		start(); // restart the countdown from the slide the user picked
	};

	onMount(() => {
		const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1500));
		idle(() => (maxLoaded = Math.max(maxLoaded, 1)));
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
	<link rel="preload" as="image" imagesrcset={srcset(slides[0].image)} imagesizes="100vw" fetchpriority="high" />
</svelte:head>

<div class="page-header">
	<section class="page-section padding-lg ninety-percent-height hero">
		<div class="page-section__background">
			<div class="page-section__overlay" style="opacity: 0.5"></div>
			{#each slides as s, i (s.image)}
				<img
					class="hero-img hero-slide"
					class:is-active={i === active}
					src={i <= maxLoaded ? asset(s.image) : null}
					use:editableImage={s.image}
					srcset={i <= maxLoaded && srcset(s.image) ? srcset(s.image) : null}
					sizes="100vw"
					width={dims(s.image)?.width}
					height={dims(s.image)?.height}
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
				<div class="content-blocks__block">
					<h1 class="h1" use:editable={'home.hero.title'}>{h.title}</h1>
				</div>
				<div class="content-blocks__block">
					<p class="hero-sub">
						<strong class="hero-sub__lead" use:editable={'home.hero.lead'}>{h.lead}</strong>
						<span class="hero-sub__text" data-xo-multiline="true" use:editable={'home.hero.text'}>{h.text}</span>
					</p>
				</div>
				<div class="content-blocks__block">
					<div class="content-block__links hero-links">
						<button class="btn btn-primary" type="button" onclick={openContact}>
							<span use:editable={'home.hero.primary'}>{h.primary}</span>
						</button>
						<a
							class="btn btn-outline-light"
							href={route(h.secondaryHref)}
							use:editableLink={'home.hero.secondaryHref'}
						>
							<span use:editable={'home.hero.secondary'}>{h.secondary}</span>
						</a>
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

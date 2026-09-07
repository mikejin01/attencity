<!-- Compact dark hero for inner pages (~52vh): eyebrow, page title as <h1>, sub-line. -->
<script>
	import { asset, srcset, dims } from '$lib/content/attencity.js';
	let { title, eyebrow = '', sub = '', image, position = 'center', children } = $props();
</script>

<div class="page-header">
	<section class="page-section padding-lg page-hero">
		<div class="page-section__background">
			<div class="page-section__overlay" style="opacity: 0.62"></div>
			<img class="hero-img hero-img--still" src={asset(image)} srcset={srcset(image) || undefined} sizes="100vw" width={dims(image)?.width} height={dims(image)?.height} alt="" style="object-position: {position}" fetchpriority="high" decoding="async" />
		</div>
		<div class="container container--md">
			<div class="content-blocks text-center hero-content">
				{#if eyebrow}
					<div class="content-blocks__block"><span class="section-eyebrow section-eyebrow--light">{eyebrow}</span></div>
				{/if}
				<div class="content-blocks__block"><h1 class="h1">{title}</h1></div>
				{#if sub}
					<div class="content-blocks__block"><p class="hero-sub">{sub}</p></div>
				{/if}
				{@render children?.()}
			</div>
		</div>
	</section>
</div>

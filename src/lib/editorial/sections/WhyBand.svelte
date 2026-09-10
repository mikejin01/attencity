<!-- "Why ATTENCITY" — dark band, billboard image left, four icon items right (plan §4.4). -->
<script>
	import { home, whyPoints, asset, srcset, dims } from '$lib/content/attencity.js';
	import { lineIcons } from '$lib/editorial/icons.js';
	import { reveal } from '$lib/actions.js';
	import { editable, editableImage } from '$lib/wp/actions.svelte.js';
	const w = home.why;
</script>

<section class="page-section page-section--dark padding-md" id="why">
	<div class="container container--lg">
		<div class="why-grid">
			<figure class="why-media" use:reveal>
				<img src={asset(w.image)} use:editableImage={w.image} srcset={srcset(w.image) || undefined} sizes="(min-width: 992px) 38vw, 100vw" alt={w.alt} loading="lazy" decoding="async" width={dims(w.image)?.width} height={dims(w.image)?.height} />
			</figure>
			<div class="why-body">
				<span class="title-rule"></span>
				<h2 class="section-title" use:editable={'home.why.title'}>{w.title}</h2>
				<p class="why-lead" data-xo-multiline="true" use:editable={'home.why.lead'}>{w.lead}</p>
				<ul class="why-list">
					{#each whyPoints as p (p.title)}
						<li class="why-item" use:reveal>
							<span class="why-ic" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
									{#each lineIcons[p.icon] as d}<path {d} />{/each}
								</svg>
							</span>
							<div>
								<h3 class="why-title">{p.title}</h3>
								<p class="why-copy">{p.copy}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

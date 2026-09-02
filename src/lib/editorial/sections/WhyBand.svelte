<!-- "Why ATTENCITY" — dark band, billboard image left, four icon items right (plan §4.4). -->
<script>
	import { home, whyPoints, asset, srcset } from '$lib/content/attencity.js';
	import { lineIcons } from '$lib/editorial/icons.js';
	import { reveal } from '$lib/actions.js';
	const w = home.why;
</script>

<section class="page-section page-section--dark padding-md" id="why">
	<div class="container container--lg">
		<div class="why-grid">
			<figure class="why-media" use:reveal>
				<img src={asset(w.image)} srcset={srcset(w.image, w.imageWidth)} sizes="(min-width: 992px) 38vw, 100vw" alt={w.alt} loading="lazy" decoding="async" width="1236" height="1600" />
			</figure>
			<div class="why-body">
				<span class="title-rule"></span>
				<h2 class="section-title">{w.title}</h2>
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

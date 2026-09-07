<!-- Photo gallery for case studies and posts. Images keep their intrinsic
     ratio inside a masonry-ish grid; no lightbox, so nothing to trap focus. -->
<script>
	import { asset, srcset, dims } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	let { images = [], title = '', band = 'white', id } = $props();
</script>

{#if images.length}
	<section class="page-section padding-md" class:page-section--alt={band === 'alt'} {id}>
		<div class="container container--lg">
			{#if title}<h2 class="section-title text-center gallery__title" use:reveal>{title}</h2>{/if}
			<ul class="gallery">
				{#each images as img (img.file)}
					<li class="gallery__item" use:reveal>
						<img
							src={asset(img.file)}
							srcset={srcset(img.file) || undefined}
							sizes="(min-width: 992px) 33vw, 100vw"
							width={dims(img.file)?.width}
							height={dims(img.file)?.height}
							alt={img.alt ?? ''}
							loading="lazy"
							decoding="async"
						/>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

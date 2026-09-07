<!-- Two-column band: text + rounded image card. Used for "Services for
     Individual" (home, §4.5) and the About intro (§5.2). Extra body content
     goes in the `children` snippet. -->
<script>
	import { asset, srcset, dims, route } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	/** @type {{ id?: string, eyebrow?: string, title: string, lead?: string, image: string, alt?: string,
	 *  cta?: {label: string, href: string}, band?: 'white'|'alt', mediaLeft?: boolean, children?: import('svelte').Snippet }} */
	let { id, eyebrow = '', title, lead = '', image, alt = '', cta, band = 'alt', mediaLeft = false, children } = $props();
</script>

<section class="page-section padding-md" class:page-section--alt={band === 'alt'} {id}>
	<div class="container container--lg">
		<div class="split" class:split--media-left={mediaLeft}>
			<div class="split__body" use:reveal>
				{#if eyebrow}<span class="section-eyebrow">{eyebrow}</span>{:else}<span class="title-rule"></span>{/if}
				<h2 class="section-title">{title}</h2>
				{#if lead}<p class="split__lead">{lead}</p>{/if}
				{@render children?.()}
				{#if cta}
					<div class="content-block__links split__cta">
						<a class="btn btn-primary" href={route(cta.href)}>{cta.label}</a>
					</div>
				{/if}
			</div>
			<figure class="split__media" use:reveal>
				<img
					src={asset(image)}
					srcset={srcset(image) || undefined}
					sizes="(min-width: 900px) 45vw, 100vw"
					width={dims(image)?.width}
					height={dims(image)?.height}
					{alt}
					loading="lazy"
					decoding="async"
				/>
			</figure>
		</div>
	</div>
</section>

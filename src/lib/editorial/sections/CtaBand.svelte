<!-- Dark statement band with a single CTA ("Have any questions?", careers). -->
<script>
	import { route } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	let { id, eyebrow = '', title, body = '', button, href, onclick } = $props();
</script>

<section class="page-section statement-band" {id}>
	<div class="statement-band__overlay"></div>
	<div class="container container--md">
		<div class="content-blocks text-center" use:reveal>
			{#if eyebrow}<div class="content-blocks__block"><span class="section-eyebrow">{eyebrow}</span></div>{/if}
			<div class="content-blocks__block"><h2 class="section-title">{title}</h2></div>
			{#if body}<div class="content-blocks__block"><p class="statement-band__lead">{body}</p></div>{/if}
			<div class="content-blocks__block">
				<div class="content-block__links statement-band__cta">
					{#if onclick}
						<button class="btn btn-primary" type="button" {onclick}>{button}</button>
					{:else}
						<a class="btn btn-primary" href={route(href)}>{button}</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

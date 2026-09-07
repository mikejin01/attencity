<!-- FAQ list. Native <details> so it works without JS and stays accessible;
     the same array is emitted as FAQPage JSON-LD by the page. -->
<script>
	import { reveal } from '$lib/actions.js';
	let { faq = [], title = 'Frequently asked', band = 'white', id = 'faq' } = $props();
</script>

{#if faq.length}
	<section class="page-section padding-md" class:page-section--alt={band === 'alt'} {id}>
		<div class="container container--md">
			<h2 class="section-title text-center faq__title" use:reveal>{title}</h2>
			<div class="faq" use:reveal>
				{#each faq as item (item.q)}
					<details class="faq__item">
						<summary class="faq__q">{item.q}</summary>
						<p class="faq__a">{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>
{/if}

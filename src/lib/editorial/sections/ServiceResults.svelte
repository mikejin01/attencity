<!-- "Results" on a service landing page: a number with the sentence that makes
     it mean something. Distinct from the `Proof` stat tiles above it, which
     carry capability figures (assistants tracked, markets covered) rather than
     outcomes we produced for a client.

     Renders nothing until `results.items` has entries, so a service page can
     ship on methodology and gain its results the moment they exist. -->
<script>
	import { reveal } from '$lib/actions.js';

	/** @type {{ results?: {title?: string, lead?: string, note?: string,
	 *  items: {value: string, label: string, context?: string}[]},
	 *  band?: 'white'|'alt'|'dark', id?: string }} */
	let { results, band = 'alt', id = 'results' } = $props();
</script>

{#if results?.items?.length}
	<section
		class="page-section padding-md"
		class:page-section--alt={band === 'alt'}
		class:page-section--dark={band === 'dark'}
		{id}
	>
		<div class="container container--lg">
			<div class="content-blocks text-center" use:reveal>
				<div class="content-blocks__block">
					<h2 class="section-title">{results.title ?? 'Results'}</h2>
				</div>
				{#if results.lead}
					<div class="content-blocks__block"><p class="section-sub">{results.lead}</p></div>
				{/if}
			</div>
			<ul class="result-cards" use:reveal>
				{#each results.items as r (r.label)}
					<li class="result-card">
						<span class="result-card__value">{r.value}</span>
						<span class="result-card__label">{r.label}</span>
						{#if r.context}<p class="result-card__context">{r.context}</p>{/if}
					</li>
				{/each}
			</ul>
			{#if results.note}<p class="result-cards__note">{results.note}</p>{/if}
		</div>
	</section>
{/if}

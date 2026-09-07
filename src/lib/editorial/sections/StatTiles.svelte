<!-- "At a glance" numbers: case-study headline stats and service proof. -->
<script>
	import { reveal } from '$lib/actions.js';
	let { stats, title = '', band = 'alt', id } = $props();
</script>

{#if stats?.length}
	<section class="page-section padding-md" class:page-section--alt={band === 'alt'} {id}>
		<div class="container container--lg">
			{#if title}<h2 class="section-title text-center stat-tiles__title" use:reveal>{title}</h2>{/if}
			<ul class="stat-tiles" use:reveal>
				{#each stats as s (s.label)}
					<li class="stat-tile">
						<span class="stat-tile__value">{s.value}</span>
						<span class="stat-tile__label">{s.label}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

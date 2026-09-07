<!-- Thin proof strip under the hero: the five numbers from the one-pager. -->
<script>
	import { trustStrip } from '$lib/content/attencity.js';
</script>

<section class="page-section trust-strip" aria-label="Attencity by the numbers">
	<div class="container container--lg">
		<ul class="trust-strip__list">
			{#each trustStrip as s (s.label)}
				<li class="trust-strip__item">
					<span class="trust-strip__value">{s.value}</span>
					<span class="trust-strip__label">{s.label}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

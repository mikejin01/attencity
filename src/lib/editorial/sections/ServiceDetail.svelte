<!-- One service block on /services/ (plan §5.1): number, chevron title,
     description, and an "Outcome" callout when the client has supplied one. -->
<script>
	import { reveal } from '$lib/actions.js';
	let { service, index, band = 'white' } = $props();
	const num = String(index + 1).padStart(2, '0');
</script>

<section class="page-section padding-md svc-detail-section" class:page-section--alt={band === 'alt'} id={service.slug}>
	<div class="container container--lg">
		<div class="svc-detail" use:reveal>
			<div class="svc-detail__head">
				<span class="svc-detail__num" data-num={num} aria-hidden="true"></span>
				<h2 class="svc-detail__title"><span class="chev" aria-hidden="true">&gt;</span>{service.title}</h2>
			</div>
			<div class="svc-detail__body">
				<p class="svc-detail__lead">{service.description ?? service.summary}</p>
				{#if service.outcome}
					<div class="outcome">
						<span class="outcome__label">Outcome</span>
						<p>{service.outcome}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

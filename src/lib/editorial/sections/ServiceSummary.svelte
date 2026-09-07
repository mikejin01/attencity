<!-- One row on the /services/ hub: number, chevron title, one-line summary,
     outcome callout and a "Read more" link to the service's own page.
     `legacyAnchor` keeps old /services/#brand-strategy style links landing on
     the right block after the slugs were renamed (plan §5.2). -->
<script>
	import { route } from '$lib/content/attencity.js';
	import { serviceIcons } from '$lib/editorial/icons.js';
	import { reveal } from '$lib/actions.js';
	let { service, index, cta = 'Read more' } = $props();
	const num = $derived(String(index + 1).padStart(2, '0'));
	const href = $derived(route(`/services/${service.slug}/`));
</script>

<li class="svc-summary" id={service.slug} use:reveal>
	{#if service.legacyAnchor && service.legacyAnchor !== service.slug}
		<span class="anchor-alias" id={service.legacyAnchor} aria-hidden="true"></span>
	{/if}
	<div class="svc-summary__head">
		<span class="svc-summary__num" aria-hidden="true">{num}</span>
		<span class="svc-summary__icon" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
				{#each serviceIcons[service.slug] as d}<path {d} />{/each}
			</svg>
		</span>
		<h3 class="svc-summary__title"><a {href}>{service.title}</a></h3>
	</div>
	<div class="svc-summary__body">
		<p class="svc-summary__lead">{service.summary}</p>
		{#if service.outcome}
			<div class="outcome">
				<span class="outcome__label">Outcome</span>
				<p>{service.outcome}</p>
			</div>
		{/if}
		<a class="svc-summary__more" {href}>{cta} <span aria-hidden="true">→</span></a>
	</div>
</li>

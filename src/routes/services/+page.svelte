<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import ServiceDetail from '$lib/editorial/sections/ServiceDetail.svelte';
	import CtaBand from '$lib/editorial/sections/CtaBand.svelte';
	import { services, servicesPage as p } from '$lib/content/attencity.js';
</script>

<Seo
	title={p.title}
	path="/services/"
	description="Brand strategy and localization, media and PR, social and influencer marketing, e-commerce growth, events and activations, and GEO/AI distribution — Attencity's six services."
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} imageWidth={p.hero.imageWidth} />
<div id="page-body">
	{#each services as service, i (service.slug)}
		<ServiceDetail {service} index={i} band={i % 2 ? 'alt' : 'white'} />
	{/each}
	<CtaBand id="questions" title={p.cta.title} body={p.cta.body} button={p.cta.button} href={p.cta.href} />
</div>

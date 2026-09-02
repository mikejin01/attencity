<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import Hero from '$lib/editorial/sections/Hero.svelte';
	import ServiceGrid from '$lib/editorial/sections/ServiceGrid.svelte';
	import WhyBand from '$lib/editorial/sections/WhyBand.svelte';
	import SplitFeature from '$lib/editorial/sections/SplitFeature.svelte';
	import ClientLogos from '$lib/editorial/sections/ClientLogos.svelte';
	import Statement from '$lib/editorial/sections/Statement.svelte';
	import SocialFeed from '$lib/editorial/sections/SocialFeed.svelte';
	import ContactCta from '$lib/editorial/sections/ContactCta.svelte';
	import { home } from '$lib/content/attencity.js';
	const ind = home.servicesIndividual;
</script>

<Seo path="/" />

<Hero />
<div id="page-body">
	<SocialFeed />
	<ServiceGrid />
	<WhyBand />
	<SplitFeature
		id="individual"
		title={ind.title}
		lead={ind.body}
		image={ind.image}
		alt={ind.alt}
		cta={{ label: ind.cta, href: ind.ctaHref }}
		band="alt"
	/>
	<ClientLogos />
	<Statement id="insights" title={home.insights.title} body={home.insights.body} />
	<ContactCta />
</div>

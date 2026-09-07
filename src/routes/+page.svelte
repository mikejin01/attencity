<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import Hero from '$lib/editorial/sections/Hero.svelte';
	import TrustStrip from '$lib/editorial/sections/TrustStrip.svelte';
	import ServiceGrid from '$lib/editorial/sections/ServiceGrid.svelte';
	import WhyBand from '$lib/editorial/sections/WhyBand.svelte';
	import SplitFeature from '$lib/editorial/sections/SplitFeature.svelte';
	import PartnersBand from '$lib/editorial/sections/PartnersBand.svelte';
	import ClientLogos from '$lib/editorial/sections/ClientLogos.svelte';
	import PostGrid from '$lib/editorial/sections/PostGrid.svelte';
	import SocialFeed from '$lib/editorial/sections/SocialFeed.svelte';
	import ContactCta from '$lib/editorial/sections/ContactCta.svelte';
	import { home, caseStudiesPage, insightsPage } from '$lib/content/attencity.js';
	import { caseStudies, insights } from '$lib/content/posts.js';

	const ind = home.servicesIndividual;
	const recentWork = caseStudies.slice(0, 3);
	const latestInsights = insights.slice(0, 3);
</script>

<Seo path="/" image="og/home.jpg" />

<Hero />
<div id="page-body">
	<TrustStrip />
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
	<PartnersBand />
	<ClientLogos />
	{#if caseStudiesPage.enabled && recentWork.length}
		<PostGrid
			id="recent-work"
			posts={recentWork}
			eyebrow={home.recentWork.eyebrow}
			title={home.recentWork.title}
			cta={{ label: home.recentWork.cta, href: home.recentWork.ctaHref }}
		/>
	{/if}
	{#if insightsPage.enabled && latestInsights.length}
		<PostGrid
			id="insights"
			posts={latestInsights}
			eyebrow={home.latestInsights.eyebrow}
			title={home.latestInsights.title}
			cta={{ label: home.latestInsights.cta, href: home.latestInsights.ctaHref }}
			band="alt"
		/>
	{/if}
	<ContactCta />
</div>

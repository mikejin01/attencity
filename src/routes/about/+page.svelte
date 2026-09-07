<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import SplitFeature from '$lib/editorial/sections/SplitFeature.svelte';
	import PurposeMission from '$lib/editorial/sections/PurposeMission.svelte';
	import Methodology from '$lib/editorial/sections/Methodology.svelte';
	import NetworkReach from '$lib/editorial/sections/NetworkReach.svelte';
	import FounderSpotlight from '$lib/editorial/sections/FounderSpotlight.svelte';
	import TeamGrid from '$lib/editorial/sections/TeamGrid.svelte';
	import CtaBand from '$lib/editorial/sections/CtaBand.svelte';
	import { aboutPage as p } from '$lib/content/attencity.js';
	import { breadcrumbs } from '$lib/seo/jsonld.js';
	import { openContact } from '$lib/contact.svelte.js';

	const w = p.whoWeAre;
	const trail = [{ name: 'About', path: '/about/' }];
</script>

<Seo
	title={p.title}
	path="/about/"
	image="og/about.jpg"
	description="Attencity is a New York marketing and communications firm with U.S. and China-based teams. Our 3A × 4R methodology turns visibility into brand assets."
	jsonLd={breadcrumbs(trail)}
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} position="center 30%" />
<Breadcrumbs {trail} />
<div id="page-body">
	<SplitFeature
		id="who-we-are"
		eyebrow={w.eyebrow}
		title={w.title}
		lead={w.lead}
		image={w.image}
		alt={w.alt}
		band="white"
		mediaLeft
	>
		{#each w.body as para (para)}
			<p class="split__para">{para}</p>
		{/each}
		<div class="content-block__links split__cta">
			<button class="btn btn-primary" type="button" onclick={openContact}>Get in touch</button>
		</div>
	</SplitFeature>
	<PurposeMission />
	<Methodology />
	<NetworkReach />
	<FounderSpotlight />
	{#if p.showTeam}
		<TeamGrid />
	{/if}
	<CtaBand id="careers" eyebrow={p.careers.eyebrow} title={p.careers.title} body={p.careers.body} button={p.careers.button} href={p.careers.href} />
</div>

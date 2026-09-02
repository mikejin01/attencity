<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import SplitFeature from '$lib/editorial/sections/SplitFeature.svelte';
	import FounderSpotlight from '$lib/editorial/sections/FounderSpotlight.svelte';
	import TeamGrid from '$lib/editorial/sections/TeamGrid.svelte';
	import CtaBand from '$lib/editorial/sections/CtaBand.svelte';
	import { aboutPage as p, whyPoints } from '$lib/content/attencity.js';
	import { openContact } from '$lib/contact.svelte.js';
</script>

<Seo
	title={p.title}
	path="/about/"
	description="Attencity is a brand-authority agency with U.S. and China-based teams — combining PR, social, AI distribution, and real-world activations to turn visibility into long-term brand assets."
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} imageWidth={p.hero.imageWidth} position="center 30%" />
<div id="page-body">
	<SplitFeature
		id="intro"
		eyebrow={p.intro.eyebrow}
		title={p.intro.title}
		lead={p.intro.lead}
		image={p.intro.image}
		alt={p.intro.alt}
		band="white"
		mediaLeft
	>
		<ul class="point-list">
			{#each whyPoints as w (w.title)}
				<li class="point">
					<span class="point__mark" aria-hidden="true">&gt;</span>
					<div>
						<h3 class="point__title">{w.title}</h3>
						<p class="point__copy">{w.copy}</p>
					</div>
				</li>
			{/each}
		</ul>
		<div class="content-block__links split__cta">
			<button class="btn btn-primary" type="button" onclick={openContact}>Get in touch</button>
		</div>
	</SplitFeature>
	<FounderSpotlight />
	{#if p.showTeam}
		<TeamGrid />
	{/if}
	<CtaBand id="careers" eyebrow={p.careers.eyebrow} title={p.careers.title} body={p.careers.body} button={p.careers.button} href={p.careers.href} />
</div>

<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import PostGrid from '$lib/editorial/sections/PostGrid.svelte';
	import CtaBand from '$lib/editorial/sections/CtaBand.svelte';
	import { insightsPage as p } from '$lib/content/attencity.js';
	import { insights } from '$lib/content/posts.js';
	import { breadcrumbs, itemListGraph } from '$lib/seo/jsonld.js';
	import { openContact } from '$lib/contact.svelte.js';

	const trail = [{ name: 'Insights', path: '/insights/' }];
</script>

<Seo
	title={p.title}
	path="/insights/"
	description="Event recaps and media partnership news from Attencity: CES, Lincoln Center, the UN, NYU and the US–China corridor."
	image="og/insights.jpg"
	jsonLd={[breadcrumbs(trail), itemListGraph(insights, '/insights/')]}
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} position="center 40%" />
<Breadcrumbs {trail} />
<div id="page-body">
	<PostGrid posts={insights} sub={p.intro} />
	<CtaBand
		id="insights-cta"
		title="Working on a cross-border launch?"
		body="Tell us about your market, your product, and where you want to be seen."
		button="Get in touch"
		onclick={openContact}
	/>
</div>

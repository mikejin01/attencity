<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import PostGrid from '$lib/editorial/sections/PostGrid.svelte';
	import PostFilters from '$lib/editorial/sections/PostFilters.svelte';
	import CtaBand from '$lib/editorial/sections/CtaBand.svelte';
	import { caseStudiesPage as p } from '$lib/content/attencity.js';
	import { caseStudies, filterOptions, filterPosts } from '$lib/content/posts.js';
	import { breadcrumbs, itemListGraph } from '$lib/seo/jsonld.js';
	import { openContact } from '$lib/contact.svelte.js';
	import { wpPosts, mergePosts } from '$lib/wp/posts.svelte.js';

	// Shipped posts plus anything written in WordPress, newest first.
	const allPosts = $derived(mergePosts(caseStudies, wpPosts.caseStudies, 'case-study'));
	// Filtering is client-side over the full list, so the page that ships (and
	// the one a crawler sees) still carries every case study; the structured
	// data below is built from `allPosts` for the same reason.
	let service = $state('');
	let industry = $state('');
	const options = $derived(filterOptions(allPosts));
	const shown = $derived(filterPosts(allPosts, { service, industry }));
	const trail = [{ name: 'Case Studies', path: '/case-studies/' }];
</script>

<Seo
	title={p.title}
	path="/case-studies/"
	description="Pop-ups, launches, creator parties and cross-border PR programmes Attencity has run in New York and across the US — with the numbers attached."
	image="og/case-studies.jpg"
	jsonLd={[breadcrumbs(trail), itemListGraph(allPosts, '/case-studies/')]}
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} position="center 45%" />
<Breadcrumbs {trail} />
<div id="page-body">
	<PostGrid
		posts={shown}
		sub={p.intro}
		tags
		empty="No case studies match those filters yet — clear one to see more."
	>
		<PostFilters {options} bind:service bind:industry allLabel={p.filterAll} count={shown.length} />
	</PostGrid>
	<CtaBand
		id="work-cta"
		title="Want a launch that produces proof?"
		body="Tell us about your market, your product, and where you want to be seen."
		button="Get in touch"
		onclick={openContact}
	/>
</div>

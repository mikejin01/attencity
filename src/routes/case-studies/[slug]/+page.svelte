<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import StatTiles from '$lib/editorial/sections/StatTiles.svelte';
	import Gallery from '$lib/editorial/sections/Gallery.svelte';
	import PostFooter from '$lib/editorial/sections/PostFooter.svelte';
	import ContactCta from '$lib/editorial/sections/ContactCta.svelte';
	import { caseStudyBySlug, formatDate } from '$lib/content/posts.js';
	import { breadcrumbs, postGraph, eventGraph } from '$lib/seo/jsonld.js';

	// Bodies are globbed here rather than in posts.js, so listings and the home
	// page never pull a post's markup into their bundles.
	const bodies = import.meta.glob('/src/content/case-studies/*.md', { eager: true });
	const bodyOf = (slug) => bodies[`/src/content/case-studies/${slug}.md`]?.default;

	let { data } = $props();
	const post = $derived(caseStudyBySlug[data.slug]);
	const Body = $derived(bodyOf(data.slug));
	const trail = $derived([
		{ name: 'Case Studies', path: '/case-studies/' },
		{ name: post.title, path: `/case-studies/${post.slug}/` }
	]);
	const graphs = $derived([breadcrumbs(trail), postGraph(post), eventGraph(post)].filter(Boolean));
</script>

<Seo
	title={post.seoTitle ?? post.title}
	path="/case-studies/{post.slug}/"
	description={post.seoDescription ?? post.excerpt}
	image="og/case-studies-{post.slug}.jpg"
	type="article"
	publishedTime={post.date}
	jsonLd={graphs}
/>

<PageHero title={post.title} eyebrow="Case study" image={post.hero} position="center 45%">
	<div class="content-blocks__block">
		<ul class="post-meta">
			{#if post.client}<li><span>Client</span>{post.client}</li>{/if}
			{#if post.location}<li><span>Where</span>{post.location}</li>{/if}
			<li>
				<span>When</span><time datetime={post.date}>{post.dateLabel ?? formatDate(post.date)}</time>
			</li>
		</ul>
	</div>
</PageHero>
<Breadcrumbs {trail} />

<div id="page-body">
	<StatTiles stats={post.stats} title="At a glance" band="alt" id="at-a-glance" />

	<section class="page-section padding-md">
		<div class="container container--md">
			<article class="prose">
				<Body />
			</article>
		</div>
	</section>

	<Gallery images={post.gallery} title="From the day" band="alt" id="gallery" />
	<PostFooter {post} />
	<ContactCta formLocation="case-study:{post.slug}" idPrefix="cs" />
</div>

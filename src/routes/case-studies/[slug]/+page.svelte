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
	import { route } from '$lib/content/attencity.js';
	import { wpPosts } from '$lib/wp/posts.svelte.js';

	// Bodies are globbed here rather than in posts.js, so listings and the home
	// page never pull a post's markup into their bundles.
	const bodies = import.meta.glob('/src/content/case-studies/*.md', { eager: true });
	const bodyOf = (slug) => bodies[`/src/content/case-studies/${slug}.md`]?.default;

	let { data } = $props();
	// Either a case study shipped as markdown or one written in the WordPress
	// dashboard. The shipped one wins and is the only one with a compiled body.
	const builtin = $derived(caseStudyBySlug[data.slug]);
	const post = $derived(builtin ?? wpPosts.bySlug('case-study', data.slug));
	const Body = $derived(builtin ? bodyOf(data.slug) : null);
	// Arriving here through client-side navigation means the inline payload
	// belonged to a different page, so this post's body may not be in hand yet.
	$effect(() => {
		if (!builtin) wpPosts.ensureBody('case-study', data.slug);
	});
	const trail = $derived([
		{ name: 'Case Studies', path: '/case-studies/' },
		...(post ? [{ name: post.title, path: `/case-studies/${post.slug}/` }] : [])
	]);
	const graphs = $derived(
		post ? [breadcrumbs(trail), postGraph(post), eventGraph(post)].filter(Boolean) : []
	);
</script>

{#if post}
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
					{#if Body}
						<Body />
					{:else if post.body}
						<!-- Written in WordPress: already rendered through the_content(). -->
						{@html post.body}
					{/if}
				</article>
			</div>
		</section>

		<Gallery images={post.gallery} title="From the day" band="alt" id="gallery" />
		<PostFooter {post} />
		<ContactCta formLocation="case-study:{post.slug}" idPrefix="cs" />
	</div>
{:else if wpPosts.loaded}
	<section class="page-section padding-lg">
		<div class="container container--md">
			<h1 class="h1">Case study not found</h1>
			<p>It may have been unpublished. <a href={route('/case-studies/')}>See all case studies</a>.</p>
		</div>
	</section>
{/if}

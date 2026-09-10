<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import Gallery from '$lib/editorial/sections/Gallery.svelte';
	import PostFooter from '$lib/editorial/sections/PostFooter.svelte';
	import ContactCta from '$lib/editorial/sections/ContactCta.svelte';
	import { insightBySlug, formatDate } from '$lib/content/posts.js';
	import { insightsPage, asset, dims, route } from '$lib/content/attencity.js';
	import { breadcrumbs, postGraph } from '$lib/seo/jsonld.js';
	import { editableImage } from '$lib/wp/actions.svelte.js';
	import { wpPosts } from '$lib/wp/posts.svelte.js';

	const bodies = import.meta.glob('/src/content/insights/*.md', { eager: true });
	const bodyOf = (slug) => bodies[`/src/content/insights/${slug}.md`]?.default;

	let { data } = $props();
	// A post is either one shipped as markdown or one written in the WordPress
	// dashboard. The shipped one wins, and only it has a compiled Svelte body;
	// a dashboard post carries rendered HTML instead.
	const builtin = $derived(insightBySlug[data.slug]);
	const post = $derived(builtin ?? wpPosts.bySlug('insight', data.slug));
	const Body = $derived(builtin ? bodyOf(data.slug) : null);
	// Arriving here through client-side navigation means the inline payload
	// belonged to a different page, so this post's body may not be in hand yet.
	$effect(() => {
		if (!builtin) wpPosts.ensureBody('insight', data.slug);
	});
	const author = $derived(post?.author ?? insightsPage.author);
	const trail = $derived([
		{ name: 'Insights', path: '/insights/' },
		...(post ? [{ name: post.title, path: `/insights/${post.slug}/` }] : [])
	]);
</script>

{#if post}
	<Seo
		title={post.seoTitle ?? post.title}
		path="/insights/{post.slug}/"
		description={post.seoDescription ?? post.excerpt}
		image="og/insights-{post.slug}.jpg"
		type="article"
		publishedTime={post.date}
		jsonLd={[breadcrumbs(trail), postGraph(post)]}
	/>

	<PageHero title={post.title} eyebrow="Insights" image={post.hero} position="center 45%">
		<div class="content-blocks__block">
			<ul class="post-meta">
				<li>
					<span>Published</span><time datetime={post.date}>{post.dateLabel ?? formatDate(post.date)}</time>
				</li>
				{#if post.location}<li><span>Where</span>{post.location}</li>{/if}
				<li><span>By</span>{author.name}</li>
			</ul>
		</div>
	</PageHero>
	<Breadcrumbs {trail} />

	<div id="page-body">
		<section class="page-section padding-md">
			<div class="container container--md">
				<p class="post-standfirst">{post.excerpt}</p>
				<article class="prose">
					{#if Body}
						<Body />
					{:else if post.body}
						<!-- Written in WordPress: already rendered through the_content(), so
						     blocks, shortcodes and embeds behave as the editor intends. -->
						{@html post.body}
					{/if}
				</article>
				<div class="author-box">
					<img class="author-box__photo" src={asset(author.image)} use:editableImage={author.image} alt="" width={dims(author.image)?.width} height={dims(author.image)?.height} loading="lazy" decoding="async" />
					<div>
						<span class="author-box__name">{author.name}</span>
						<span class="author-box__role">{author.role}</span>
					</div>
				</div>
			</div>
		</section>

		<Gallery images={post.gallery} title="Photos" band="alt" id="gallery" />
		<PostFooter {post} />
		<ContactCta formLocation="insight:{post.slug}" idPrefix="ins" />
	</div>
{:else if wpPosts.loaded}
	<section class="page-section padding-lg">
		<div class="container container--md">
			<h1 class="h1">Post not found</h1>
			<p>That post may have been unpublished. <a href={route('/insights/')}>See all insights</a>.</p>
		</div>
	</section>
{/if}

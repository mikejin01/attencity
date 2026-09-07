<!-- Shared tail of a case study / insights post: the services it is proof
     for, then previous/next within the same collection. -->
<script>
	import { serviceBySlug, route } from '$lib/content/attencity.js';
	import { neighbours, postHref } from '$lib/content/posts.js';
	import { reveal } from '$lib/actions.js';

	let { post } = $props();
	const related = $derived((post.services ?? []).map((s) => serviceBySlug[s]).filter(Boolean));
	const { prev: newer, next: older } = $derived(neighbours(post));
	const servicesLabel = $derived(
		post.type === 'case-study' ? 'Services in this project' : 'Related services'
	);
</script>

<section class="page-section padding-md post-footer">
	<div class="container container--lg">
		{#if related.length}
			<div class="post-services" use:reveal>
				<span class="footer-label">{servicesLabel}</span>
				<ul class="chip-list">
					{#each related as s (s.slug)}
						<li><a class="chip" href={route(`/services/${s.slug}/`)}>{s.navTitle ?? s.title}</a></li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if newer || older}
			<nav class="post-nav" aria-label="More like this">
				{#if older}
					<a class="post-nav__link post-nav__link--prev" href={route(postHref(older))}>
						<span class="post-nav__dir">Older</span>
						<span class="post-nav__title">{older.title}</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if newer}
					<a class="post-nav__link post-nav__link--next" href={route(postHref(newer))}>
						<span class="post-nav__dir">Newer</span>
						<span class="post-nav__title">{newer.title}</span>
					</a>
				{/if}
			</nav>
		{/if}
	</div>
</section>

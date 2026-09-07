<!-- Card grid shared by the case-study and insights listings, the home
     "Recent work" / "Latest insights" rows, and the related-content blocks. -->
<script>
	import { asset, srcset, dims, route } from '$lib/content/attencity.js';
	import { postHref, formatDate } from '$lib/content/posts.js';
	import { reveal } from '$lib/actions.js';

	/** @type {{ posts: any[], eyebrow?: string, title?: string, sub?: string,
	 *  cta?: {label: string, href: string}, band?: 'white'|'alt'|'dark', id?: string,
	 *  compact?: boolean, headingLevel?: 2|3 }} */
	let { posts, eyebrow = '', title = '', sub = '', cta, band = 'white', id, compact = false, headingLevel = 2 } = $props();
</script>

<section
	class="page-section padding-md"
	class:page-section--alt={band === 'alt'}
	class:page-section--dark={band === 'dark'}
	{id}
>
	<div class="container container--lg">
		{#if title || eyebrow || sub}
			<div class="content-blocks text-center" use:reveal>
				{#if eyebrow}<div class="content-blocks__block"><span class="section-eyebrow">{eyebrow}</span></div>{/if}
				{#if title}
					<div class="content-blocks__block">
						{#if headingLevel === 3}
							<h3 class="section-title">{title}</h3>
						{:else}
							<h2 class="section-title">{title}</h2>
						{/if}
					</div>
				{/if}
				{#if sub}<div class="content-blocks__block"><p class="section-sub">{sub}</p></div>{/if}
			</div>
		{/if}

		<ul class="post-grid" class:post-grid--compact={compact}>
			{#each posts as p (p.slug)}
				<li class="post-card" use:reveal>
					<a class="post-card__link" href={route(postHref(p))}>
						<span class="post-card__media">
							<img
								src={asset(p.hero)}
								srcset={srcset(p.hero) || undefined}
								sizes="(min-width: 992px) 33vw, 100vw"
								width={dims(p.hero)?.width}
								height={dims(p.hero)?.height}
								alt={p.heroAlt ?? ''}
								loading="lazy"
								decoding="async"
							/>
						</span>
						<span class="post-card__body">
							<span class="post-card__meta">
								<span class="post-card__kind">{p.type === 'case-study' ? 'Case study' : 'Insight'}</span>
								<time datetime={p.date}>{p.dateLabel ?? formatDate(p.date)}</time>
							</span>
							<span class="post-card__title">{p.title}</span>
							<span class="post-card__excerpt">{p.excerpt}</span>
							{#if p.stats?.length}
								<span class="post-card__stats">
									{#each p.stats.slice(0, 2) as s (s.label)}
										<span class="post-card__stat"><b>{s.value}</b> {s.label}</span>
									{/each}
								</span>
							{/if}
						</span>
					</a>
				</li>
			{/each}
		</ul>

		{#if cta}
			<div class="section-cta text-center">
				<a class="btn btn-outline-light" href={route(cta.href)}>{cta.label}</a>
			</div>
		{/if}
	</div>
</section>

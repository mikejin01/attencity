<!-- Per-route <head>: title, description, canonical, Open Graph, and JSON-LD.
     `jsonLd` takes one object or an array; the sitewide Organization graph is
     emitted once from the root layout, so pages only add their own types. -->
<script>
	import { site } from '$lib/content/attencity.js';

	/** @type {{ title?: string|null, description?: string, path?: string, image?: string|null,
	 *  type?: 'website'|'article', publishedTime?: string|null, modifiedTime?: string|null,
	 *  noindex?: boolean, jsonLd?: object|object[]|null }} */
	let {
		title = null,
		description = site.description,
		path = '/',
		image = null,
		type = 'website',
		publishedTime = null,
		modifiedTime = null,
		noindex = false,
		jsonLd = null
	} = $props();

	const fullTitle = $derived(title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`);
	const url = $derived(`${site.url}${path}`);
	/** Assets are absolute for crawlers, which never see the `base` prefix. */
	const ogImage = $derived(`${site.url}/assets/attencity/${image ?? site.ogImage}`);
	const graphs = $derived(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}<meta name="robots" content="noindex, follow" />{/if}
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={ogImage} />
	{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}
	{#if modifiedTime}<meta property="article:modified_time" content={modifiedTime} />{/if}
	<meta name="twitter:card" content="summary_large_image" />
	{#each graphs as graph, i (i)}
		{@html `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}<\/script>`}
	{/each}
</svelte:head>

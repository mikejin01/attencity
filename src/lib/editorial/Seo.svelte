<!-- Per-route <head>: title, description, canonical + Open Graph. -->
<script>
	import { site } from '$lib/content/attencity.js';
	let { title = null, description = site.description, path = '/' } = $props();
	const fullTitle = $derived(title ? `${title} - ${site.name}` : `${site.name} — ${site.tagline}`);
	const url = $derived(`${site.url}${path}`);
	const image = `${site.url}/assets/attencity/${site.ogImage}`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<script>
	import '../app.css';
	import '$lib/editorial/editorial.css';
	import Navbar from '$lib/editorial/Navbar.svelte';
	import Footer from '$lib/editorial/Footer.svelte';
	import ContactModal from '$lib/components/ContactModal.svelte';
	import Analytics from '$lib/components/Analytics.svelte';
	import { organizationGraph } from '$lib/seo/jsonld.js';
	import { contactConfig } from '$lib/content/attencity.js';
	import { captureAttribution } from '$lib/lead.js';
	import { onMount } from 'svelte';

	let { children } = $props();
	// UTM / referrer / landing page, stored once per session so a lead keeps
	// its attribution even when it is submitted several pages later.
	onMount(captureAttribution);
	// Organization / ProfessionalService / WebSite — emitted once for the whole
	// site; per-page types are added by <Seo jsonLd={…} />.
	const orgGraph = JSON.stringify(organizationGraph()).replace(/</g, '\\u003c');
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${orgGraph}<\/script>`}
	{#if contactConfig.turnstileSiteKey}
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
	{/if}
</svelte:head>

<Analytics />

<div class="sora">
	<a class="skip-link" href="#content">Skip to content</a>
	<Navbar />
	<main class="site-content" id="content">
		{@render children()}
	</main>
	<Footer />
	<!-- "Get in touch" modal is global so any CTA on any page can open it. -->
	<ContactModal />
</div>

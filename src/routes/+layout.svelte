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
	import EditToolbar from '$lib/wp/EditToolbar.svelte';
	import { wpEdit } from '$lib/wp/edit.svelte.js';
	import { wpPosts } from '$lib/wp/posts.svelte.js';
	import { onMount } from 'svelte';

	let { children } = $props();
	// UTM / referrer / landing page, stored once per session so a lead keeps
	// its attribution even when it is submitted several pages later.
	onMount(captureAttribution);
	// Decides whether this visitor is a logged-in WordPress user. A no-op in the
	// static build, where the toolbar can never appear.
	onMount(() => wpEdit.init());
	// Anything the client has written in the dashboard. Reads the list the theme
	// printed into the page, so listings paint complete. A no-op in the static build.
	wpPosts.init();
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

<!-- Editing chrome for logged-in WordPress users; renders nothing otherwise. -->
<EditToolbar />

<script>
	import '../app.css';
	import '$lib/editorial/editorial.css';
	import Navbar from '$lib/editorial/Navbar.svelte';
	import Footer from '$lib/editorial/Footer.svelte';
	import ContactModal from '$lib/components/ContactModal.svelte';

	let { children } = $props();
</script>

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

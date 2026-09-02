<!-- Full-bleed image CTA with the inline contact form (plan §4.8). -->
<script>
	import { home, asset } from '$lib/content/attencity.js';
	import ContactForm from '$lib/components/ContactForm.svelte';
	const c = home.contactCta;
</script>

<section class="page-section cta-section" id="contact">
	<img class="cta-bg" src={asset(c.image)} alt="" loading="lazy" decoding="async" />
	<div class="cta-overlay"></div>
	<div class="container container--md">
		<div class="content-blocks text-center cta-content">
			<div class="content-blocks__block"><span class="section-eyebrow">{c.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title cta-title">{c.title}</h2></div>
		</div>
		<div class="cta-form">
			<ContactForm idPrefix="home" />
		</div>
	</div>
</section>

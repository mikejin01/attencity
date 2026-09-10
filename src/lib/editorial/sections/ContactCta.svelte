<!-- Full-bleed image CTA with the inline contact form (plan §4.8). -->
<script>
	import { home, asset, srcset, dims } from '$lib/content/attencity.js';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import { editable, editableImage } from '$lib/wp/actions.svelte.js';
	const c = home.contactCta;
	/** Which page the lead came from, so the owner can analyse by surface
	 *  (plan §6.1 hidden fields). e.g. "service:media-pr". */
	let { formLocation = 'home', idPrefix = 'home' } = $props();
</script>

<section class="page-section cta-section" id="contact">
	<img
		class="cta-bg"
		src={asset(c.image)} use:editableImage={c.image}
		srcset={srcset(c.image) || undefined}
		sizes="100vw"
		width={dims(c.image)?.width}
		height={dims(c.image)?.height}
		alt=""
		loading="lazy"
		decoding="async"
	/>
	<div class="cta-overlay"></div>
	<div class="container container--md">
		<div class="content-blocks text-center cta-content">
			<div class="content-blocks__block"><span class="section-eyebrow">{c.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title cta-title" use:editable={'home.contactCta.title'}>{c.title}</h2></div>
		</div>
		<div class="cta-form">
			<ContactForm {idPrefix} {formLocation} submitLabel="Send message" />
		</div>
	</div>
</section>

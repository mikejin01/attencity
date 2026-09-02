<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import ContactInfo from '$lib/editorial/sections/ContactInfo.svelte';
	import { contactPage as p } from '$lib/content/attencity.js';
</script>

<Seo
	title={p.title}
	path="/contact/"
	description="Get in touch with Attencity. Tell us about your market, your product, and where you want to be seen."
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} imageWidth={p.hero.imageWidth} position="center 30%" />
<div id="page-body">
	<ContactInfo />
</div>

<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import ContactInfo from '$lib/editorial/sections/ContactInfo.svelte';
	import { contactPage as p, site } from '$lib/content/attencity.js';
	import { breadcrumbs } from '$lib/seo/jsonld.js';

	const trail = [{ name: 'Contact', path: '/contact/' }];
</script>

<Seo
	title={p.title}
	path="/contact/"
	image="og/contact.jpg"
	description="Get in touch with Attencity — {site.contact.street}, {site.contact.locality}, {site.contact.region} {site.contact.postalCode}. {site.contact.phone}."
	jsonLd={breadcrumbs(trail)}
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} position="center 30%" />
<Breadcrumbs {trail} />
<div id="page-body">
	<ContactInfo />
</div>

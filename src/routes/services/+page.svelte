<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import ServiceSummary from '$lib/editorial/sections/ServiceSummary.svelte';
	import CtaBand from '$lib/editorial/sections/CtaBand.svelte';
	import { services, servicesPage as p } from '$lib/content/attencity.js';
	import { breadcrumbs } from '$lib/seo/jsonld.js';

	const company = services.filter((s) => s.audience === 'company');
	const individual = services.filter((s) => s.audience === 'individual');
</script>

<Seo
	title={p.title}
	path="/services/"
	image="og/services.jpg"
	description="Attencity's seven services: brand strategy and localization, media and PR, social and influencer, GEO, e-commerce growth, events, and personal branding."
	jsonLd={breadcrumbs([{ name: 'Services', path: '/services/' }])}
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} />
<Breadcrumbs trail={[{ name: 'Services', path: '/services/' }]} />
<div id="page-body">
	<section class="page-section padding-md" id="for-companies">
		<div class="container container--lg">
			<h2 class="section-title text-center svc-summary__heading">{p.companyLabel}</h2>
			<ul class="svc-summary-list">
				{#each company as service, i (service.slug)}
					<ServiceSummary {service} index={i} cta={p.cardCta} />
				{/each}
			</ul>
		</div>
	</section>
	<section class="page-section page-section--alt padding-md" id="for-individuals">
		<div class="container container--lg">
			<h2 class="section-title text-center svc-summary__heading">{p.individualLabel}</h2>
			<ul class="svc-summary-list">
				{#each individual as service, i (service.slug)}
					<ServiceSummary {service} index={company.length + i} cta={p.cardCta} />
				{/each}
			</ul>
		</div>
	</section>
	<CtaBand id="questions" title={p.cta.title} body={p.cta.body} button={p.cta.button} href={p.cta.href} />
</div>

<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import Breadcrumbs from '$lib/editorial/sections/Breadcrumbs.svelte';
	import StatTiles from '$lib/editorial/sections/StatTiles.svelte';
	import PostGrid from '$lib/editorial/sections/PostGrid.svelte';
	import Faq from '$lib/editorial/sections/Faq.svelte';
	import ContactCta from '$lib/editorial/sections/ContactCta.svelte';
	import { serviceBySlug, servicePageChrome as chrome } from '$lib/content/attencity.js';
	import { relatedTo } from '$lib/content/posts.js';
	import { serviceIcons } from '$lib/editorial/icons.js';
	import { breadcrumbs, serviceGraph, faqGraph } from '$lib/seo/jsonld.js';
	import { reveal } from '$lib/actions.js';

	let { data } = $props();
	const service = $derived(serviceBySlug[data.slug]);
	const p = $derived(service.page);
	const related = $derived(relatedTo(data.slug));
	const trail = $derived([
		{ name: 'Services', path: '/services/' },
		{ name: service.title, path: `/services/${service.slug}/` }
	]);
	const graphs = $derived(
		[breadcrumbs(trail), serviceGraph(service), faqGraph(p.faq)].filter(Boolean)
	);
</script>

<Seo
	title={p.seoTitle}
	path="/services/{service.slug}/"
	description={p.seoDescription}
	image="og/services-{service.slug}.jpg"
	jsonLd={graphs}
/>

<PageHero
	title={p.h1}
	eyebrow="Services"
	sub={p.promise}
	image={p.hero.image}
	position={p.hero.position ?? 'center'}
/>
<Breadcrumbs {trail} />

<div id="page-body">
	<section class="page-section padding-md" id="overview">
		<div class="container container--lg">
			<div class="svc-page">
				<div class="svc-page__aside" use:reveal>
					<span class="svc-page__icon" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
							{#each serviceIcons[service.slug] as d}<path {d} />{/each}
						</svg>
					</span>
					<h2 class="section-title">{chrome.overviewTitle}</h2>
				</div>
				<div class="svc-page__body" use:reveal>
					{#each p.overview as para (para)}
						<p class="svc-page__para">{para}</p>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="page-section page-section--alt padding-md" id="what-we-do">
		<div class="container container--lg">
			<h2 class="section-title text-center svc-page__heading" use:reveal>{chrome.whatWeDoTitle}</h2>
			<ul class="wwd-list">
				{#each p.whatWeDo as item (item.title)}
					<li class="wwd-item" use:reveal>
						<span class="wwd-mark" aria-hidden="true">&gt;</span>
						<div>
							<h3 class="wwd-title">{item.title}</h3>
							<p class="wwd-copy">{item.copy}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="page-section page-section--dark padding-md" id="how-it-works">
		<div class="container container--lg">
			<h2 class="section-title text-center svc-page__heading" use:reveal>{chrome.howItWorksTitle}</h2>
			<ol class="steps">
				{#each p.howItWorks as step, i (step.title)}
					<li class="step" use:reveal>
						<span class="step__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<h3 class="step__title">{step.title}</h3>
						<p class="step__copy">{step.copy}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<StatTiles stats={p.stats} title={chrome.proofTitle} band="white" id="proof" />

	{#if related.caseStudies.length}
		<PostGrid
			posts={related.caseStudies}
			title={chrome.relatedCaseStudies}
			band="alt"
			compact
			id="related-work"
		/>
	{/if}
	{#if related.insights.length}
		<PostGrid posts={related.insights} title={chrome.relatedInsights} compact id="related-reading" />
	{/if}

	<Faq faq={p.faq} title={chrome.faqTitle} band={related.insights.length ? 'alt' : 'white'} />
	<ContactCta formLocation="service:{service.slug}" idPrefix="svc" />
</div>

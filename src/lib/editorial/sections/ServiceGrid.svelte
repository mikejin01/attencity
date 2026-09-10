<!-- "Services for Company" — six photo cards linking to their own landing
     pages (plan §5.1.3). Photos are frames from Attencity's own social clips. -->
<script>
	import { home, companyServices, asset, dims, route } from '$lib/content/attencity.js';
	import { serviceIcons } from '$lib/editorial/icons.js';
	import { reveal } from '$lib/actions.js';
	import { editable, editableImage, editableLink } from '$lib/wp/actions.svelte.js';
	const s = home.servicesCompany;
</script>

<section class="page-section padding-md" id="services">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="section-eyebrow">{s.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title section-title--statement" use:editable={'home.servicesCompany.title'}>{s.title}</h2></div>
		</div>
		<div class="svc-grid svc-grid--services">
			{#each companyServices as svc (svc.slug)}
				<a class="svc-card svc-card--service" href={route(`/services/${svc.slug}/`)} use:reveal>
					<img class="svc-bg" src={asset(svc.image)} use:editableImage={svc.image} alt={svc.imageAlt} loading="lazy" decoding="async" width={dims(svc.image)?.width} height={dims(svc.image)?.height} />
					<div class="svc-overlay"></div>
					<div class="svc-content">
						<span class="svc-icon" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
								{#each serviceIcons[svc.slug] as d}<path {d} />{/each}
							</svg>
						</span>
						<h3 class="svc-title">{svc.title}</h3>
						<p class="svc-body">{svc.short ?? svc.summary}</p>
						<span class="btn btn-light svc-btn">{s.cardCta}</span>
					</div>
				</a>
			{/each}
		</div>
		<div class="section-cta text-center">
			<a
				class="btn btn-outline-light"
				href={route(s.ctaHref)}
				use:editableLink={'home.servicesCompany.ctaHref'}
			>
				<span use:editable={'home.servicesCompany.cta'}>{s.cta}</span>
			</a>
		</div>
	</div>
</section>

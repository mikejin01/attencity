<!-- "Services for Company" — six photo cards (template image-card style) with an
     icon badge, title, summary and a "Learn more" pill, each linking to the
     matching block on /services/ (plan §4.3). Photos are frames from
     Attencity's own social clips. -->
<script>
	import { home, services, asset, route } from '$lib/content/attencity.js';
	import { serviceIcons } from '$lib/editorial/icons.js';
	import { reveal } from '$lib/actions.js';
	const s = home.servicesCompany;
</script>

<section class="page-section padding-md" id="services">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="section-eyebrow">{s.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title section-title--statement">{s.title}</h2></div>
		</div>
		<div class="svc-grid svc-grid--services">
			{#each services as svc (svc.slug)}
				<a class="svc-card svc-card--service" href={route(`/services/#${svc.slug}`)} use:reveal>
					<img class="svc-bg" src={asset(svc.image)} alt={svc.imageAlt} loading="lazy" decoding="async" width="720" height="1280" />
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
		<div class="section-cta">
			<a class="btn btn-primary" href={route(s.ctaHref)}>{s.cta}</a>
		</div>
	</div>
</section>

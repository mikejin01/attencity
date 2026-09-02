<!-- Case-studies listing: "coming soon" statement + three clearly-marked
     placeholder cards (template image-card style). No detail pages (plan §5.4). -->
<script>
	import { caseStudiesPage, asset } from '$lib/content/attencity.js';
	import { openContact } from '$lib/contact.svelte.js';
	import { reveal } from '$lib/actions.js';
	const c = caseStudiesPage;
</script>

<section class="page-section padding-md" id="case-studies">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="title-rule title-rule--center"></span></div>
			<div class="content-blocks__block"><h2 class="section-title">{c.comingSoon.title}</h2></div>
			<div class="content-blocks__block"><p class="section-sub">{c.comingSoon.body}</p></div>
			<div class="content-blocks__block">
				<div class="section-cta section-cta--tight">
					<button class="btn btn-primary" type="button" onclick={openContact}>Get in touch</button>
				</div>
			</div>
		</div>
		<ul class="svc-grid case-grid" aria-label="Upcoming case studies">
			{#each c.placeholders as p (p.title)}
				<li class="svc-card case-card" use:reveal>
					<img class="svc-bg" src={asset(p.image)} alt={p.alt} loading="lazy" decoding="async" />
					<div class="svc-overlay"></div>
					<div class="svc-content">
						<span class="svc-eyebrow">{p.label}</span>
						<h3 class="svc-title">{p.title}</h3>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

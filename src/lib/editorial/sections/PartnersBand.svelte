<!-- SMG partnership + the "Placements in" list. Only outlets whose evidence
     is actually published on the site are listed (plan §3.6 legal note), so
     holding a case study back automatically removes its outlets here. -->
<script>
	import { home, site, placements, route } from '$lib/content/attencity.js';
	import { caseStudyBySlug, insightBySlug } from '$lib/content/posts.js';
	import { reveal } from '$lib/actions.js';
	import { editable } from '$lib/wp/actions.svelte.js';

	const p = home.partners;
	const evidenced = placements.filter((x) =>
		x.type === 'case-study' ? caseStudyBySlug[x.proof] : insightBySlug[x.proof]
	);
	const href = (x) =>
		route(x.type === 'case-study' ? `/case-studies/${x.proof}/` : `/insights/${x.proof}/`);
</script>

<section class="page-section page-section--alt padding-md" id="partners">
	<div class="container container--lg">
		<div class="partners" use:reveal>
			<div class="partners__body">
				<span class="section-eyebrow">{p.eyebrow}</span>
				<h2 class="section-title">{p.title}</h2>
				<h3 class="partners__name" use:editable={'site.partnership.title'}>{site.partnership.title}</h3>
				<p class="partners__copy" data-xo-multiline="true" use:editable={'site.partnership.body'}>{site.partnership.body}</p>
			</div>
			{#if evidenced.length}
				<div class="partners__placements">
					<span class="footer-label">{p.placementsLabel}</span>
					<ul class="placement-list">
						{#each evidenced as x (x.outlet)}
							<li><a href={href(x)}>{x.outlet}</a></li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
</section>

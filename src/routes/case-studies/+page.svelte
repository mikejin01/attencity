<script>
	import Seo from '$lib/editorial/Seo.svelte';
	import PageHero from '$lib/editorial/sections/PageHero.svelte';
	import CaseStudyGrid from '$lib/editorial/sections/CaseStudyGrid.svelte';
	import { caseStudiesPage as p } from '$lib/content/attencity.js';
</script>

<Seo
	title={p.title}
	path="/case-studies/"
	description="Attencity case studies — how brands move from attention to authority across markets. Published case studies coming soon."
/>

<PageHero title={p.title} eyebrow={p.hero.eyebrow} sub={p.hero.sub} image={p.hero.image} imageWidth={p.hero.imageWidth} />
<div id="page-body">
	<CaseStudyGrid />
</div>

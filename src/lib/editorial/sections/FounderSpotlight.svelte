<!-- Founder spotlight (About): square portrait card + short bio + at-a-glance facts.
     Copy lives in aboutPage.founder. Reuses the split-feature grid. -->
<script>
	import { aboutPage, asset } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	const f = aboutPage.founder;
</script>

<section class="page-section page-section--alt padding-md" id="founder">
	<div class="container container--lg">
		<div class="split founder">
			<div class="split__body" use:reveal>
				<span class="section-eyebrow">{f.eyebrow}</span>
				<h2 class="section-title">{f.name}</h2>
				<p class="founder__role">{f.role}</p>
				<p class="split__lead">{f.lead}</p>
				{#each f.body as para (para)}
					<p class="founder__para">{para}</p>
				{/each}
				<dl class="founder__facts">
					{#each f.facts as fact (fact.label)}
						<div class="founder__fact">
							<dt>{fact.label}</dt>
							<dd>{fact.value}</dd>
						</div>
					{/each}
				</dl>
			</div>
			<figure class="split__media founder__media" use:reveal>
				<img src={asset(f.image)} alt={f.alt} loading="lazy" decoding="async" width="1080" height="1080" />
			</figure>
		</div>
	</div>
</section>

<!-- About: "Our purpose" statement + the four mission points (deck s3). -->
<script>
	import { aboutPage } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	const p = aboutPage.purpose;
</script>

<section class="page-section page-section--dark padding-md" id="purpose">
	<div class="container container--lg">
		<div class="purpose">
			<div class="purpose__head" use:reveal>
				<span class="section-eyebrow">{p.eyebrow}</span>
				<h2 class="section-title">{p.title}</h2>
				<p class="purpose__lead">{p.lead}</p>
			</div>
			<div class="purpose__body">
				<h3 class="purpose__mission-title">{p.missionTitle}</h3>
				<ul class="purpose__list">
					{#each p.points as pt, i (pt.title)}
						<li class="purpose__item" use:reveal>
							<span class="purpose__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
							<div>
								<h4 class="purpose__item-title">{pt.title}</h4>
								<p class="purpose__item-copy">{pt.copy}</p>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- "Our team" — portrait cards (plan §5.2). Rendered only when aboutPage.showTeam is true. -->
<script>
	import { aboutPage, asset } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	const t = aboutPage.team;
</script>

<section class="page-section page-section--alt padding-md" id="team">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="section-eyebrow">{t.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title">{t.title}</h2></div>
		</div>
		<ul class="team-grid">
			{#each t.members as m (m.name)}
				<li class="team-card" use:reveal>
					<img class="team-card__photo" src={asset(m.image)} alt={m.name} loading="lazy" decoding="async" width="500" height="500" />
					<h3 class="team-card__name">{m.name}</h3>
					<p class="team-card__role">{m.role}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

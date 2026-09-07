<!-- About: network reach as TEXT lists (plan §3.6 legal note — third-party
     media logos are not displayed), plus the full client roster by category. -->
<script>
	import { aboutPage, networkGroups, clientCategories } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	const n = aboutPage.network;
</script>

<section class="page-section page-section--alt padding-md" id="network">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="section-eyebrow">{n.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title">{n.title}</h2></div>
			<div class="content-blocks__block"><p class="section-sub">{n.lead}</p></div>
		</div>

		<div class="netcols">
			{#each networkGroups as g (g.title)}
				<div class="netcol" use:reveal>
					<h3 class="netcol__title">{g.title}</h3>
					<p class="netcol__copy">{g.copy}</p>
					<ul class="netcol__list">
						{#each g.names as name (name)}<li>{name}</li>{/each}
					</ul>
				</div>
			{/each}
		</div>
		<p class="netcols__note">{n.note}</p>

		<div class="netclients">
			<h3 class="netclients__title">Clients we have worked with</h3>
			<div class="netcols netcols--clients">
				{#each clientCategories as c (c.key)}
					<div class="netcol" use:reveal>
						<h4 class="netcol__title netcol__title--sm">{c.title}</h4>
						<ul class="netcol__list">
							{#each c.names as name (name)}<li>{name}</li>{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

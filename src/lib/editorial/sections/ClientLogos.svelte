<!-- "Our Happy Clients" — dark band, six white logos (plan §4.6). -->
<script>
	import { home, asset } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	const c = home.clients;
</script>

<section class="page-section page-section--dark padding-md" id="clients">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><h2 class="section-title">{c.title}</h2></div>
			<div class="content-blocks__block"><p class="section-sub">{c.sub}</p></div>
		</div>
		<ul class="client-grid" use:reveal>
			{#each c.logos as l (l.name)}
				<li class="client-logo"><img src={asset(l.file)} alt={l.name} loading="lazy" decoding="async" /></li>
			{/each}
		</ul>
	</div>
</section>

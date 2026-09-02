<!-- Light statement band: title + one large paragraph ("Insights", plan §4.7). -->
<script>
	import { reveal } from '$lib/actions.js';
	let { id, title, body, band = 'white' } = $props();
</script>

<section class="page-section padding-md" class:page-section--alt={band === 'alt'} {id}>
	<div class="container container--md">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="title-rule title-rule--center"></span></div>
			<div class="content-blocks__block"><h2 class="section-title">{title}</h2></div>
			<div class="content-blocks__block"><p class="statement">{body}</p></div>
		</div>
	</div>
</section>

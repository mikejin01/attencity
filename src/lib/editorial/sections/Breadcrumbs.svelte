<!-- Visible breadcrumb trail for inner pages; the matching BreadcrumbList
     JSON-LD is emitted by the page through <Seo jsonLd={…} />. -->
<script>
	import { route } from '$lib/content/attencity.js';
	/** @type {{ trail: {name: string, path: string}[] }} */
	let { trail } = $props();
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
	<div class="container container--lg">
		<ol>
			<li><a href={route('/')}>Home</a></li>
			{#each trail as item, i (item.path)}
				<li>
					{#if i === trail.length - 1}
						<span aria-current="page">{item.name}</span>
					{:else}
						<a href={route(item.path)}>{item.name}</a>
					{/if}
				</li>
			{/each}
		</ol>
	</div>
</nav>

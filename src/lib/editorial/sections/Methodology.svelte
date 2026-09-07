<!-- Attencity methodology: the 3A × 4R ring, rebuilt as inline SVG in the
     Editorial palette rather than embedding the deck slide (plan §3.4).
     The ring is decorative — every label in it is repeated as real text in
     the 3A list and the four R cards, so nothing is lost to screen readers. -->
<script>
	import { aboutPage } from '$lib/content/attencity.js';
	import { reveal } from '$lib/actions.js';
	const m = aboutPage.methodology;
	/** Node centres on the 141.4px ring, clockwise from top-left. */
	const nodes = [
		{ code: 'BR', x: 100, y: 100 },
		{ code: 'PR', x: 300, y: 100 },
		{ code: 'IR', x: 300, y: 300 },
		{ code: 'CR', x: 100, y: 300 }
	];
	/** Arcs between adjacent nodes, drawn clockwise with a gap at each end. */
	const arcs = [
		'M154 66.3 A141.4 141.4 0 0 1 246 66.3',
		'M333.7 154 A141.4 141.4 0 0 1 333.7 246',
		'M246 333.7 A141.4 141.4 0 0 1 154 333.7',
		'M66.3 246 A141.4 141.4 0 0 1 66.3 154'
	];
</script>

<section class="page-section padding-md" id="methodology">
	<div class="container container--lg">
		<div class="content-blocks text-center" use:reveal>
			<div class="content-blocks__block"><span class="section-eyebrow">{m.eyebrow}</span></div>
			<div class="content-blocks__block"><h2 class="section-title">{m.title}</h2></div>
		</div>

		<div class="method">
			<figure class="method__figure" use:reveal>
				<svg class="method__ring" viewBox="0 0 400 400" role="img" aria-label="The 4R loop: Brand Asset Building, Communications Management, Investor Relations Management and Channel Penetration, cycling clockwise around the 3A core.">
					<defs>
						<marker id="method-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
							<path d="M0 0 L10 5 L0 10 z" fill="var(--orange)" />
						</marker>
					</defs>
					{#each arcs as d (d)}
						<path {d} fill="none" stroke="var(--orange)" stroke-width="2.5" marker-end="url(#method-arrow)" />
					{/each}
					<circle cx="200" cy="200" r="96" fill="none" stroke="var(--orange)" stroke-width="1.5" opacity="0.5" />
					<text class="method__core" x="200" y="176" text-anchor="middle">3A</text>
					<text class="method__core-line" x="200" y="204" text-anchor="middle">Attention · Being seen</text>
					<text class="method__core-line" x="200" y="224" text-anchor="middle">Authority · Being trusted</text>
					<text class="method__core-line" x="200" y="244" text-anchor="middle">Asset · What lasts</text>
					{#each nodes as n (n.code)}
						<circle cx={n.x} cy={n.y} r="46" fill="var(--bg)" stroke="var(--orange)" stroke-width="2" />
						<text class="method__node" x={n.x} y={n.y + 9} text-anchor="middle">{n.code}</text>
					{/each}
				</svg>
				<figcaption class="method__loop">
					{#each m.loop as step, i (step)}
						<span class="method__loop-step">{step}</span>{#if i < m.loop.length - 1}<span class="method__loop-arrow" aria-hidden="true">→</span>{/if}
					{/each}
				</figcaption>
			</figure>

			<div class="method__body" use:reveal>
				<p class="split__lead">{m.lead}</p>
				<dl class="method__three-a">
					{#each m.threeA as a (a.key)}
						<div class="method__a">
							<dt>{a.key}</dt>
							<dd>{a.value}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<ul class="method__cards">
			{#each m.fourR as r (r.code)}
				<li class="method__card" use:reveal>
					<span class="method__code">{r.code}</span>
					<h3 class="method__card-title">{r.title}</h3>
					<p class="method__card-copy">{r.copy}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

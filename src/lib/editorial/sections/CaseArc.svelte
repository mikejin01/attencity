<!-- The arc a case study runs through: offline → online → press → GEO.

     Owner feedback §1–2: "Activation creates the raw material → creators and
     social carry and amplify it online → press picks it up → GEO turns it into
     an asset AI can cite. That arc is our product, and it's what separates us
     from an event company."

     One number per stage, where there is a real one. A stage the engagement
     did not include is marked `status: 'next'` in frontmatter and rendered as
     the step that follows — outlined rather than filled — so the arc reads
     whole without claiming work that was not done. -->
<script>
	import { ARC_STAGES, arcOf } from '$lib/content/posts.js';
	import { reveal } from '$lib/actions.js';

	/** @type {{ post: any, title?: string, band?: 'white'|'alt', id?: string }} */
	let { post, title = 'Offline → online → GEO', band = 'white', id = 'arc' } = $props();

	const stages = $derived(arcOf(post));
	const delivered = $derived(stages.filter((s) => s.status !== 'next').length);
</script>

{#if stages.length}
	<section class="page-section padding-md" class:page-section--alt={band === 'alt'} {id}>
		<div class="container container--lg">
			<div class="content-blocks text-center" use:reveal>
				<div class="content-blocks__block"><span class="section-eyebrow">The arc</span></div>
				<div class="content-blocks__block"><h2 class="section-title">{title}</h2></div>
				<div class="content-blocks__block">
					<p class="section-sub">
						An activation creates the raw material. Creators and social carry it online, press
						gives it third-party weight, and GEO turns it into something an AI assistant can
						cite. {#if delivered < stages.length}Stages we ran on this engagement are marked; the
							rest are where it goes next.{/if}
					</p>
				</div>
			</div>

			<ol class="arc" use:reveal>
				{#each stages as s (s.stage)}
					<li class="arc-step" class:arc-step--next={s.status === 'next'}>
						<div class="arc-step__head">
							<span class="arc-step__label">{ARC_STAGES[s.stage].label}</span>
							<span class="arc-step__stage">{ARC_STAGES[s.stage].title}</span>
						</div>
						<!-- Always rendered, so the headline of every step sits on the same
						     line. A stage we ran without a number worth printing says so
						     rather than showing a blank. -->
						<p class="arc-step__metric" class:arc-step__metric--badge={!s.metric}>
							{#if s.metric}
								<b>{s.metric.value}</b>
								<span>{s.metric.label}</span>
							{:else}
								<span>{s.status === 'next' ? 'Next stage' : 'Delivered'}</span>
							{/if}
						</p>
						<h3 class="arc-step__title">{s.title}</h3>
						<p class="arc-step__copy">{s.copy}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>
{/if}

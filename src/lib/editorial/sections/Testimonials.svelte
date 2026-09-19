<!-- Attributed client quotes: photo, name, title, company.

     Owner feedback §3 — "One attributed quote does more than a full logo
     wall" — so this sits directly under the logo wall on the home page.

     Renders nothing while there are no signed-off quotes (see
     content/testimonials.js), which is the state it ships in. A card with no
     headshot falls back to a monogram rather than a placeholder avatar. -->
<script>
	import { asset, srcset, dims } from '$lib/content/attencity.js';
	import { testimonialsSection, testimonials as all } from '$lib/content/testimonials.js';
	import { reveal } from '$lib/actions.js';
	import { editableImage } from '$lib/wp/actions.svelte.js';

	/** @type {{ items?: any[], band?: 'white'|'alt'|'dark', id?: string, heading?: boolean }} */
	let { items, band = 'alt', id = 'testimonials', heading = true } = $props();

	const s = testimonialsSection;
	const list = $derived(items ?? (s.enabled ? all : []));
	const initials = (name) =>
		name
			.split(/\s+/)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();
</script>

{#if list.length}
	<section
		class="page-section padding-md"
		class:page-section--alt={band === 'alt'}
		class:page-section--dark={band === 'dark'}
		{id}
	>
		<div class="container container--lg">
			{#if heading}
				<div class="content-blocks text-center" use:reveal>
					<div class="content-blocks__block"><span class="section-eyebrow">{s.eyebrow}</span></div>
					<div class="content-blocks__block"><h2 class="section-title">{s.title}</h2></div>
					{#if s.sub}
						<div class="content-blocks__block"><p class="section-sub">{s.sub}</p></div>
					{/if}
				</div>
			{/if}

			<ul class="quote-grid" class:quote-grid--single={list.length === 1} use:reveal>
				{#each list as t (t.name + t.company)}
					<li>
						<figure class="quote-card">
						<blockquote class="quote-card__quote">{t.quote}</blockquote>
						<figcaption class="quote-card__who">
							{#if t.image}
								<img
									class="quote-card__photo"
									src={asset(t.image)} use:editableImage={t.image}
									srcset={srcset(t.image) || undefined}
									sizes="72px"
									width={dims(t.image)?.width}
									height={dims(t.image)?.height}
									alt={t.imageAlt ?? t.name}
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<span class="quote-card__monogram" aria-hidden="true">{initials(t.name)}</span>
							{/if}
							<span class="quote-card__id">
								<span class="quote-card__name">{t.name}</span>
								<span class="quote-card__role">{t.role}{t.company ? `, ${t.company}` : ''}</span>
							</span>
						</figcaption>
						</figure>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

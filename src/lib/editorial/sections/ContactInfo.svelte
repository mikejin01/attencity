<!-- Contact page body: office address, phone, email, social accounts (with a
     QR dialog for the accounts that have no public profile URL), a lazily
     embedded map, and the light "Send us a message" form (plan §5.6). -->
<script>
	import { site, contactPage, asset, dims } from '$lib/content/attencity.js';
	import { socialIcons } from '$lib/editorial/icons.js';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import { reveal } from '$lib/actions.js';
	import { editable, editableImage } from '$lib/wp/actions.svelte.js';

	const c = site.contact;
	const info = contactPage.info;
	const socials = site.social.filter((s) => !s.hidden);
	const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapQuery)}`;
	const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`;

	/** The social entry whose QR is on screen, or null. */
	let qrOpen = $state(null);
	let qrOpener = null;

	function showQr(entry, ev) {
		qrOpener = ev.currentTarget;
		qrOpen = entry;
	}
	function closeQr() {
		qrOpen = null;
		qrOpener?.focus?.();
		qrOpener = null;
	}
</script>

<svelte:window onkeydown={(e) => qrOpen && e.key === 'Escape' && closeQr()} />

<section class="page-section page-section--alt padding-md" id="contact-info">
	<div class="container container--lg">
		<div class="contact-grid">
			<div class="visit-info" use:reveal>
				<span class="section-eyebrow">{info.title}</span>
				<ul class="contact-list">
					<li class="contact-item">
						<span class="contact-ic" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><path d="M12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6" /></svg>
						</span>
						<div class="contact-body">
							<span class="contact-label">{info.addressLabel}</span>
							<address class="contact-value contact-value--address">
								{c.street}<br />{c.locality}, {c.region} {c.postalCode}
							</address>
							<a class="contact-link" href={directionsUrl} target="_blank" rel="noopener noreferrer">{info.directions}</a>
						</div>
					</li>
					<li class="contact-item">
						<span class="contact-ic" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
						</span>
						<div class="contact-body">
							<span class="contact-label">Phone</span>
							<a class="contact-value" href="tel:{c.phone.replace(/[^+\d]/g, '')}">{c.phone}</a>
						</div>
					</li>
					<li class="contact-item">
						<span class="contact-ic" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
						</span>
						<div class="contact-body">
							<span class="contact-label">Email</span>
							<a class="contact-value" href="mailto:{c.email}">{c.email}</a>
						</div>
					</li>
				</ul>

				<div class="social-block" id="social">
					<span class="contact-label">{info.socialLabel}</span>
					<ul class="social-list">
						{#each socials as s (s.name)}
							<li class="social-item">
								<span class="social-ic" aria-hidden="true">
									<svg viewBox="0 0 24 24"><path fill="currentColor" d={socialIcons[s.icon]} /></svg>
								</span>
								<div class="social-body">
									<span class="social-name">{s.name}</span>
									{#if s.href}
										<a class="contact-value" href={s.href} target="_blank" rel="noopener noreferrer">{s.handle}</a>
									{:else}
										<span class="contact-value">{s.handle}</span>
										{#if s.note}<span class="social-note">{s.note}</span>{/if}
										{#if s.qr}
											<button class="contact-link" type="button" onclick={(e) => showQr(s, e)}>Show QR code</button>
										{/if}
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</div>

				<div class="map-embed">
					<iframe
						title={info.mapTitle}
						src={mapEmbed}
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						allowfullscreen
					></iframe>
				</div>
			</div>

			<div class="form-card" use:reveal>
				<h2 class="form-card__title" use:editable={'contactPage.form.title'}>{contactPage.form.title}</h2>
				<ContactForm variant="light" idPrefix="contact" formLocation="contact" submitLabel="Send message" />
			</div>
		</div>
	</div>
</section>

{#if qrOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={closeQr} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
		<div class="modal modal--qr" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="qr-title" onclick={(e) => e.stopPropagation()}>
			<button class="modal-x" type="button" onclick={closeQr} aria-label="Close">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
			</button>
			<div class="modal-inner text-center">
				<h3 id="qr-title">{qrOpen.name}</h3>
				<p class="modal-sub">{qrOpen.handle}{qrOpen.note ? ` · ${qrOpen.note}` : ''}</p>
				<img
					class="qr-image"
					src={asset(qrOpen.qr)} use:editableImage={qrOpen.qr}
					width={dims(qrOpen.qr)?.width}
					height={dims(qrOpen.qr)?.height}
					alt={qrOpen.qrAlt ?? `${qrOpen.name} QR code`}
				/>
			</div>
		</div>
	</div>
{/if}

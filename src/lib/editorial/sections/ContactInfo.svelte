<!-- Contact page body: info card (email / phone / offices — only what's
     confirmed) + the light "Send us a message" form (plan §5.3). -->
<script>
	import { contactConfig, contactPage } from '$lib/content/attencity.js';
	import ContactForm from '$lib/components/ContactForm.svelte';
	import { reveal } from '$lib/actions.js';
	const c = contactConfig;
	const hasDirect = Boolean(c.email || c.phone);
</script>

<section class="page-section page-section--alt padding-md" id="contact-info">
	<div class="container container--lg">
		<div class="contact-grid">
			<div class="visit-info" use:reveal>
				<span class="section-eyebrow">{contactPage.info.title}</span>
				<ul class="contact-list">
					{#if c.email}
						<li class="contact-item">
							<span class="contact-ic" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
							</span>
							<div class="contact-body">
								<span class="contact-label">Email</span>
								<a class="contact-value" href="mailto:{c.email}">{c.email}</a>
							</div>
						</li>
					{/if}
					{#if c.phone}
						<li class="contact-item">
							<span class="contact-ic" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
							</span>
							<div class="contact-body">
								<span class="contact-label">Phone</span>
								<a class="contact-value" href="tel:{c.phone.replace(/[^+\d]/g, '')}">{c.phone}</a>
							</div>
						</li>
					{/if}
					<li class="contact-item">
						<span class="contact-ic" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></svg>
						</span>
						<div class="contact-body">
							<span class="contact-label">Offices</span>
							<span class="contact-value">{c.offices.join(' · ')}</span>
						</div>
					</li>
				</ul>
				{#if !hasDirect}
					<p class="contact-pending">{contactPage.info.pendingNote}</p>
				{/if}
			</div>
			<div class="form-card" use:reveal>
				<h2 class="form-card__title">{contactPage.form.title}</h2>
				<ContactForm variant="light" idPrefix="contact" submitLabel="Send message" />
			</div>
		</div>
	</div>
</section>

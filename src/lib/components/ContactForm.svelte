<!-- The lead form used inline on the home CTA, the contact page, every service
     CTA band, and inside the "Get in touch" modal.

     Beyond name / email / company / message it asks the two questions the
     owner wants for channel analysis (plan §1.1): job title and how the
     visitor heard about us. Hidden channel fields (UTM, referrer, page,
     form location) ride along on every submission.

     Delivery is decided by src/lib/contact.svelte.js; the success copy says
     what really happened (sent / mail app opened / not connected yet). -->
<script>
	import { sendMessage, deliveryMode } from '$lib/contact.svelte.js';
	import { contactConfig } from '$lib/content/attencity.js';
	import { HEARD_FROM, JOB_TITLES, OTHER, attributionPayload, trackLead } from '$lib/lead.js';

	/** @type {{ variant?: 'dark'|'light', idPrefix?: string, formLocation?: string,
	 *  submitLabel?: string, ondone?: () => void }} */
	let {
		variant = 'dark',
		idPrefix = 'cf',
		formLocation = 'modal',
		submitLabel = 'Submit',
		ondone
	} = $props();

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let jobTitle = $state('');
	let jobTitleOther = $state('');
	let heardFrom = $state('');
	let heardFromOther = $state('');
	let message = $state('');
	let newsletter = $state(true); // §10 Q9 default: pre-checked, single opt-in
	let website = $state(''); // honeypot — real people never see this
	let errors = $state({});
	let busy = $state(false);
	let failed = $state(false);
	let result = $state(null);

	const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const id = (f) => `${idPrefix}-${f}`;
	const firstName = $derived(name.trim().split(' ')[0] || 'there');
	const jobTitleValue = $derived(jobTitle === OTHER ? jobTitleOther.trim() : jobTitle);
	const heardFromValue = $derived(heardFrom === OTHER ? heardFromOther.trim() : heardFrom);

	function validate() {
		const e = {};
		if (!name.trim()) e.name = 'Please tell us your name.';
		if (!EMAIL.test(email.trim())) e.email = 'A valid email is required.';
		if (!jobTitle) e.jobTitle = 'Please choose the closest match.';
		else if (jobTitle === OTHER && !jobTitleOther.trim()) e.jobTitle = 'Please tell us your role.';
		if (!heardFrom) e.heardFrom = 'This helps us know what’s working.';
		else if (heardFrom === OTHER && !heardFromOther.trim()) e.heardFrom = 'Please tell us where.';
		if (!message.trim()) e.message = 'Tell us a little about what you need.';
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function submit(ev) {
		ev.preventDefault();
		if (website) return; // honeypot tripped: drop it silently
		if (!validate()) return;
		busy = true;
		failed = false;
		const payload = {
			name: name.trim(),
			email: email.trim(),
			company: company.trim(),
			job_title: jobTitleValue,
			heard_from: heardFromValue,
			message: message.trim(),
			newsletter_optin: newsletter,
			source: 'website',
			...attributionPayload(formLocation)
		};
		if (contactConfig.turnstileSiteKey) {
			const token = ev.currentTarget.querySelector('[name="cf-turnstile-response"]')?.value;
			if (token) payload['cf-turnstile-response'] = token;
		}
		try {
			result = await sendMessage(payload);
			trackLead({ jobTitle: jobTitleValue, heardFrom: heardFromValue, formLocation });
		} catch {
			failed = true;
		} finally {
			busy = false;
		}
	}

	export function reset() {
		name = email = company = message = jobTitle = jobTitleOther = heardFrom = heardFromOther = '';
		newsletter = true;
		errors = {};
		result = null;
		failed = false;
	}
	function done() {
		reset();
		ondone?.();
	}
</script>

<div class="contact-form form-{variant}">
	{#if result}
		<div class="form-success" role="status">
			<div class="check-circle">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 13l4 4L19 7" /></svg>
			</div>
			{#if result === 'endpoint'}
				<h3>Message sent</h3>
				<p>Thanks, {firstName}. We’ve received your message and will get back to you shortly.</p>
			{:else if result === 'mailto'}
				<h3>Almost there</h3>
				<p>Your email app should now be open with the message ready to send. If it isn’t, please email us at {contactConfig.email}.</p>
			{:else}
				<h3>Thanks, {firstName}</h3>
				<p>This form isn’t connected to a mailbox yet, so your message was not sent. Please email us at {contactConfig.email} in the meantime.</p>
			{/if}
			<div class="form-actions">
				<button class="btn btn-primary" type="button" onclick={done}>Done</button>
			</div>
		</div>
	{:else}
		<form onsubmit={submit} novalidate>
			<div class="form-grid">
				<div class="field" class:invalid={errors.name}>
					<label for={id('name')}>Name *</label>
					<input id={id('name')} bind:value={name} autocomplete="name" required />
					<span class="err">{errors.name ?? ''}</span>
				</div>
				<div class="field" class:invalid={errors.email}>
					<label for={id('email')}>Work email *</label>
					<input id={id('email')} type="email" bind:value={email} autocomplete="email" required />
					<span class="err">{errors.email ?? ''}</span>
				</div>
				<div class="field full">
					<label for={id('company')}>Company</label>
					<input id={id('company')} bind:value={company} autocomplete="organization" />
					<span class="err"></span>
				</div>

				<div class="field full" class:invalid={errors.jobTitle}>
					<label for={id('job')}>Job title *</label>
					<select id={id('job')} bind:value={jobTitle} required>
						<option value="" disabled>Select…</option>
						{#each JOB_TITLES as t (t)}<option value={t}>{t}</option>{/each}
					</select>
					{#if jobTitle === OTHER}
						<input class="field__other" bind:value={jobTitleOther} placeholder="Your role" aria-label="Your role" />
					{/if}
					<span class="err">{errors.jobTitle ?? ''}</span>
				</div>
				<div class="field full" class:invalid={errors.heardFrom}>
					<label for={id('heard')}>How did you hear about us? *</label>
					<select id={id('heard')} bind:value={heardFrom} required>
						<option value="" disabled>Select…</option>
						{#each HEARD_FROM as h (h)}<option value={h}>{h}</option>{/each}
					</select>
					{#if heardFrom === OTHER}
						<input class="field__other" bind:value={heardFromOther} placeholder="Where did you hear about us?" aria-label="Where did you hear about us?" />
					{/if}
					<span class="err">{errors.heardFrom ?? ''}</span>
				</div>

				<div class="field full" class:invalid={errors.message}>
					<label for={id('message')}>How can we help? *</label>
					<textarea id={id('message')} bind:value={message} rows="4" required></textarea>
					<span class="err">{errors.message ?? ''}</span>
				</div>
			</div>

			<label class="field-check">
				<input type="checkbox" bind:checked={newsletter} />
				<span>Keep me posted on Attencity insights and event invitations.</span>
			</label>

			<!-- honeypot: hidden from people, irresistible to bots -->
			<div class="hp" aria-hidden="true">
				<label for={id('website')}>Website</label>
				<input id={id('website')} bind:value={website} tabindex="-1" autocomplete="off" />
			</div>

			{#if contactConfig.turnstileSiteKey}
				<div class="cf-turnstile" data-sitekey={contactConfig.turnstileSiteKey} data-size="flexible"></div>
			{/if}

			<div class="form-actions">
				<button type="submit" class="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : submitLabel}</button>
			</div>
			{#if failed}
				<p class="form-note form-note--error" role="alert">Something went wrong sending your message. Please try again, or email us at {contactConfig.email}.</p>
			{:else if deliveryMode === 'none'}
				<p class="form-note">Form delivery isn’t connected yet — messages are not sent anywhere.</p>
			{/if}
		</form>
	{/if}
</div>

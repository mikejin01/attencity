<!-- The contact form (Name, Email, Company, Message) used inline on the home
     CTA + contact page and inside the "Get in touch" modal. Delivery is
     decided by src/lib/contact.svelte.js; the success copy says what really
     happened (sent / mail app opened / not connected yet). -->
<script>
	import { sendMessage, deliveryMode } from '$lib/contact.svelte.js';

	/** @type {{ variant?: 'dark'|'light', idPrefix?: string, submitLabel?: string, ondone?: () => void }} */
	let { variant = 'dark', idPrefix = 'cf', submitLabel = 'Submit', ondone } = $props();

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let message = $state('');
	let errors = $state({});
	let busy = $state(false);
	let failed = $state(false);
	let result = $state(null);

	const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const id = (f) => `${idPrefix}-${f}`;
	const firstName = $derived(name.trim().split(' ')[0] || 'there');

	function validate() {
		const e = {};
		if (!name.trim()) e.name = 'Please tell us your name.';
		if (!EMAIL.test(email.trim())) e.email = 'A valid email is required.';
		if (!message.trim()) e.message = 'Tell us a little about what you need.';
		errors = e;
		return Object.keys(e).length === 0;
	}
	async function submit(ev) {
		ev.preventDefault();
		if (!validate()) return;
		busy = true;
		failed = false;
		try {
			result = await sendMessage({
				name: name.trim(),
				email: email.trim(),
				company: company.trim(),
				message: message.trim()
			});
		} catch {
			failed = true;
		} finally {
			busy = false;
		}
	}
	export function reset() {
		name = email = company = message = '';
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
				<p>Your email app should now be open with the message ready to send. If it isn’t, please email us directly.</p>
			{:else}
				<h3>Thanks, {firstName}</h3>
				<p>This form isn’t connected to a mailbox yet, so your message was not sent. Please check back soon.</p>
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
					<label for={id('email')}>Email *</label>
					<input id={id('email')} type="email" bind:value={email} autocomplete="email" required />
					<span class="err">{errors.email ?? ''}</span>
				</div>
				<div class="field full">
					<label for={id('company')}>Company</label>
					<input id={id('company')} bind:value={company} autocomplete="organization" />
					<span class="err"></span>
				</div>
				<div class="field full" class:invalid={errors.message}>
					<label for={id('message')}>How can we help?</label>
					<textarea id={id('message')} bind:value={message} rows="4" required></textarea>
					<span class="err">{errors.message ?? ''}</span>
				</div>
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : submitLabel}</button>
			</div>
			{#if failed}
				<p class="form-note form-note--error" role="alert">Something went wrong sending your message. Please try again in a moment.</p>
			{:else if deliveryMode === 'none'}
				<p class="form-note">Form delivery isn’t connected yet — messages are not sent anywhere.</p>
			{/if}
		</form>
	{/if}
</div>

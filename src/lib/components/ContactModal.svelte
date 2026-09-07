<!-- Global "Get in touch" modal (template booking-modal design, plan §4.8).
     Opened by the navbar CTA, the hero, and the mobile menu. -->
<script>
	import { contactModal as modal, closeContact } from '$lib/contact.svelte.js';
	import { contactModal as copy } from '$lib/content/attencity.js';
	import ContactForm from './ContactForm.svelte';

	let dialogEl = $state(null);
	let opener = null;

	$effect(() => {
		if (modal.open) {
			opener = document.activeElement;
			queueMicrotask(() => dialogEl?.querySelector('input')?.focus());
		} else if (opener && typeof opener.focus === 'function') {
			opener.focus();
			opener = null;
		}
	});
</script>

<svelte:window onkeydown={(e) => modal.open && e.key === 'Escape' && closeContact()} />

{#if modal.open}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="modal-backdrop" onclick={closeContact} role="presentation">
		<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
		<div
			class="modal"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="contact-modal-title"
			bind:this={dialogEl}
			onclick={(e) => e.stopPropagation()}
		>
			<button class="modal-x" type="button" onclick={closeContact} aria-label="Close">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18" /></svg>
			</button>
			<div class="modal-inner">
				<span class="eyebrow">{copy.eyebrow}</span>
				<h3 id="contact-modal-title">{copy.title}</h3>
				<p class="modal-sub">{copy.sub}</p>
				<ContactForm idPrefix="modal" formLocation="modal" submitLabel="Send message" ondone={closeContact} />
			</div>
		</div>
	</div>
{/if}

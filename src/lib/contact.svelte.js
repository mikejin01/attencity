// Shared state for the "Get in touch" modal + the one place that decides how a
// contact message is delivered (plan §8 Q1). Used by ContactForm on the home
// CTA, the contact page, and the modal.
import { contactConfig } from '$lib/content/attencity.js';

export const contactModal = $state({ open: false });

export function openContact() {
	contactModal.open = true;
}

export function closeContact() {
	contactModal.open = false;
}

/** 'endpoint' | 'mailto' | 'none' — derived from contactConfig. */
export const deliveryMode = contactConfig.formEndpoint
	? 'endpoint'
	: contactConfig.email
		? 'mailto'
		: 'none';

/**
 * Deliver a message. Resolves to the mode used so the form can word its
 * success state honestly. Throws when an endpoint rejects the request.
 * @param {{name:string,email:string,company:string,message:string}} data
 */
export async function sendMessage(data) {
	if (deliveryMode === 'endpoint') {
		const res = await fetch(contactConfig.formEndpoint, {
			method: 'POST',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`);
		return 'endpoint';
	}
	if (deliveryMode === 'mailto') {
		const subject = encodeURIComponent(`Website enquiry from ${data.name}`);
		const body = encodeURIComponent(
			`Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '—'}\n\n${data.message}`
		);
		window.location.href = `mailto:${contactConfig.email}?subject=${subject}&body=${body}`;
		return 'mailto';
	}
	return 'none';
}

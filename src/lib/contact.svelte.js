// Shared state for the "Get in touch" modal + the one place that decides how a
// contact message is delivered. Used by ContactForm on the home CTA, the
// contact page, every service CTA, and the modal.
//
// Delivery order (plan §6.3):
//   endpoint → WordPress's own /attencity/v1/lead when the theme provides it,
//              otherwise the Cloudflare Worker relay (email + Flodesk upsert)
//   mailto   → pre-filled mail client, so a message is never silently lost
//   none     → the form says plainly that it is not connected yet
import { contactConfig } from '$lib/content/attencity.js';
import { leadEndpoint } from '$lib/wp/runtime.js';

/**
 * WordPress wins when the theme supplies an endpoint: the lead then lands in
 * the dashboard AND is emailed on, with no third-party relay in the path.
 * Empty outside the WP build, so the static site keeps its existing behaviour.
 */
const endpoint = leadEndpoint() || contactConfig.formEndpoint;

export const contactModal = $state({ open: false });

export function openContact() {
	contactModal.open = true;
}

export function closeContact() {
	contactModal.open = false;
}

/** 'endpoint' | 'mailto' | 'none' — derived from contactConfig. */
export const deliveryMode = endpoint
	? 'endpoint'
	: contactConfig.email
		? 'mailto'
		: 'none';

const mailtoBody = (d) =>
	[
		`Name: ${d.name}`,
		`Email: ${d.email}`,
		`Company: ${d.company || '—'}`,
		`Job title: ${d.job_title || '—'}`,
		`How they heard about us: ${d.heard_from || '—'}`,
		`Newsletter opt-in: ${d.newsletter_optin ? 'yes' : 'no'}`,
		`Page: ${d.page || '—'}`,
		'',
		d.message
	].join('\n');

/**
 * Deliver a lead. Resolves to the mode used so the form can word its success
 * state honestly. Throws when an endpoint rejects the request.
 * @param {Record<string, any>} data — visitor fields plus the hidden channel fields
 */
export async function sendMessage(data) {
	if (deliveryMode === 'endpoint') {
		const res = await fetch(endpoint, {
			method: 'POST',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`);
		return 'endpoint';
	}
	if (deliveryMode === 'mailto') {
		const subject = encodeURIComponent(`Website enquiry from ${data.name}`);
		window.location.href = `mailto:${contactConfig.email}?subject=${subject}&body=${encodeURIComponent(mailtoBody(data))}`;
		return 'mailto';
	}
	return 'none';
}

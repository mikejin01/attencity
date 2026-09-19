// =====================================================================
// Lead-capture plumbing (plan §6.1): the questions the owner asked for,
// and the hidden channel fields that make them analysable.
//
// UTM parameters are read on the FIRST page view of a session and kept in
// sessionStorage, so a visitor who lands on an ad, browses for ten minutes
// and then submits from /contact/ is still attributed to the ad.
// =====================================================================
import { services } from './content/services.js';

/** "How did you hear about us?" — plan §6.1. */
export const HEARD_FROM = [
	'Google / search',
	'Instagram',
	'TikTok',
	'Xiaohongshu (RedNote)',
	'WeChat',
	'LinkedIn',
	'An event (CES, pop-up, party)',
	'Referral / word of mouth',
	'Press or media coverage',
	'AI assistant (ChatGPT etc.)',
	'Other'
];

/** Job title bands — kept short so the analysis stays legible. */
export const JOB_TITLES = [
	'Founder / C-level',
	'Marketing or Brand lead',
	'PR / Communications',
	'E-commerce / Sales',
	'Agency / Partner',
	'Investor',
	'Media / Press',
	'Creator / Public figure',
	'Student',
	'Other'
];

/**
 * "What are you interested in?" — the seven services, read straight off
 * services.js so the form can never list one the site does not sell, plus an
 * escape hatch for people who are still working it out. Multi-select: an
 * enquiry is very often two or three of these at once.
 */
export const SERVICE_INTERESTS = [
	...services.map((s) => s.navTitle ?? s.title),
	'Not sure yet — advise us'
];

export const OTHER = 'Other';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORE_KEY = 'attencity:attribution';

const readStore = () => {
	try {
		return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? 'null');
	} catch {
		return null;
	}
};

/**
 * Capture UTM parameters, referrer and landing page once per session.
 * Called from the root layout on mount; safe to call repeatedly.
 */
export function captureAttribution() {
	if (typeof window === 'undefined') return null;
	const existing = readStore();
	if (existing) return existing;

	const params = new URLSearchParams(window.location.search);
	const data = { landing_page: window.location.pathname, referrer: document.referrer || '' };
	for (const key of UTM_KEYS) {
		const v = params.get(key);
		if (v) data[key] = v.slice(0, 200);
	}
	try {
		sessionStorage.setItem(STORE_KEY, JSON.stringify(data));
	} catch {
		// private mode / storage disabled — attribution is best-effort
	}
	return data;
}

/** Everything the relay needs beyond what the visitor typed. */
export function attributionPayload(formLocation) {
	if (typeof window === 'undefined') return { form_location: formLocation };
	return {
		...(readStore() ?? captureAttribution() ?? {}),
		page: window.location.pathname,
		form_location: formLocation,
		submitted_at: new Date().toISOString(),
		lang: document.documentElement.lang || 'en'
	};
}

/** GA4 `generate_lead`, if a tag is present. No-op otherwise. */
export function trackLead({ jobTitle, heardFrom, servicesInterested, formLocation }) {
	if (typeof window === 'undefined') return;
	const detail = {
		job_title: jobTitle,
		heard_from: heardFrom,
		services_interested: servicesInterested,
		form_location: formLocation
	};
	window.dataLayer = window.dataLayer ?? [];
	window.dataLayer.push({ event: 'generate_lead', ...detail });
	if (typeof window.gtag === 'function') {
		window.gtag('event', 'generate_lead', detail);
	}
}

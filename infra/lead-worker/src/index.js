/**
 * Attencity lead relay.
 *
 *   browser  POST /lead  (JSON)
 *     ├─ validate + honeypot + optional Turnstile
 *     ├─ Resend  → notification email to the team inbox
 *     ├─ Flodesk → POST /v1/subscribers (upsert by email) with the job-title
 *     │            and channel custom fields, into the segments configured
 *     │            in wrangler.toml
 *     └─ optional Google Sheets webhook (one row per lead)
 *
 * The team email is sent FIRST and its failure is the only one that makes the
 * request fail: a lead must never be lost because Flodesk had a bad minute.
 * See docs/content-update-plan.md §6.3–§6.4 and the README next door.
 */

const FLODESK_API = 'https://api.flodesk.com/v1';

/** Fields the form sends. Anything else in the body is ignored. */
const TEXT_FIELDS = [
	'name',
	'email',
	'company',
	'job_title',
	'heard_from',
	'message',
	'source',
	'page',
	'form_location',
	'referrer',
	'landing_page',
	'lang',
	'utm_source',
	'utm_medium',
	'utm_campaign',
	'utm_content',
	'utm_term'
];

const LIMITS = { message: 5000, default: 500 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status, body, origin) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
	});

function allowedOrigins(env) {
	return (env.ALLOWED_ORIGINS ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

function corsHeaders(origin) {
	if (!origin) return {};
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin'
	};
}

function clean(body) {
	const out = {};
	for (const key of TEXT_FIELDS) {
		const v = body[key];
		if (typeof v !== 'string') continue;
		const trimmed = v.trim();
		if (trimmed) out[key] = trimmed.slice(0, LIMITS[key] ?? LIMITS.default);
	}
	out.newsletter_optin = body.newsletter_optin === true || body.newsletter_optin === 'true';
	return out;
}

/** Flodesk wants first/last; the form has one Name field. */
function splitName(name) {
	const parts = name.split(/\s+/);
	return { first_name: parts[0], last_name: parts.slice(1).join(' ') || '' };
}

async function verifyTurnstile(token, secret, ip) {
	if (!secret) return true; // Turnstile not enabled yet
	if (!token) return false;
	const form = new FormData();
	form.append('secret', secret);
	form.append('response', token);
	if (ip) form.append('remoteip', ip);
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: form
	});
	const data = await res.json().catch(() => ({}));
	return data.success === true;
}

function emailBody(d) {
	const rows = [
		['Name', d.name],
		['Email', d.email],
		['Company', d.company],
		['Job title', d.job_title],
		['Heard about us via', d.heard_from],
		['Newsletter opt-in', d.newsletter_optin ? 'yes' : 'no'],
		['Submitted from', d.form_location],
		['Page', d.page],
		['Landing page', d.landing_page],
		['Referrer', d.referrer],
		['utm_source', d.utm_source],
		['utm_medium', d.utm_medium],
		['utm_campaign', d.utm_campaign],
		['utm_content', d.utm_content],
		['utm_term', d.utm_term]
	].filter(([, v]) => v);
	const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
	return `New website enquiry\n\n${text}\n\n---\n${d.message}\n`;
}

async function sendEmail(d, env) {
	if (!env.RESEND_API_KEY || !env.NOTIFY_TO) {
		throw new Error('email relay is not configured (RESEND_API_KEY / NOTIFY_TO)');
	}
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from: env.NOTIFY_FROM ?? 'Attencity website <website@attencity.com>',
			to: env.NOTIFY_TO.split(',').map((s) => s.trim()),
			reply_to: d.email,
			subject: `Website enquiry — ${d.name}${d.company ? ` (${d.company})` : ''}`,
			text: emailBody(d)
		})
	});
	if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

/**
 * Upsert into Flodesk. Same call creates or updates; `double_optin` only
 * applies on first creation. Retries once on 429/5xx.
 */
async function upsertFlodesk(d, env, ip) {
	if (!env.FLODESK_API_KEY) return 'skipped';

	const segments = [env.FLODESK_SEGMENT_LEADS, d.newsletter_optin ? env.FLODESK_SEGMENT_NEWSLETTER : null]
		.filter(Boolean);

	const payload = {
		email: d.email,
		...splitName(d.name),
		custom_fields: {
			job_title: d.job_title ?? '',
			heard_from: d.heard_from ?? '',
			company: d.company ?? '',
			source: d.source ?? 'website',
			form_location: d.form_location ?? '',
			utm_source: d.utm_source ?? '',
			utm_medium: d.utm_medium ?? '',
			utm_campaign: d.utm_campaign ?? '',
			landing_page: d.landing_page ?? '',
			last_message_at: new Date().toISOString(),
			newsletter_optin: d.newsletter_optin ? 'yes' : 'no'
		},
		...(segments.length ? { segment_ids: segments } : {}),
		double_optin: env.FLODESK_DOUBLE_OPTIN === 'true' && d.newsletter_optin,
		optin_timestamp: new Date().toISOString(),
		...(ip ? { optin_ip: ip } : {})
	};

	const auth = `Basic ${btoa(`${env.FLODESK_API_KEY}:`)}`;
	for (let attempt = 0; attempt < 2; attempt++) {
		const res = await fetch(`${FLODESK_API}/subscribers`, {
			method: 'POST',
			headers: { Authorization: auth, 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (res.ok) return 'ok';
		if (res.status !== 429 && res.status < 500) {
			throw new Error(`Flodesk responded ${res.status}: ${await res.text()}`);
		}
		await new Promise((r) => setTimeout(r, 900));
	}
	throw new Error('Flodesk unavailable after retry');
}

async function appendSheetRow(d, env) {
	if (!env.SHEET_WEBHOOK_URL) return 'skipped';
	const res = await fetch(env.SHEET_WEBHOOK_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...d, received_at: new Date().toISOString() })
	});
	if (!res.ok) throw new Error(`Sheet webhook responded ${res.status}`);
	return 'ok';
}

export default {
	async fetch(request, env, ctx) {
		const origin = request.headers.get('Origin') ?? '';
		const allowed = allowedOrigins(env);
		const originOk = allowed.length === 0 || allowed.includes(origin);
		const corsOrigin = originOk ? origin : '';

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders(corsOrigin) });
		}
		const url = new URL(request.url);
		if (url.pathname === '/health') return json(200, { ok: true }, corsOrigin);
		if (request.method !== 'POST' || url.pathname !== '/lead') {
			return json(404, { error: 'Not found' }, corsOrigin);
		}
		if (!originOk) return json(403, { error: 'Origin not allowed' }, corsOrigin);

		let body;
		try {
			body = await request.json();
		} catch {
			return json(400, { error: 'Expected JSON' }, corsOrigin);
		}

		// Honeypot: a filled "website" field means a bot. Answer 200 so the bot
		// has nothing to learn, and do no work.
		if (typeof body.website === 'string' && body.website.trim()) {
			return json(200, { ok: true }, corsOrigin);
		}

		const d = clean(body);
		if (!d.name || !EMAIL_RE.test(d.email ?? '') || !d.message) {
			return json(400, { error: 'Name, a valid email and a message are required.' }, corsOrigin);
		}

		const ip = request.headers.get('CF-Connecting-IP') ?? '';
		if (!(await verifyTurnstile(body['cf-turnstile-response'], env.TURNSTILE_SECRET, ip))) {
			return json(400, { error: 'Verification failed. Please try again.' }, corsOrigin);
		}

		// The team email decides the response; the rest happens after it.
		try {
			await sendEmail(d, env);
		} catch (err) {
			console.error('notification email failed', err);
			return json(502, { error: 'Could not deliver your message. Please email us directly.' }, corsOrigin);
		}

		ctx.waitUntil(
			(async () => {
				try {
					await upsertFlodesk(d, env, ip);
				} catch (err) {
					console.error('flodesk upsert failed', err);
				}
				try {
					await appendSheetRow(d, env);
				} catch (err) {
					console.error('sheet webhook failed', err);
				}
			})()
		);

		return json(200, { ok: true }, corsOrigin);
	}
};

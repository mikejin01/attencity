# Attencity lead relay (Cloudflare Worker)

Receives the website contact form, emails the team, and upserts the lead into
**Flodesk** with the job-title and channel fields the owner asked for
(`docs/content-update-plan.md` §1.1–§1.2, §6.3–§6.4).

```
browser  POST /lead  →  Worker
                        ├─ validate + honeypot + optional Turnstile
                        ├─ Resend  → notification email to the team inbox   ← decides the response
                        ├─ Flodesk → POST /v1/subscribers (upsert by email)
                        └─ Google Sheet webhook (optional, one row per lead)
```

The email is sent first and is the only step that can fail the request: a lead
must never be lost because Flodesk had a bad minute. Flodesk and the Sheet run
in `waitUntil`, so a failure there is logged but does not affect the visitor.

---

## What the owner needs to provide

| Item | Where it comes from |
|---|---|
| Flodesk API key | Flodesk → Settings → Integrations → API |
| Team inbox | e.g. `communications@attencity.com` |
| Resend account + verified sending domain | resend.com (free tier covers this volume) |
| Cloudflare account | free tier |

## 1. Create the Flodesk custom fields

Flodesk → **Audience → Custom fields**. Create each of these and note the
**key** (not the label) — the Worker writes to the keys below:

`job_title`, `heard_from`, `company`, `source`, `form_location`,
`utm_source`, `utm_medium`, `utm_campaign`, `landing_page`,
`last_message_at`, `newsletter_optin`

## 2. Create the segments

Flodesk → **Audience → Segments**:

- **Website leads** — every submission lands here. This is the "customer asset
  pool"; filter it by any custom field for channel analysis.
- **Newsletter** — only submissions where the opt-in box was ticked. Point
  Flodesk newsletters and workflows at *this* segment, not at Website leads.

Fetch the segment ids once:

```sh
curl -u "$FLODESK_API_KEY:" https://api.flodesk.com/v1/segments
```

Paste the two ids into `wrangler.toml` as `FLODESK_SEGMENT_LEADS` and
`FLODESK_SEGMENT_NEWSLETTER`.

## 3. Deploy

```sh
cd infra/lead-worker
pnpm install
npx wrangler login

npx wrangler secret put FLODESK_API_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_TO          # communications@attencity.com
# optional:
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put SHEET_WEBHOOK_URL

npx wrangler deploy
```

Wrangler prints the deployed URL, e.g.
`https://attencity-lead.<account>.workers.dev`.

## 4. Point the site at it

In `src/lib/content/attencity.js`:

```js
export const contactConfig = {
	formEndpoint: 'https://attencity-lead.<account>.workers.dev/lead',
	turnstileSiteKey: '',   // only once Turnstile is set up
	…
};
```

Until `formEndpoint` is set, the site falls back to a pre-filled `mailto:` so
no message is ever silently dropped.

## 5. Test it

```sh
curl -X POST https://attencity-lead.<account>.workers.dev/lead \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://attencity.com' \
  -d '{
    "name": "Test Person",
    "email": "you+test@example.com",
    "company": "Test Co",
    "job_title": "Marketing or Brand lead",
    "heard_from": "Instagram",
    "message": "Ignore — relay smoke test.",
    "newsletter_optin": true,
    "form_location": "curl",
    "page": "/contact/",
    "utm_source": "test"
  }'
```

Then confirm:

1. the notification email arrived in the team inbox, with job title and
   `heard_from` in the body;
2. the subscriber appears in Flodesk's **Website leads** segment with every
   custom field populated;
3. because `newsletter_optin` was true, it is also in **Newsletter**.

`npx wrangler tail` streams the logs if something is missing.

## Configuration reference

| Var (wrangler.toml) | Purpose |
|---|---|
| `ALLOWED_ORIGINS` | Comma-separated origins allowed to POST. Keep it tight — this is what stops another site filling the inbox. Empty means "allow any", which you do not want in production. |
| `NOTIFY_FROM` | From address on the notification email; the domain must be verified in Resend. |
| `FLODESK_SEGMENT_LEADS` / `FLODESK_SEGMENT_NEWSLETTER` | Segment ids from step 2. |
| `FLODESK_DOUBLE_OPTIN` | `"false"` (default, US audience). `"true"` makes Flodesk send a confirmation email for newsletter opt-ins only. |

| Secret | Purpose |
|---|---|
| `FLODESK_API_KEY` | HTTP Basic username, empty password. Without it the Flodesk step is skipped and the email still sends. |
| `RESEND_API_KEY` | Notification email. Required. |
| `NOTIFY_TO` | Team inbox; comma-separated for several recipients. Required. |
| `TURNSTILE_SECRET` | Optional. While unset, Turnstile verification is skipped and the honeypot is the only bot filter. |
| `SHEET_WEBHOOK_URL` | Optional Google Apps Script webhook, one row per lead. |

## Notes

- Flodesk rate-limits `POST /subscribers` to 100 requests/minute — far above
  contact-form volume. The Worker retries once on 429/5xx.
- Consent evidence (`optin_ip`, `optin_timestamp`) is sent with every upsert.
- The enquiry message goes in the email and the Sheet only — Flodesk custom
  fields are not meant for long text.
- Zapier/Make (Formspree → Zapier → Flodesk) is the fallback if the owner would
  rather not hold a Cloudflare account; it costs monthly and carries fewer
  fields.

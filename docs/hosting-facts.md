# Where attencity.com actually lives

Verified 2026-09-10 from public DNS, WHOIS, the live site's HTTP headers, and
the WordPress.com public API. Written down because the obvious assumption is
wrong and cost time once already.

## The short version

| Thing | Where it lives |
|---|---|
| Domain registration | WordPress.com (registrar Automattic Inc.) |
| DNS zone | WordPress.com (`ns1`/`ns2`/`ns3.wordpress.com`) |
| **The live website** | **SiteGround**, on Google Cloud, `35.209.60.242` |
| Email | Google Workspace (`aspmx.l.google.com`) |

The WordPress.com dashboard at `wordpress.com/home/attencity.com` is **not** the
host. It manages the domain and a separate, dormant site.

## Why we know it is SiteGround

The live site's REST API advertises SiteGround's own plugin namespaces:

```
siteground-settings/v1   siteground-optimizer/v1   sg-security/v1
siteground-central/v1    siteground-dashboard/v1   sg-ai-studio
```

`sg-cachepress` is loaded from `wp-content/plugins/`. The IP reverse-resolves to
`googleusercontent.com` because SiteGround runs its hosting on Google Cloud.
Response headers show `x-httpd-modphp` and `host-header`, not Automattic's.

## The WordPress.com side

Site ID `227161810`, `attencitymarketing.wordpress.com`. The API reports
`is_wpcom_atomic: false`, `jetpack: false`, `is_coming_soon: true`, and
`site_migration: { is_complete: false, in_progress: false }`. So a migration to
WordPress.com was started and abandoned. It is a **Simple** site, which can never
have SSH, SFTP, plugins, or custom themes. Only the Business plan converts a site
to Atomic and unlocks those. None of that matters here, because the live site is
not on WordPress.com at all.

Two vendors are therefore probably being billed. Worth auditing before cancelling
anything.

## What is running on the live site

WordPress with the **Pathway** theme, **Kubio** page builder, **Elementor** and
Elementor Pro, **All in One SEO** 5.0.0.1, **MonsterInsights**, **WPForms Lite**,
**OptinMonster**, and **HubSpot**.

Converting to the generated custom theme replaces all of it. Treat that as a
destructive cutover: back up the database and the `wp-content` folder first, and
export any form submissions already captured.

## SSH

Available and reachable. Port `18765` accepts TCP and returns `SSH-2.0-OpenSSH`.
Port 22 is closed, which is normal for SiteGround.

Credentials are not yet in hand. The existing `~/.ssh/siteground` key and the
`SG_*` entries in `~/.ssh/config` all point at `c1114776.sgvps.net`
(`35.212.98.26`), a different server. Attencity sits under a different SiteGround
account, so the public key has to be imported there before it will authenticate.

Note that `ssh.attencity.com` does not resolve, because the DNS zone is at
WordPress.com and no `ssh` record was ever created. Connect using the hostname
SiteGround shows, or the server IP, or add an `ssh` A record in the WordPress.com
DNS editor.

## Facts still needed

From SiteGround Site Tools, under **Devs -> SSH Keys Manager**:

1. SSH username, of the form `u78-xxxxxxxxxx`
2. SSH hostname
3. Confirmation that the docroot is `www/attencity.com/public_html`

Put them in `.live-sites/attencity.mk`, then run `make preflight` and
`make test-connection`. See [SPA-TO-WORDPRESS-THEME-PLAYBOOK.md](./SPA-TO-WORDPRESS-THEME-PLAYBOOK.md) §0.

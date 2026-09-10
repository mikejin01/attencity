# attencity.com DNS, captured 2026-09-10 15:34 EDT

Taken before repointing the domain from the old SiteGround server to
WordPress.com. If a "restore defaults" action wipes something, this is
what was there.

## CHANGE THIS — the only record the cutover needs

It points at the old SiteGround server.

```
A     @     35.209.60.242 
```

The www CNAME points at the apex, so it follows the A record automatically
and does NOT need editing:

```
CNAME www   attencity.com. 
```

## LEAVE EVERYTHING BELOW ALONE

Mail for the domain runs on Google Workspace, and Flodesk signs campaign
mail using the two CNAMEs. Removing any of it breaks mail delivery or
silently sends Flodesk campaigns to spam.

```
MX (Google Workspace):
  1 aspmx.l.google.com.
  5 alt1.aspmx.l.google.com.
  5 alt2.aspmx.l.google.com.
  10 alt3.aspmx.l.google.com.
  10 alt4.aspmx.l.google.com.

CNAME fde._domainkey  dkim.uhyp4p.fi22.fdske.com.    <- Flodesk DKIM
CNAME fdesp           spf.uhyp4p.fi22.fdske.com.    <- Flodesk SPF

TXT:
  "google-site-verification=yNz6a2kjmNzuGtSMeQ4NnbcYUHy4YgPaGkRTutKojhs"
  "v=spf1 include:spf.titan.email include:_spf.google.com ~all"
```

## Nameservers

```
  ns1.wordpress.com.
  ns2.wordpress.com.
  ns3.wordpress.com.
```

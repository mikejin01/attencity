# attencity.com DNS, captured 2026-09-10 15:04 EDT

Taken before repointing the domain from SiteGround to WordPress.com.
If a "restore default records" button wipes something, this is what was there.

## The records that MUST survive the cutover

Mail for attencity.com runs on Google Workspace. Losing these stops mail.

```
MX:
  1 aspmx.l.google.com.
  5 alt1.aspmx.l.google.com.
  5 alt2.aspmx.l.google.com.
  10 alt3.aspmx.l.google.com.
  10 alt4.aspmx.l.google.com.

TXT:
  "google-site-verification=yNz6a2kjmNzuGtSMeQ4NnbcYUHy4YgPaGkRTutKojhs"
  "v=spf1 include:spf.titan.email include:_spf.google.com ~all"
```

## The records that SHOULD change

These currently point at the old SiteGround server and are what the
cutover replaces.

```
A     @      35.209.60.242 
www          attencity.com. 35.209.60.242 
```

## Other

```
NS:
  ns1.wordpress.com.
  ns2.wordpress.com.
  ns3.wordpress.com.
CAA:
  (empty = any certificate authority may issue)
```

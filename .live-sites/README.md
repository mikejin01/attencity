# Live site credentials

Real connection details for each WordPress install live here as gitignored
Makefile fragments. Only `_template.mk` and this README are committed.

```
cp .live-sites/_template.mk .live-sites/attencity.mk
$EDITOR .live-sites/attencity.mk
make preflight
make test-connection
```

The private key itself never lives in the repo. It stays at
`~/.ssh/siteground` (or a per-account variant) with mode `600`.

## Where the values come from

SiteGround Site Tools for the Attencity account, under **Devs -> SSH Keys
Manager**. Import the public half of an existing key with
`pbcopy < ~/.ssh/siteground.pub`, or generate a fresh pair there.

Attencity is on a different SiteGround server from the iDeal sites, so the
existing `~/.ssh/config` entries do not apply and the key must be imported
into this account before it will authenticate.

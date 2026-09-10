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

WordPress.com, under **Settings -> SFTP/SSH**, which generates the username.
The public key goes in once per account under **Security -> SSH key**:

```
pbcopy < ~/.ssh/wpcom_attencity_ed25519.pub
```

Both screens require a **Business or Commerce** plan. On Premium there is no
shell at all, and the theme is installed through Appearance -> Themes -> Upload
using the zip that `pnpm run build:wordpress` produces.

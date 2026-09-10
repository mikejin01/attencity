# Per-site WordPress SSH + deploy config TEMPLATE.
#
# HOW TO USE
#   1. Copy this file to .live-sites/<site_key>.mk  (e.g. .live-sites/attencity.mk).
#   2. Fill in the real values for that install.
#   3. Use it:   make test-connection SITE=<site_key>
#                make build-and-push  SITE=<site_key>
#
#   With exactly one fragment present, SITE= can be omitted entirely.
#
# SECURITY
#   - Only this _template.mk is committed. Real .live-sites/*.mk files are
#     gitignored. Never paste real credentials into this file.
#   - Key auth only. Never put passwords here. The private key lives outside
#     the repo at WP_IDENTITY_FILE, chmod 600.

# ----- SSH connection -----
# WordPress.com: Settings -> SFTP/SSH generates the username. The host and port
# are the same for every site. This whole screen needs a Business or Commerce
# plan; on Premium there is no shell and the theme goes up through
# Appearance -> Themes -> Upload instead.
WP_USER           := REPLACE_WITH_SSH_USER
WP_DOMAIN         := attencity.com
WP_HOST           := ssh.wp.com
WP_PORT           := 22
WP_IDENTITY_FILE  := ~/.ssh/wpcom_attencity_ed25519

# ----- WordPress paths on the server -----
# WordPress.com Atomic serves the site from /srv/htdocs. Confirm it on the
# first connection (make ssh, then pwd and ls) before trusting a push.
WP_DOCROOT        := /srv/htdocs

# Theme folder name under wp-content/themes/.
WP_THEME_NAME     := attencity
WP_REMOTE_PATH    := $(WP_DOCROOT)/wp-content/themes/$(WP_THEME_NAME)/

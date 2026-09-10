# Per-site SiteGround SSH + deploy config TEMPLATE.
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
#     the repo at SITEGROUND_IDENTITY_FILE, chmod 600.

# ----- SSH connection -----
# Site Tools -> Devs -> SSH Keys Manager shows the username, hostname and port.
#
# NOTE for Attencity: ssh.attencity.com does NOT resolve, because the DNS zone
# is hosted at WordPress.com and no `ssh` record exists there. Use the hostname
# SiteGround shows you, or the server IP (35.209.60.242), or add an `ssh` A
# record in the WordPress.com DNS editor pointing at that IP.
SITEGROUND_USER           := REPLACE_WITH_SSH_USER
SITEGROUND_DOMAIN         := attencity.com
SITEGROUND_HOST           := REPLACE_WITH_SSH_HOST
SITEGROUND_PORT           := 18765
SITEGROUND_IDENTITY_FILE  := ~/.ssh/siteground

# ----- WordPress paths on the server -----
# Docroot is almost always www/<domain>/public_html on SiteGround. Confirm with
# `make ssh` then `ls www/` before the first push.
SITEGROUND_DOCROOT        := www/$(SITEGROUND_DOMAIN)/public_html

# Theme folder name under wp-content/themes/.
SITEGROUND_THEME_NAME     := attencity
SITEGROUND_REMOTE_PATH    := $(SITEGROUND_DOCROOT)/wp-content/themes/$(SITEGROUND_THEME_NAME)/

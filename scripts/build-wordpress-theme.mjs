#!/usr/bin/env node
// =====================================================================
// Compile the Attencity SvelteKit app into a WordPress theme.
//
//   pnpm run build:wordpress   →  wordpress-theme/  +  attencity.zip
//
// Two builds run here on purpose:
//   1. the normal prerendered build, ONLY to enumerate the real routes and
//      their titles, so the WordPress page list can never drift from the app;
//   2. the WP_BUILD SPA build, whose fallback page is split into PHP templates.
//
// Iron rule: everything under wordpress-theme/ is generated and overwritten on
// every run. Edit THIS FILE, never the output.
// See docs/SPA-TO-WORDPRESS-THEME-PLAYBOOK.md.
// =====================================================================
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = path.join(ROOT, 'build');
const THEME_DIR = path.join(ROOT, 'wordpress-theme');

/* ----------------------------------------------------------------- config */

const THEME = {
	slug: 'attencity',
	name: 'Attencity',
	description:
		'The Attencity SvelteKit site compiled into a WordPress theme. Generated — do not hand-edit.',
	author: 'X.O.',
	prefix: 'xo',
	restNamespace: 'xo/v1',
	adminPageTitle: 'X.O. Admin',
	adminMenuLabel: 'X.O. Admin'
};

const P = THEME.prefix;
const NS = THEME.restNamespace;
const BANNER = `<?php
/**
 * GENERATED FILE — DO NOT EDIT.
 *
 * Produced by scripts/build-wordpress-theme.mjs and overwritten on every
 * \`pnpm run build:wordpress\`. Make changes in that script instead.
 */
`;

const log = (m) => console.log(m);
const run = (cmd, env) =>
	execSync(cmd, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } });

/* ------------------------------------- 1. enumerate routes (normal build) */

log('🗺  Building the prerendered site to enumerate routes…');
run('pnpm exec vite build', { WP_BUILD: '', BASE_PATH: '' });

/** Every prerendered route, as a WordPress-ready { slug, title } list. */
function collectRoutes(dir, prefix = '') {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		if (entry.name.startsWith('_') || entry.name === 'assets') continue;
		const sub = path.join(dir, entry.name);
		const slug = prefix ? `${prefix}/${entry.name}` : entry.name;
		if (fs.existsSync(path.join(sub, 'index.html'))) {
			out.push({ slug, title: titleFrom(path.join(sub, 'index.html'), entry.name) });
		}
		out.push(...collectRoutes(sub, slug));
	}
	return out;
}

/**
 * The page's own <title>, minus the site-name suffix editors never want in a
 * WordPress page title. Falls back to a title-cased slug.
 */
function titleFrom(file, slug) {
	const m = fs.readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/);
	const raw = m ? m[1].trim() : '';
	const head = raw.split(/\s+[|—·–-]\s+/)[0].trim();
	if (head && head.toLowerCase() !== 'attencity') return decodeEntities(head);
	return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const decodeEntities = (s) =>
	s
		.replaceAll('&amp;', '&')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'");

const routes = collectRoutes(BUILD_DIR);
if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
	throw new Error('The prerendered build produced no front page. Route enumeration cannot proceed.');
}
const pages = [{ slug: '', title: 'Home' }, ...routes];
log(`   ${pages.length} routes found.`);

/* ------------------------------------------------- 2. build the SPA shell */

// The route walk above left a full prerendered tree in build/. adapter-static
// writes into that directory without clearing it, so without this the theme
// would ship 19 stale HTML pages from the OTHER build mode — dead weight, and
// the classic cause of "I rebuilt it but the old content is still there".
fs.rmSync(BUILD_DIR, { recursive: true, force: true });

log('🏗  Building the SPA in WordPress mode (no SSR, no prerender)…');
run('pnpm exec vite build', { WP_BUILD: '1', BASE_PATH: '' });

const fallbackPath = path.join(BUILD_DIR, 'index.html');
if (!fs.existsSync(fallbackPath)) {
	throw new Error(
		`Expected an SPA fallback at ${fallbackPath}. Check that WP_BUILD=1 turned off prerendering ` +
			'(src/routes/+layout.js) and that svelte.config.js set fallback: index.html.'
	);
}

/* -------------------------------------------- 3. fresh theme directory */

log('📁 Recreating wordpress-theme/…');
fs.rmSync(THEME_DIR, { recursive: true, force: true });
fs.mkdirSync(THEME_DIR, { recursive: true });
fs.cpSync(BUILD_DIR, THEME_DIR, { recursive: true });
fs.rmSync(path.join(THEME_DIR, '.DS_Store'), { force: true });
// WordPress serves its own sitemap through the SEO plugin; a stale static one
// would compete with it in Search Console.
fs.rmSync(path.join(THEME_DIR, 'sitemap.xml'), { force: true });
fs.rmSync(path.join(THEME_DIR, 'CNAME'), { force: true });

/* ------------------------------ 4. split the fallback page into templates */

log('✂️  Extracting boot markup from the fallback page…');
const html = fs.readFileSync(fallbackPath, 'utf8');

/**
 * SvelteKit emits root-absolute `/_app/...` URLs — relative ones cannot work on
 * a fallback served from every route. Point them at the theme directory,
 * resolved by PHP at render time so the same bundle works on any domain.
 */
const themify = (s) =>
	s
		.replaceAll('"/_app/', '"<?php echo esc_url(get_template_directory_uri()); ?>/_app/')
		.replaceAll("'/_app/", "'<?php echo esc_url(get_template_directory_uri()); ?>/_app/")
		.replaceAll('("/_app/', '("<?php echo esc_url(get_template_directory_uri()); ?>/_app/');

const appAssetTags = (html.match(/<link[^>]+href="\/_app\/[^"]*"[^>]*>/g) ?? []).join('\n\t');
if (!appAssetTags) {
	throw new Error(
		'No /_app/ asset tags found in the fallback page. SvelteKit changed its output shape — ' +
			're-check the extraction here (playbook §1.3b).'
	);
}

// Fonts and preconnects, kept verbatim from src/app.html.
const fontTags = (
	html.match(/<link[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/g) ?? []
).join('\n\t');

// The wrapper element and its inline init script, verbatim: the script mounts
// the app into its own parent element, so the nesting must survive intact.
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) throw new Error('Could not find <body> in the fallback page.');
const bootMarkup = themify(bodyMatch[1].trim());

// WordPress must never serve the raw fallback.
fs.rmSync(path.join(THEME_DIR, 'index.html'), { force: true });

/* ----------------------------------------------------- 5. generate the PHP */

log('🐘 Generating theme PHP…');
const today = new Date().toISOString().slice(0, 10);
// Setup gating needs a token that changes on EVERY build, which a date does
// not: deploying twice in one day would leave the version unchanged and the
// setup routine would never re-run.
const setupToken = new Date().toISOString();

const write = (file, contents) => fs.writeFileSync(path.join(THEME_DIR, file), contents);

const phpQuote = (s) => `'${String(s).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
const pageList = pages
	.map((p) => `\t\t${phpQuote(p.slug)} => ${phpQuote(p.title)},`)
	.join('\n');

write(
	'style.css',
	`/*
Theme Name: ${THEME.name}
Theme URI: https://attencity.com
Author: ${THEME.author}
Description: ${THEME.description}
Version: ${today}
Requires at least: 6.0
Tested up to: 7.0
License: Proprietary
Text Domain: ${THEME.slug}
*/

/* GENERATED FILE — DO NOT EDIT. See scripts/build-wordpress-theme.mjs.
   All real styling is compiled into the SPA bundle under _app/immutable/. */
`
);

/* header.php — charset, favicon, fonts, then the app's boot tags.
   data-attencity-theme is how assetRoot() in src/lib/wp/runtime.js finds the
   theme directory. An attribute is used rather than an inline script because an
   <img src> resolves the instant it renders and cannot wait for a script that
   an optimisation plugin may have deferred or stripped. */
write(
	'header.php',
	`${BANNER}?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#17181b">
	<link rel="icon" type="image/png" sizes="64x64" href="<?php echo esc_url(get_template_directory_uri()); ?>/favicon.png">
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(get_template_directory_uri()); ?>/apple-touch-icon.png">
	${fontTags}
	${themify(appAssetTags)}
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-attencity-theme="<?php echo esc_url(get_template_directory_uri()); ?>">
`
);

write('footer.php', `${BANNER}?>\n<?php wp_footer(); ?>\n</body>\n</html>\n`);

/* index.php — the app's own mount markup.
   No screen-reader <h1> is printed here: the app renders the page's real <h1>
   once it mounts, and a shell heading would mean two <h1> elements with
   different text. Google renders JavaScript, so the app's heading is indexed. */
const shell = () => `${BANNER}get_header(); ?>
${bootMarkup}
<?php get_footer(); ?>
`;

write('index.php', shell());
// A stray URL still boots the app; the SPA renders its own not-found view
// while WordPress keeps the 404 status code intact.
write('404.php', shell());
write('functions.php', functionsPhp());

/* ---------------------------------------------------------------- 6. zip */

log('🗜  Zipping the theme…');
const zipName = `${THEME.slug}.zip`;
fs.rmSync(path.join(ROOT, zipName), { force: true });
try {
	execSync(`cd "${THEME_DIR}" && zip -qr "../${zipName}" . -x "*.DS_Store"`, {
		cwd: ROOT,
		stdio: 'inherit',
		shell: '/bin/bash'
	});
} catch {
	log('   ⚠️  zip unavailable — skipping the archive (rsync deploy is unaffected)');
}

const zipPath = path.join(ROOT, zipName);
log('');
log('✅ Theme built.');
log(`   Folder:  wordpress-theme/`);
if (fs.existsSync(zipPath)) {
	const mb = (fs.statSync(zipPath).size / 1048576).toFixed(1);
	log(`   Upload:  ${zipPath}  (${mb} MB)`);
	log('');
	log('   Install: WP Admin → Appearance → Themes → Add New → Upload Theme');
	log('   Then:    Settings → Permalinks → Post name   (required for routes)');
}

/* =============================================================================
   functions.php
   ============================================================================= */

function functionsPhp() {
	return `${BANNER}
if (!defined('ABSPATH')) exit;

define('${P.toUpperCase()}_SETUP_TOKEN', ${phpQuote(setupToken)});

/* ------------------------------------------------------------ theme setup */

function ${P}_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'gallery', 'caption', 'style', 'script'));
    add_theme_support('automatic-feed-links');
}
add_action('after_setup_theme', '${P}_setup');

/**
 * One WordPress page per SPA route.
 *
 * This is what makes deep links resolve without rewrite hacks: WordPress finds
 * a real page, serves index.php, and the SPA router reads location.pathname and
 * renders the matching view. Each route also gets its own SEO fields and
 * sitemap entry this way.
 *
 * Generated from the prerendered route list — never edit by hand.
 */
function ${P}_required_pages() {
    return array(
${pageList}
    );
}

function ${P}_ensure_pages() {
    foreach (${P}_required_pages() as $slug => $title) {
        if ($slug === '') {
            $front = (int) get_option('page_on_front');
            if (!$front || !get_post($front)) {
                $existing = get_page_by_path('home');
                $id = $existing ? $existing->ID : wp_insert_post(array(
                    'post_type' => 'page', 'post_status' => 'publish',
                    'post_title' => $title, 'post_name' => 'home',
                ));
                if ($id && !is_wp_error($id)) {
                    update_option('show_on_front', 'page');
                    update_option('page_on_front', $id);
                }
            }
            continue;
        }
        // Nested routes (services/media-pr) need their parent to exist first so
        // WordPress builds the hierarchical permalink rather than a flat slug.
        $parts  = explode('/', $slug);
        $leaf   = array_pop($parts);
        $parent = 0;
        $trail  = '';
        foreach ($parts as $segment) {
            $trail = $trail === '' ? $segment : $trail . '/' . $segment;
            $ancestor = get_page_by_path($trail);
            if (!$ancestor) continue;
            $parent = $ancestor->ID;
        }
        if (!get_page_by_path($slug)) {
            wp_insert_post(array(
                'post_type'   => 'page',
                'post_status' => 'publish',
                'post_title'  => $title,
                'post_name'   => $leaf,
                'post_parent' => $parent,
            ));
        }
    }
    flush_rewrite_rules();
}

/**
 * Run setup once per build. The token changes on every build, so a redeploy
 * re-runs it and picks up newly added routes.
 */
function ${P}_maybe_run_setup() {
    if (get_option('${P}_setup_version') === ${P.toUpperCase()}_SETUP_TOKEN) return;
    ${P}_ensure_pages();
    ${P}_seed_defaults();
    update_option('${P}_setup_version', ${P.toUpperCase()}_SETUP_TOKEN);
}
add_action('after_switch_theme', '${P}_maybe_run_setup');
add_action('admin_init', '${P}_maybe_run_setup');

function ${P}_seed_defaults() {
    $defaults = array(
        '${P}_global_business_name'   => 'Attencity',
        '${P}_global_contact_email'   => '',
        '${P}_global_contact_phone'   => '',
        '${P}_global_contact_address' => '',
        '${P}_global_city_state'      => 'New York, NY',
    );
    foreach ($defaults as $k => $v) {
        if (get_option($k) === false) add_option($k, $v);
    }
}

/* -------------------------------------------------- the app's WP context */

function ${P}_wprest_payload() {
    return array(
        'root'     => esc_url_raw(rest_url()),
        'nonce'    => wp_create_nonce('wp_rest'),
        'postId'   => (int) get_queried_object_id(),
        'themeUri' => esc_url_raw(get_template_directory_uri()),
        'isLoggedIn' => current_user_can('edit_posts'),
        // Live edits, keyed by dot-path into the app's content tree. These
        // shadow the copy compiled into the bundle — see src/lib/wp/overrides.js.
        'content'  => (object) ${P}_content_overrides(),
        // The post list travels with the page rather than being fetched after
        // it. A fetch resolves late and pushes a new card into the grid, which
        // is a visible layout shift for every visitor. Bodies are heavy, so
        // only the post matching this URL carries one; the listings never need
        // any body at all.
        'posts'    => ${P}_posts_payload(${P}_current_page_slug()),
        'globals'  => array(
            'business_name'   => get_option('${P}_global_business_name', ''),
            'contact_email'   => get_option('${P}_global_contact_email', ''),
            'contact_phone'   => get_option('${P}_global_contact_phone', ''),
            'contact_address' => get_option('${P}_global_contact_address', ''),
            'city_state'      => get_option('${P}_global_city_state', ''),
        ),
    );
}

// Printed early so it is defined before the app's inline init script runs.
add_action('wp_head', function () {
    echo '<script>window.wpRest = ' . wp_json_encode(${P}_wprest_payload()) . ';</script>' . "\\n";
}, 5);

// Optimisation plugins sometimes strip or defer inline scripts, which would
// silently kill the payload above. The app can fetch this instead.
add_action('rest_api_init', function () {
    register_rest_route(${phpQuote(NS)}, '/bootstrap', array(
        'methods'             => 'GET',
        'callback'            => function () { return ${P}_wprest_payload(); },
        'permission_callback' => '__return_true',
    ));
});

/* ------------------------------------------------------------------ cache */

/**
 * The shell is identical for every route, but the app reads WordPress state
 * from it. Returning visitors must not be served a cached copy carrying a stale
 * nonce or a logged-out flag. Hashed assets under _app/immutable are the exact
 * opposite and are cached hard.
 */
add_action('send_headers', function () {
    if (is_admin() || is_feed()) return;
    header('Cache-Control: no-cache, must-revalidate, max-age=0');
});

/* -------------------------------------------------------------------- SEO */

/**
 * Defer entirely to a real SEO plugin when one is active — the live site runs
 * All in One SEO. Only when none is present does the theme fill the gap, and
 * even then only with the WordPress page title, which an editor controls.
 */
function ${P}_seo_plugin_active() {
    return defined('AIOSEO_VERSION') || defined('WPSEO_VERSION') || class_exists('RankMath');
}

add_filter('document_title_parts', function ($parts) {
    if (${P}_seo_plugin_active()) return $parts;
    if (is_front_page()) {
        $parts['title']  = get_option('${P}_global_business_name', 'Attencity');
        $parts['tagline'] = get_bloginfo('description');
    }
    return $parts;
});

/* --------------------------------------------------------- inline editing */

/** The saved map of dot-path => value. Always an array. */
function ${P}_content_overrides() {
    $saved = get_option('${P}_content_overrides', array());
    return is_array($saved) ? $saved : array();
}

/**
 * A content key is a dot-path into the app's content tree, such as
 * "home.hero.title", or "img.events/foo.webp" for a replaced image. Anything
 * else is refused rather than stored, so a malformed key never becomes a row.
 */
function ${P}_valid_content_key($key) {
    return is_string($key)
        && $key !== ''
        && strlen($key) <= 200
        && (bool) preg_match('/^[A-Za-z0-9_]+(\.[A-Za-z0-9_-]+)*$/', $key);
}

/**
 * Values are either copy or an image URL. A URL must go through the URL
 * sanitiser, because the text one would mangle it, and the protocol allowlist
 * is what keeps a javascript: URL out of an <img src> or an href.
 */
function ${P}_sanitize_content_value($value) {
    if (!is_string($value)) return '';
    $trimmed = trim($value);
    if (preg_match('#^(https?://|/wp-content/|//)#i', $trimmed)) {
        return esc_url_raw($trimmed, array('http', 'https'));
    }
    return sanitize_textarea_field($trimmed);
}

add_action('rest_api_init', function () {
    register_rest_route(${phpQuote(NS)}, '/save-page-data', array(
        'methods'             => 'POST',
        'callback'            => '${P}_save_page_data',
        // Same bar WordPress uses for editing a post. The nonce is checked by
        // the REST layer itself via the X-WP-Nonce header.
        'permission_callback' => function () { return current_user_can('edit_posts'); },
    ));
});

function ${P}_save_page_data($request) {
    $body = $request->get_json_params();
    $incoming = is_array($body) && isset($body['content']) && is_array($body['content'])
        ? $body['content']
        : array();

    $saved   = ${P}_content_overrides();
    $written = 0;
    $refused = array();

    foreach ($incoming as $key => $value) {
        if (!${P}_valid_content_key($key)) { $refused[] = (string) $key; continue; }
        $clean = ${P}_sanitize_content_value($value);
        if ($clean === '' && !is_string($value)) { $refused[] = (string) $key; continue; }
        $saved[$key] = $clean;
        $written++;
    }

    update_option('${P}_content_overrides', $saved, false);

    // Without this the visitor keeps being served the pre-edit HTML for hours.
    if (function_exists('sg_cachepress_purge_cache')) sg_cachepress_purge_cache();
    if (function_exists('wp_cache_flush')) wp_cache_flush();

    return new WP_REST_Response(array(
        'success' => true,
        'written' => $written,
        'refused' => $refused,
    ), 200);
}

/**
 * The Media Library picker the image overlay opens. Only loaded for users who
 * could edit anyway, so a visitor never pays for it.
 */
add_action('wp_enqueue_scripts', function () {
    if (current_user_can('edit_posts')) wp_enqueue_media();
});

/* ----------------------------------------------------------------- leads */

function ${P}_register_leads() {
    register_post_type('lead_submission', array(
        'labels'          => array('name' => 'Leads', 'singular_name' => 'Lead'),
        'public'          => false,
        'show_ui'         => true,
        'show_in_menu'    => false,
        'supports'        => array('title', 'editor'),
        'capability_type' => 'post',
    ));
}
add_action('init', '${P}_register_leads');

function ${P}_count_new_leads() {
    $q = new WP_Query(array(
        'post_type'      => 'lead_submission',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'fields'         => 'ids',
        'no_found_rows'  => true,
        'meta_query'     => array(array('key' => 'lead_reviewed', 'value' => '1', 'compare' => '!=')),
    ));
    return count($q->posts);
}

add_action('rest_api_init', function () {
    register_rest_route(${phpQuote(NS)}, '/lead', array(
        'methods'             => 'POST',
        'callback'            => '${P}_handle_lead',
        'permission_callback' => '__return_true',
    ));
});

function ${P}_handle_lead($request) {
    $p = $request->get_json_params();
    if (!is_array($p)) $p = array();

    // Honeypot. Return success so a bot gets no useful feedback signal.
    if (!empty($p['company_website'])) {
        return new WP_REST_Response(array('success' => true), 200);
    }

    $name    = sanitize_text_field($p['name'] ?? '');
    $email   = sanitize_email($p['email'] ?? '');
    $message = sanitize_textarea_field($p['message'] ?? '');
    if (!$name || !$email || !$message) {
        return new WP_REST_Response(array('success' => false, 'message' => 'Missing required fields.'), 400);
    }

    $fields = array(
        'name'        => $name,
        'email'       => $email,
        'company'     => sanitize_text_field($p['company'] ?? ''),
        'job_title'   => sanitize_text_field($p['job_title'] ?? ''),
        'heard_from'  => sanitize_text_field($p['heard_from'] ?? ''),
        'newsletter'  => !empty($p['newsletter_optin']) ? 'yes' : 'no',
        'page'        => sanitize_text_field($p['page'] ?? ''),
        'message'     => $message,
    );

    $body = '';
    foreach ($fields as $k => $v) {
        if ($k === 'message') continue;
        $body .= ucwords(str_replace('_', ' ', $k)) . ': ' . ($v === '' ? '—' : $v) . "\\n";
    }
    $body .= "\\n" . $message . "\\n";

    $post_id = wp_insert_post(array(
        'post_type'    => 'lead_submission',
        'post_status'  => 'publish',
        'post_title'   => sprintf('Lead: %s (%s)', $name, current_time('Y-m-d H:i')),
        'post_content' => $body,
    ), true);
    if (is_wp_error($post_id)) {
        return new WP_REST_Response(array('success' => false, 'message' => 'Failed to save lead.'), 500);
    }
    foreach ($fields as $k => $v) update_post_meta($post_id, 'lead_' . $k, $v);
    update_post_meta($post_id, 'lead_reviewed', '0');

    // Forwarded to whatever address is set on the admin page, read live on every
    // submission so changing it there needs no code change.
    $to = get_option('${P}_global_contact_email', '');
    if ($to && is_email($to)) {
        $brand = get_option('${P}_global_business_name', '') ?: wp_parse_url(home_url(), PHP_URL_HOST);
        wp_mail(
            $to,
            sprintf('[%s] New enquiry: %s', $brand, $name),
            $body,
            array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $name . ' <' . $email . '>')
        );
    }
    return new WP_REST_Response(array('success' => true, 'id' => (int) $post_id), 200);
}

add_filter('manage_lead_submission_posts_columns', function ($cols) {
    return array(
        'cb'          => $cols['cb'] ?? '',
        'title'       => 'Name',
        'lead_email'  => 'Email',
        'lead_company'=> 'Company',
        'lead_status' => 'Status',
        'date'        => 'Received',
    );
});

add_action('manage_lead_submission_posts_custom_column', function ($col, $post_id) {
    if ($col === 'lead_email') {
        $v = (string) get_post_meta($post_id, 'lead_email', true);
        echo $v ? '<a href="mailto:' . esc_attr($v) . '">' . esc_html($v) . '</a>' : '—';
    } elseif ($col === 'lead_company') {
        echo esc_html(get_post_meta($post_id, 'lead_company', true) ?: '—');
    } elseif ($col === 'lead_status') {
        if (get_post_meta($post_id, 'lead_reviewed', true) === '1') {
            echo '<span style="color:#065f46;font-weight:600;">Reviewed</span>';
            return;
        }
        $url = wp_nonce_url(
            admin_url('admin-post.php?action=${P}_mark_reviewed&lead_id=' . (int) $post_id),
            '${P}_mark_reviewed_' . (int) $post_id
        );
        echo '<a class="button button-small" href="' . esc_url($url) . '">Mark reviewed</a>';
    }
}, 10, 2);

add_action('admin_post_${P}_mark_reviewed', function () {
    $id = (int) ($_GET['lead_id'] ?? 0);
    if ($id && current_user_can('edit_posts') && check_admin_referer('${P}_mark_reviewed_' . $id)) {
        update_post_meta($id, 'lead_reviewed', '1');
    }
    wp_safe_redirect(admin_url('edit.php?post_type=lead_submission'));
    exit;
});

/* ---------------------------------------------------------- blog authoring */

/**
 * Insights and Case Studies the client writes in the dashboard.
 *
 * Both are registered publicly_queryable => false with rewrite => false, so
 * neither ever owns a URL of its own. That is deliberate: the theme already
 * routes every page of this site through one WordPress page per route, and a
 * custom post type with its own rewrite base would add competing rules for
 * /insights/... and shadow the pages that already resolve. Instead, publishing
 * a post creates the matching page (see ${P}_sync_post_page), so a new post
 * takes exactly the same proven path through WordPress as every other route.
 */
function ${P}_post_types() {
    return array(
        '${P}_insight'     => array('base' => 'insights',      'label' => 'Insights',     'single' => 'Insight'),
        '${P}_case_study'  => array('base' => 'case-studies',  'label' => 'Case Studies', 'single' => 'Case Study'),
    );
}

add_action('init', function () {
    foreach (${P}_post_types() as $type => $meta) {
        register_post_type($type, array(
            'labels' => array(
                'name'          => $meta['label'],
                'singular_name' => $meta['single'],
                'add_new_item'  => 'Add New ' . $meta['single'],
                'edit_item'     => 'Edit ' . $meta['single'],
            ),
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => false,   // added to the menu by hand, below
            'show_in_rest'        => true,    // the block editor
            'publicly_queryable'  => false,
            'rewrite'             => false,
            'has_archive'         => false,
            'supports'            => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions'),
            'capability_type'     => 'post',
            'menu_icon'           => 'dashicons-edit',
        ));
    }
});

/* --- the small extra fields the templates use ---------------------------- */

function ${P}_post_meta_fields() {
    return array(
        '_xo_date_label' => 'Date label (optional, e.g. "July 26, 2025")',
        '_xo_location'   => 'Location (optional)',
        '_xo_client'     => 'Client (case studies)',
        '_xo_tags'       => 'Tags, comma separated',
        '_xo_services'   => 'Related service slugs, comma separated',
    );
}

add_action('add_meta_boxes', function () {
    foreach (array_keys(${P}_post_types()) as $type) {
        add_meta_box('${P}_post_details', 'Post details', '${P}_render_post_meta_box', $type, 'side', 'default');
    }
});

function ${P}_render_post_meta_box($post) {
    wp_nonce_field('${P}_save_post_meta', '${P}_post_meta_nonce');
    echo '<p class="description" style="margin-top:0;">The headline, body, summary and header image come from the editor and the Featured image. These are the extras.</p>';
    foreach (${P}_post_meta_fields() as $key => $label) {
        $value = (string) get_post_meta($post->ID, $key, true);
        printf(
            '<p><label for="%1$s"><strong>%2$s</strong></label>'
            . '<input type="text" id="%1$s" name="%1$s" value="%3$s" style="width:100%%;"></p>',
            esc_attr($key), esc_html($label), esc_attr($value)
        );
    }
}

add_action('save_post', function ($post_id, $post) {
    if (!isset(${P}_post_types()[$post->post_type])) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['${P}_post_meta_nonce'])
        && wp_verify_nonce($_POST['${P}_post_meta_nonce'], '${P}_save_post_meta')) {
        foreach (array_keys(${P}_post_meta_fields()) as $key) {
            if (!isset($_POST[$key])) continue;
            update_post_meta($post_id, $key, sanitize_text_field($_POST[$key]));
        }
    }
    ${P}_sync_post_page($post);
}, 10, 2);

/**
 * Keep a WordPress page in step with a post, so /insights/<slug>/ resolves.
 *
 * Published post  -> a published child page under the listing page.
 * Anything else   -> that page is moved to draft, so the URL stops resolving
 *                    rather than serving a shell for content that is gone.
 */
function ${P}_sync_post_page($post) {
    $types = ${P}_post_types();
    if (!isset($types[$post->post_type])) return;
    $base = $types[$post->post_type]['base'];
    $slug = $post->post_name;
    if (!$slug) return;

    $parent = get_page_by_path($base);
    $existing = get_page_by_path($base . '/' . $slug);
    $wanted = ($post->post_status === 'publish') ? 'publish' : 'draft';

    if ($existing) {
        if ($existing->post_status !== $wanted || $existing->post_title !== $post->post_title) {
            wp_update_post(array(
                'ID'          => $existing->ID,
                'post_status' => $wanted,
                'post_title'  => $post->post_title,
            ));
        }
    } elseif ($wanted === 'publish') {
        wp_insert_post(array(
            'post_type'   => 'page',
            'post_status' => 'publish',
            'post_title'  => $post->post_title,
            'post_name'   => $slug,
            'post_parent' => $parent ? $parent->ID : 0,
            'meta_input'  => array('_xo_routes_post' => (int) $post->ID),
        ));
        flush_rewrite_rules();
    }
}

// A trashed or deleted post must not leave a live URL behind.
add_action('trashed_post', function ($post_id) {
    $post = get_post($post_id);
    if ($post) ${P}_sync_post_page($post);
});
add_action('untrashed_post', function ($post_id) {
    $post = get_post($post_id);
    if ($post) ${P}_sync_post_page($post);
});

/* --- what the app reads -------------------------------------------------- */

function ${P}_post_payload($post, $with_body = true) {
    $thumb = get_the_post_thumbnail_url($post->ID, 'full');
    $tags = array_values(array_filter(array_map('trim',
        explode(',', (string) get_post_meta($post->ID, '_xo_tags', true)))));
    $services = array_values(array_filter(array_map('trim',
        explode(',', (string) get_post_meta($post->ID, '_xo_services', true)))));

    return array(
        'slug'      => $post->post_name,
        'title'     => get_the_title($post),
        'date'      => get_the_date('Y-m-d', $post),
        'dateLabel' => (string) get_post_meta($post->ID, '_xo_date_label', true) ?: get_the_date('F j, Y', $post),
        'excerpt'   => wp_strip_all_tags(get_the_excerpt($post)),
        'hero'      => $thumb ? $thumb : '',
        'heroAlt'   => $thumb ? (string) get_post_meta(get_post_thumbnail_id($post->ID), '_wp_attachment_image_alt', true) : '',
        'location'  => (string) get_post_meta($post->ID, '_xo_location', true),
        'client'    => (string) get_post_meta($post->ID, '_xo_client', true),
        'tags'      => $tags,
        'services'  => $services,
        // Rendered here rather than in the browser so shortcodes, blocks and
        // embeds all behave exactly as WordPress intends. Omitted unless this
        // is the post being viewed, to keep every other page's payload small.
        'body'      => $with_body ? apply_filters('the_content', $post->post_content) : null,
    );
}

/** The slug of the page being viewed, used to decide which body to inline. */
function ${P}_current_page_slug() {
    $obj = get_queried_object();
    return ($obj && isset($obj->post_name)) ? (string) $obj->post_name : '';
}

/**
 * Every published post, grouped by kind. Only the post whose slug matches
 * $with_body carries its rendered content; the rest are listing metadata.
 */
function ${P}_posts_payload($with_body = '') {
    $out = array();
    foreach (${P}_post_types() as $type => $meta) {
        $key = ($type === '${P}_insight') ? 'insights' : 'caseStudies';
        $out[$key] = array();
        $posts = get_posts(array(
            'post_type'      => $type,
            'post_status'    => 'publish',
            'posts_per_page' => 200,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ));
        foreach ($posts as $post) {
            $out[$key][] = ${P}_post_payload($post, $post->post_name === $with_body);
        }
    }
    return $out;
}

add_action('rest_api_init', function () {
    register_rest_route(${phpQuote(NS)}, '/posts', array(
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        // Kept as a fallback for the case the inline payload was stripped by an
        // optimisation plugin, and for a post opened by client-side navigation.
        'callback'            => function () {
            $out = array();
            foreach (${P}_post_types() as $type => $meta) {
                $key = ($type === '${P}_insight') ? 'insights' : 'caseStudies';
                $out[$key] = array();
                $posts = get_posts(array(
                    'post_type'      => $type,
                    'post_status'    => 'publish',
                    'posts_per_page' => 200,
                    'orderby'        => 'date',
                    'order'          => 'DESC',
                ));
                foreach ($posts as $post) $out[$key][] = ${P}_post_payload($post, true);
            }
            return $out;
        },
    ));
});

/* ------------------------------------------------------------ admin page */

add_action('admin_menu', function () {
    add_menu_page(
        ${phpQuote(THEME.adminPageTitle)}, ${phpQuote(THEME.adminMenuLabel)},
        'manage_options', '${P}-admin', '${P}_render_admin_page', 'dashicons-megaphone', 3
    );
    $new   = ${P}_count_new_leads();
    $label = 'Leads';
    if ($new > 0) {
        $label .= ' <span class="awaiting-mod count-' . (int) $new . '"><span class="pending-count">'
                . (int) $new . '</span></span>';
    }
    add_menu_page('Leads', $label, 'edit_posts',
        'edit.php?post_type=lead_submission', '', 'dashicons-email-alt', 4);

    // Writing surfaces, right under Leads.
    $pos = 5;
    foreach (${P}_post_types() as $type => $meta) {
        add_menu_page($meta['label'], $meta['label'], 'edit_posts',
            'edit.php?post_type=' . $type, '', 'dashicons-edit', $pos++);
    }
});

// POST -> Redirect -> GET, handled before any admin HTML is sent.
add_action('admin_init', function () {
    if (!current_user_can('manage_options')) return;

    if (isset($_POST['${P}_save_details'])) {
        check_admin_referer('${P}_save_details');
        update_option('${P}_global_business_name',   sanitize_text_field($_POST['business_name'] ?? ''));
        update_option('${P}_global_contact_email',   sanitize_email($_POST['contact_email'] ?? ''));
        update_option('${P}_global_contact_phone',   sanitize_text_field($_POST['phone'] ?? ''));
        update_option('${P}_global_contact_address', sanitize_textarea_field($_POST['address'] ?? ''));
        update_option('${P}_global_city_state',      sanitize_text_field($_POST['city_state'] ?? ''));
        wp_redirect(add_query_arg('${P}_saved', '1', admin_url('admin.php?page=${P}-admin')));
        exit;
    }

    if (isset($_POST['${P}_repair_pages'])) {
        check_admin_referer('${P}_repair_pages');
        ${P}_ensure_pages();
        wp_redirect(add_query_arg('${P}_repaired', '1', admin_url('admin.php?page=${P}-admin')));
        exit;
    }

    if (isset($_POST['${P}_reset_content'])) {
        check_admin_referer('${P}_reset_content');
        delete_option('${P}_content_overrides');
        if (function_exists('sg_cachepress_purge_cache')) sg_cachepress_purge_cache();
        wp_redirect(add_query_arg('${P}_reset', '1', admin_url('admin.php?page=${P}-admin')));
        exit;
    }
});

function ${P}_render_admin_page() {
    if (isset($_GET['${P}_saved']))    echo '<div class="updated notice is-dismissible"><p>Saved.</p></div>';
    if (isset($_GET['${P}_repaired'])) echo '<div class="updated notice is-dismissible"><p>Pages checked.</p></div>';
    if (isset($_GET['${P}_reset']))    echo '<div class="updated notice is-dismissible"><p>Live edits cleared.</p></div>';

    $email = get_option('${P}_global_contact_email', '');
    if (!$email || !is_email($email)) {
        echo '<div class="notice notice-warning"><p><strong>No notification email set.</strong> '
           . 'Enquiries are still saved under Leads, but nothing is emailed until you set an address below.</p></div>';
    }

    $permalinks = get_option('permalink_structure');
    if (empty($permalinks)) {
        echo '<div class="notice notice-error"><p><strong>Plain permalinks are on.</strong> '
           . 'The site\\'s pages will not resolve until you set '
           . '<a href="' . esc_url(admin_url('options-permalink.php')) . '">Settings → Permalinks</a> to '
           . '<strong>Post name</strong>.</p></div>';
    }
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(${phpQuote(THEME.adminPageTitle)}); ?></h1>
        <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;margin-top:20px;">
            <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
                <h2 style="margin-top:0;">Business details</h2>
                <form method="post">
                    <?php wp_nonce_field('${P}_save_details'); ?>
                    <table class="form-table">
                        <tr><th><label>Business name</label></th>
                            <td><input name="business_name" type="text" class="regular-text"
                                value="<?php echo esc_attr(get_option('${P}_global_business_name')); ?>"></td></tr>
                        <tr><th><label>Notification email</label></th>
                            <td><input name="contact_email" type="email" class="regular-text"
                                value="<?php echo esc_attr($email); ?>" placeholder="you@attencity.com">
                                <p class="description"><strong>Every enquiry is emailed here.</strong></p></td></tr>
                        <tr><th><label>Phone</label></th>
                            <td><input name="phone" type="text" class="regular-text"
                                value="<?php echo esc_attr(get_option('${P}_global_contact_phone')); ?>"></td></tr>
                        <tr><th><label>City / State</label></th>
                            <td><input name="city_state" type="text" class="regular-text"
                                value="<?php echo esc_attr(get_option('${P}_global_city_state')); ?>"></td></tr>
                        <tr><th><label>Address</label></th>
                            <td><textarea name="address" rows="2" class="large-text"><?php
                                echo esc_textarea(get_option('${P}_global_contact_address')); ?></textarea></td></tr>
                    </table>
                    <input type="hidden" name="${P}_save_details" value="1">
                    <?php submit_button('Save changes'); ?>
                </form>
            </div>

            <div style="display:flex;flex-direction:column;gap:20px;">
                <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
                    <h2 style="margin-top:0;">Maintenance</h2>
                    <form method="post">
                        <?php wp_nonce_field('${P}_repair_pages'); ?>
                        <input type="hidden" name="${P}_repair_pages" value="1">
                        <p class="description">Recreates any WordPress page the site expects and re-sets the front page.
                           Safe to run more than once.</p>
                        <?php submit_button('Check &amp; create missing pages', 'secondary', 'submit', false); ?>
                    </form>
                    <hr>
                    <form method="post" onsubmit="return confirm('Clear every text and image edit made on the site and go back to the copy shipped with the theme?');">
                        <?php wp_nonce_field('${P}_reset_content'); ?>
                        <input type="hidden" name="${P}_reset_content" value="1">
                        <p class="description">
                            <?php $n = count(${P}_content_overrides()); ?>
                            <?php echo (int) $n; ?> live edit<?php echo $n === 1 ? '' : 's'; ?> currently override the theme's copy.
                            Business details above are kept.
                        </p>
                        <?php submit_button('Reset page content', 'delete', 'submit', false); ?>
                    </form>
                </div>
                <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
                    <h2 style="margin-top:0;">Editing the page itself</h2>
                    <p class="description">Open <a href="<?php echo esc_url(home_url('/')); ?>">the site</a> while
                       logged in and use the <strong>Edit page</strong> button in the bottom-right corner. Text and
                       images become editable in place; <strong>Save changes</strong> publishes them.</p>
                </div>
                <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e2e8f0;">
                    <h2 style="margin-top:0;">Routes served by this theme</h2>
                    <p class="description">One WordPress page backs each of these. Generated from the app's own routes.</p>
                    <p style="max-height:180px;overflow:auto;font-family:monospace;font-size:12px;line-height:1.7;">
                        <?php foreach (array_keys(${P}_required_pages()) as $slug) {
                            echo esc_html('/' . $slug . ($slug === '' ? '' : '/')) . '<br>';
                        } ?>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <?php
}
`;
}

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/**
 * Static SvelteKit config for GitHub Pages.
 *
 * `paths.base` must match the repo name when deployed to a project page
 * (https://<user>.github.io/<repo>/). The GitHub Actions workflow sets
 * BASE_PATH to `/<repo>` at build time; with a custom domain (static/CNAME)
 * it stays empty so the site serves from the root.
 *
 * mdsvex compiles the case studies and insights posts in src/content/ into
 * Svelte components with a `metadata` export (see src/lib/content/posts.js).
 * Nothing in src/routes/ is markdown, so no `.md` file becomes a route.
 */
const dev = process.argv.includes('dev');
const WP_BUILD = process.env.WP_BUILD === '1';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// SPA mode needs the fallback AT index.html (nothing is prerendered);
			// the static build prerenders every route and uses 404.html for strays.
			fallback: WP_BUILD ? 'index.html' : '404.html',
			precompress: false,
			strict: !WP_BUILD
		}),
		paths: {
			// WP_BUILD keeps base empty on purpose: routes must resolve at the site
			// root, while ASSET urls get the theme directory prefix at runtime via
			// src/lib/wp/runtime.js. One base cannot serve both.
			base: dev || WP_BUILD ? '' : process.env.BASE_PATH || ''
		}
	}
};

export default config;

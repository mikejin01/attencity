import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Static SvelteKit config for GitHub Pages.
 *
 * `paths.base` must match the repo name when deployed to a project page
 * (https://<user>.github.io/<repo>/). The GitHub Actions workflow sets
 * BASE_PATH to `/<repo>` at build time; locally it defaults to '' so
 * `pnpm dev` / `pnpm preview` serve from the root.
 */
const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: dev ? '' : process.env.BASE_PATH || ''
		}
	}
};

export default config;

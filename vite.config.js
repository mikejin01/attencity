import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/**
 * Two build modes share this config:
 *
 *   pnpm build              → prerendered static site (GitHub Pages)
 *   WP_BUILD=1 pnpm build   → client-only SPA shell for the WordPress theme
 *
 * `__WP_BUILD__` is substituted at build time so `src/routes/+layout.js` can
 * switch `ssr`/`prerender` off without a .env file. SvelteKit reads those
 * exports while bundling, so a runtime env lookup would be too late.
 */
const WP_BUILD = process.env.WP_BUILD === '1';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__WP_BUILD__: JSON.stringify(WP_BUILD)
	}
});

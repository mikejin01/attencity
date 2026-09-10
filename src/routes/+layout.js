/* global __WP_BUILD__ */
// Two shapes, one codebase (see vite.config.js / svelte.config.js):
//
//   pnpm build            → prerendered static HTML for GitHub Pages.
//   WP_BUILD=1 pnpm build → pure client-rendered SPA. WordPress serves the
//                           shell, so nothing may be baked into the HTML.
export const ssr = !__WP_BUILD__;
export const prerender = !__WP_BUILD__;
export const trailingSlash = 'always';

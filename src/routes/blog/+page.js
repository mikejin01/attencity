// The original site listed case studies at /blog/. Keep old links working with
// a prerendered redirect to /case-studies/.
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export function load() {
	redirect(301, `${base}/case-studies/`);
}

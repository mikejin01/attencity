// The original site listed posts at /blog/. Keep old links working with a
// prerendered redirect to the Insights listing (plan §8.3).
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export function load() {
	redirect(301, `${base}/insights/`);
}

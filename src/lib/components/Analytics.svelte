<!-- GA4 tag, rendered only when a measurement id is configured
     (site.analytics.ga4Id). No property exists yet — the owner creates one and
     pastes the G-XXXXXXXXXX id into src/lib/content/attencity.js (plan §8.5).

     Consent defaults are set BEFORE the tag loads: analytics storage granted,
     ad storage denied, IP anonymisation on — so the tag is defensible without
     a banner. `generate_lead` is pushed by the contact form (src/lib/lead.js). -->
<script>
	import { site } from '$lib/content/attencity.js';
	const id = site.analytics?.ga4Id ?? '';
	const bootstrap = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true,send_page_view:true});`;
</script>

<svelte:head>
	{#if id}
		<script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
		{@html `<script>${bootstrap}<\/script>`}
	{/if}
</svelte:head>

<!-- Near-black footer: lockup + tagline, Menu, Useful links, and a Follow Us
     column that only renders for social entries with a URL (plan §4.9 / §8 Q2). -->
<script>
	import { base } from '$app/paths';
	import AttencityLogo from './AttencityLogo.svelte';
	import { socialIcons } from './icons.js';
	import { site, nav, footer, route } from '$lib/content/attencity.js';

	const socials = footer.social.filter((s) => s.href);
</script>

<footer class="site-footer" class:site-footer--no-social={socials.length === 0}>
	<div class="container container--lg">
		<div class="footer-row">
			<div class="f-col-logo">
				<div class="site-footer__logo">
					<a class="brand-lockup" href="{base}/" rel="home" aria-label="Attencity — home"><AttencityLogo /></a>
				</div>
				<p class="footer-headline">{site.tagline}</p>
				<p class="footer-tagline">{site.promise}</p>
			</div>
			<div class="f-col-menu">
				<span class="footer-label">{footer.menuLabel}</span>
				<ul>
					{#each nav.links as l (l.href)}
						<li><a href={route(l.href)}>{l.label}</a></li>
					{/each}
				</ul>
			</div>
			<div class="f-col-menu">
				<span class="footer-label">{footer.usefulLabel}</span>
				<ul>
					{#each footer.useful as l (l.href)}
						<li><a href={route(l.href)}>{l.label}</a></li>
					{/each}
				</ul>
			</div>
			{#if socials.length}
				<div class="f-col-social">
					<span class="footer-label">{footer.followLabel}</span>
					<div class="site-footer__social">
						{#each socials as s (s.icon)}
							<a href={s.href} aria-label={s.name} target="_blank" rel="noopener noreferrer">
								<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={socialIcons[s.icon]} /></svg>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
		<div class="footer-legal">
			<p class="copyright">{footer.copyright}</p>
		</div>
	</div>
</footer>

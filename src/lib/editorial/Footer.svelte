<!-- Near-black footer: lockup + address block, all seven services, company
     links, and the social icons. Entries without an href render as plain
     text (Xiaohongshu has no public profile URL yet — plan §10 Q3). -->
<script>
	import { base } from '$app/paths';
	import AttencityLogo from './AttencityLogo.svelte';
	import { socialIcons } from './icons.js';
	import { site, nav, footer, services, route } from '$lib/content/attencity.js';

	const socials = site.social.filter((s) => !s.hidden);
	const c = site.contact;
	const menu = footer.menu.filter((l) => nav.links.some((n) => n.href === l.href));
</script>

<footer class="site-footer">
	<div class="container container--lg">
		<div class="footer-row">
			<div class="f-col-logo">
				<div class="site-footer__logo">
					<a class="brand-lockup" href="{base}/" rel="home" aria-label="Attencity — home"><AttencityLogo /></a>
				</div>
				<p class="footer-headline">{site.tagline}</p>
				<address class="footer-address">
					<span>{c.street}</span>
					<span>{c.locality}, {c.region} {c.postalCode}</span>
					<a href="tel:{c.phone.replace(/[^+\d]/g, '')}">{c.phone}</a>
					<a href="mailto:{c.email}">{c.email}</a>
				</address>
			</div>

			<div class="f-col-menu">
				<span class="footer-label">{footer.servicesLabel}</span>
				<ul>
					{#each services as s (s.slug)}
						<li><a href={route(`/services/${s.slug}/`)}>{s.navTitle ?? s.title}</a></li>
					{/each}
				</ul>
			</div>

			<div class="f-col-menu">
				<span class="footer-label">{footer.menuLabel}</span>
				<ul>
					{#each menu as l (l.href)}
						<li><a href={route(l.href)}>{l.label}</a></li>
					{/each}
				</ul>
			</div>

			<div class="f-col-social">
				<span class="footer-label">{footer.followLabel}</span>
				<div class="site-footer__social">
					{#each socials as s (s.icon)}
						{#if s.href}
							<a href={s.href} aria-label={s.name} target="_blank" rel="noopener noreferrer">
								<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={socialIcons[s.icon]} /></svg>
							</a>
						{:else}
							<a href={route('/contact/#social')} aria-label="{s.name} — {s.handle}">
								<svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={socialIcons[s.icon]} /></svg>
							</a>
						{/if}
					{/each}
				</div>
				<ul class="footer-handles">
					{#each socials as s (s.name)}
						<li>
							<span class="footer-handles__net">{s.shortName ?? s.name}</span>
							{#if s.href}
								<a href={s.href} target="_blank" rel="noopener noreferrer">{s.handle}</a>
							{:else}
								<span>{s.handle}</span>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="footer-legal">
			<p class="copyright">{footer.copyright}</p>
		</div>
	</div>
</footer>

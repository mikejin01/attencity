<!-- Fixed headroom navbar: transparent over the dark hero, solid white once
     scrolled, hides on scroll-down. Flat page links + the "Get in touch" CTA;
     a full-screen dark menu on small screens. -->
<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import AttencityLogo from './AttencityLogo.svelte';
	import { nav, route } from '$lib/content/attencity.js';
	import { openContact } from '$lib/contact.svelte.js';

	let navHidden = $state(false);
	let navSolid = $state(false);
	let menuOpen = $state(false);
	let lastY = 0;

	function onScroll() {
		const y = window.scrollY;
		navSolid = y > 40;
		navHidden = !menuOpen && y > 120 && y > lastY;
		lastY = y;
	}
	const norm = (p) => p.replace(/\/+$/, '') || '/';
	function isActive(href) {
		return norm(page.url.pathname) === norm(route(href));
	}
	function closeMenu() {
		menuOpen = false;
	}
	beforeNavigate(closeMenu);

	$effect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		if (menuOpen) navHidden = false;
	});
	onMount(() => {
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={(e) => menuOpen && e.key === 'Escape' && closeMenu()} />

<nav
	class="navbar"
	class:hidden={navHidden}
	class:solid={navSolid && !menuOpen}
	class:menu-open={menuOpen}
	aria-label="Primary"
>
	<div class="navbar-inner">
		<div class="navbar-brand">
			<a class="brand-lockup" href="{base}/" rel="home" aria-label="Attencity — home"><AttencityLogo /></a>
		</div>
		<div class="navbar-nav">
			{#each nav.links as l (l.href)}
				<a class="nav-link" href={route(l.href)} aria-current={isActive(l.href) ? 'page' : undefined}>{l.label}</a>
			{/each}
			<div class="navbar-cta">
				<button class="btn btn-outline-light btn-sm" type="button" onclick={openContact}>{nav.cta}</button>
			</div>
		</div>
		<button
			class="menu-toggle"
			type="button"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{#if menuOpen}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="5" x2="23" y2="5" /><line x1="1" y1="12" x2="23" y2="12" /><line x1="1" y1="19" x2="23" y2="19" /></svg>
			{/if}
		</button>
	</div>
</nav>

{#if menuOpen}
	<div class="mobile-menu" id="mobile-menu">
		<nav class="mobile-menu__links" aria-label="Mobile">
			{#each nav.links as l (l.href)}
				<a class="mobile-menu__link" href={route(l.href)} aria-current={isActive(l.href) ? 'page' : undefined} onclick={closeMenu}>{l.label}</a>
			{/each}
		</nav>
		<div class="mobile-menu__cta">
			<button
				class="btn btn-primary"
				type="button"
				onclick={() => {
					closeMenu();
					openContact();
				}}>{nav.cta}</button
			>
		</div>
	</div>
{/if}

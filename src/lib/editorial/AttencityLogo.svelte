<!-- Attencity lockup: the "A" mark as an inline SVG (traced from the client's
     500×500 logo PNG) beside a live-text ATTENCITY wordmark. Everything draws in
     `currentColor`, so the parent sets the colour (white on dark chrome, ink on
     the solid navbar). Size it with the inherited custom properties:
       --logo-mark  mark height (default 30px)
       --logo-text  wordmark font-size (default 18px) -->
<svg class="brand-lockup__mark" viewBox="0 0 1000 799" aria-hidden="true" focusable="false">
	<path fill="currentColor" d="M454 1L435 17L171 475L7 762L0 776L2 791L13 799L274 799L292 790L306 775L600 271L846 692L847 699L834 706L772 706L755 700L607 451L598 446L557 514L556 540L696 780L708 790L726 795L985 795L999 791L1000 782L973 732L603 97L592 100L584 114L260 676L241 693L211 706L175 707L150 698L542 9L535 0Z" />
</svg>
<span class="brand-lockup__word">Attencity</span>

<style>
	.brand-lockup__mark {
		display: block;
		height: var(--logo-mark, 30px);
		width: calc(var(--logo-mark, 30px) * 1.2516);
		flex: none;
	}
	.brand-lockup__word {
		display: block;
		font-family: 'Montserrat', var(--inter, 'Inter', sans-serif);
		font-weight: 700;
		font-size: var(--logo-text, 18px);
		line-height: 1;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		/* optical: the mark's mass sits low, so nudge the wordmark down a hair */
		transform: translateY(0.06em);
		white-space: nowrap;
	}
</style>

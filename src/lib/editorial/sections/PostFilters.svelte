<!-- Two rows of filter chips over the case-study listing: what we did
     (Events / PR / Social / GEO …) and who for (Beauty / Tech / F&B …).

     Owner feedback §4: "Tag each case by service and industry. Once we have
     more cases, the client can filter out the case they are looking for."

     Options come from the posts on the page, so a chip is never shown with
     nothing behind it, and the whole row disappears while there is only one
     thing to pick. Filtering is client-side over an already-rendered grid, so
     the listing is complete for crawlers and for anyone without JavaScript. -->
<script>
	/** @type {{ options: {services: string[], industries: string[]},
	 *  service: string, industry: string, allLabel?: string, count?: number }} */
	let {
		options,
		service = $bindable(''),
		industry = $bindable(''),
		allLabel = 'All work',
		count = 0
	} = $props();

	const rows = $derived(
		[
			{ key: 'service', label: 'What we did', values: options.services },
			{ key: 'industry', label: 'Industry', values: options.industries }
		].filter((r) => r.values.length > 1)
	);
	const active = $derived(Boolean(service || industry));

	function pick(key, value) {
		if (key === 'service') service = value;
		else industry = value;
	}
	const current = (key) => (key === 'service' ? service : industry);
</script>

{#if rows.length}
	<div class="post-filters">
		{#each rows as row (row.key)}
			<div class="post-filters__row">
				<span class="footer-label post-filters__label">{row.label}</span>
				<div class="filter-chips" role="group" aria-label="Filter by {row.label.toLowerCase()}">
					<button
						type="button"
						class="filter-chip"
						class:filter-chip--on={!current(row.key)}
						aria-pressed={!current(row.key)}
						onclick={() => pick(row.key, '')}>{allLabel}</button
					>
					{#each row.values as value (value)}
						<button
							type="button"
							class="filter-chip"
							class:filter-chip--on={current(row.key) === value}
							aria-pressed={current(row.key) === value}
							onclick={() => pick(row.key, current(row.key) === value ? '' : value)}>{value}</button
						>
					{/each}
				</div>
			</div>
		{/each}
		<p class="post-filters__count" role="status" aria-live="polite">
			{count}
			{count === 1 ? 'case study' : 'case studies'}
			{#if active}
				<button type="button" class="post-filters__clear" onclick={() => { service = ''; industry = ''; }}>
					Clear filters
				</button>
			{/if}
		</p>
	</div>
{/if}

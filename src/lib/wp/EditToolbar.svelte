<!-- Edit / Save / Cancel, shown only to a logged-in WordPress user.
     Renders nothing at all in the static build. -->
<script>
	import { wpEdit } from './edit.svelte.js';
</script>

{#if wpEdit.isLoggedIn}
	<div class="xo-edit-toolbar" role="toolbar" aria-label="Page editing">
		{#if wpEdit.isEditing}
			<span class="xo-note">
				{#if wpEdit.saving}
					Saving…
				{:else if wpEdit.dirty}
					{wpEdit.count} change{wpEdit.count === 1 ? '' : 's'}
				{:else}
					Click any text or image
				{/if}
			</span>
			<button class="xo-ghost" onclick={() => wpEdit.cancel()} disabled={wpEdit.saving}>
				Cancel
			</button>
			<button class="xo-primary" onclick={() => wpEdit.save()} disabled={wpEdit.saving}>
				Save changes
			</button>
		{:else}
			{#if wpEdit.status === 'saved'}
				<span class="xo-note">Saved</span>
			{:else if wpEdit.status === 'error'}
				<span class="xo-note">Could not save</span>
			{/if}
			<button class="xo-primary" onclick={() => wpEdit.start()}>Edit page</button>
		{/if}
	</div>
{/if}

<style>
	.xo-edit-toolbar {
		position: fixed;
		right: 20px;
		bottom: 20px;
		z-index: 2147483001;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 999px;
		background: #17181b;
		color: #fff;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
		font: 500 13px/1.2 system-ui, sans-serif;
	}
	.xo-edit-toolbar button {
		font: 600 13px/1.2 system-ui, sans-serif;
		padding: 8px 14px;
		border-radius: 999px;
		border: 0;
		cursor: pointer;
	}
	.xo-edit-toolbar button[disabled] {
		opacity: 0.6;
		cursor: default;
	}
	.xo-primary {
		background: #f5c400;
		color: #17181b;
	}
	.xo-ghost {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
	}
	.xo-note {
		opacity: 0.75;
	}
	@media (max-width: 480px) {
		.xo-edit-toolbar {
			right: 12px;
			left: 12px;
			bottom: 12px;
			justify-content: center;
		}
	}
</style>

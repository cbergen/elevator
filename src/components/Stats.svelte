<script lang="ts">
	let { game }: { game: any } = $props();

	function formatElapsedTime(elapsed: number): string {
		const minutes = Math.floor(elapsed / 60);
		const seconds = Math.floor(elapsed % 60);
		const milliseconds = Math.floor((elapsed % 1) * 100);
		return `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
	}
</script>

<dl>
	<div>
		<dt>Elapsed time</dt>
		<dd>{formatElapsedTime(game.elapsedTime)}</dd>
	</div>

	<div>
		<dt>Longest time waiting</dt>
		<dd>{formatElapsedTime(game.longestTimeWaiting)}</dd>
	</div>
</dl>

<style>
	dl > div {
		display: flex;
		font-family: monospace;
	}

	dd {
		text-align: right;
	}
</style>

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
	<dt>Elapsed time</dt>
	<dd>{formatElapsedTime(game.elapsedTime)}</dd>
</dl>

<style>
	dl {
		display: flex;
		font-family: monospace;
	}

	dt {
	}

	dd {
		text-align: right;
	}
</style>

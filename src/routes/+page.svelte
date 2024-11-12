<script lang="ts">
	import { Game } from '$lib/Game.svelte';
	import Building from '$components/Building.svelte';
	import Stats from '$components/Stats.svelte';

	const level_1 = {
		numFloors: 5,
		numElevators: 2
	};

	const game = new Game({ ...level_1 });
</script>

<header>
	<Stats {game} />

	<button on:click={game.start}>Play</button>
	<button on:click={game.pause}>Pause</button>
	<button on:click={game.reset}>Reset</button>
</header>

<main>
	<Building {game}></Building>
</main>

<style>
	header {
		margin-bottom: 2rem;
	}
</style>

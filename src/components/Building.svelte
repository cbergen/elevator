<script lang="ts">
	import Floor from './Floor.svelte';
	import Elevator from './Elevator.svelte';

	let { game }: any = $props();
</script>

<div
	class="building"
	style:--floorHeight={game.floorHeight + 'px'}
	style:--numFloors={game.floors.length}
>
	{#each game.floors as floor, i}
		<Floor {floor} {game}></Floor>
	{/each}

	<div class="elevatorBank" style:--numElevators={game.elevators.length}>
		{#each game.elevators as elevator, i}
			<Elevator {elevator} {game}></Elevator>
		{/each}
	</div>
</div>

<style>
	.building {
		position: relative;
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-start;
		border: 1px solid;
		width: 500px;
		height: calc(var(--floorHeight) * var(--numFloors));
	}

	.elevatorBank {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: grid;
		grid-template-columns: repeat(var(--numElevators), var(--floorHeight));
		gap: 2px;
		margin-inline: auto;
	}
</style>

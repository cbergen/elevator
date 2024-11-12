<script lang="ts">
	let { elevator, game }: any = $props();

	let floorNumber: number = 1 - 1;
	let y: string = -1 * floorNumber * game.floorHeight + 'px';
</script>

<div
	class="shaft"
	style:--numFloors={game.floors.length}
	style:--floorHeight={game.floorHeight + 'px'}
>
	<div class="cab" style:--y={y}>
		{elevator.occupants.length || ''}
	</div>
</div>

<style>
	.shaft {
		height: calc(var(--numFloors) * var(--floorHeight));

		display: flex;
		flex-direction: column-reverse;
	}

	.cab {
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--floorHeight);
		height: var(--floorHeight);
		background-color: rgba(0, 200, 0, 0.5);

		transform: translateY(var(--y));
		transition: all 0.5s linear;
	}
</style>

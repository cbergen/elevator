<script lang="ts">
	let { elevator, game }: any = $props();

	let floor: number = $derived(
		elevator.movement === 'moving' ? elevator.destinationFloor : elevator.floor
	);

	let y: string = $derived(-1 * (floor - 1) * game.floorHeight + 'px');
</script>

<div
	class="shaft"
	style:--numFloors={game.floors.length}
	style:--floorHeight={game.floorHeight + 'px'}
>
	<div class={elevator.movement + ' cab'} style:--y={y}>
		<div class="floorLights">
			{#each Array(game.floors.length) as _, i}
				<span>
					{#if elevator.pressedFloors.has(i + 1)}
						{i + 1}
					{/if}
				</span>
			{/each}
		</div>

		<div class="occupantCount">
			{elevator.occupants.length || ''}
		</div>
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
		flex-direction: column;
		/* justify-content: center; */
		/* align-items: center; */
		width: var(--floorHeight);
		height: var(--floorHeight);
		background-color: rgba(0, 200, 0, 0.5);

		transform: translateY(var(--y));
		transition: transform 0.5s ease-in-out;
	}

	.cab.null,
	.cab.idle {
		background-color: rgba(200, 0, 0, 0.5);
	}

	.cab.moving,
	.cab.paused {
		background-color: rgba(0, 200, 0, 0.5);
	}

	.floorLights {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid white;
	}

	.floorLights span {
		flex: 1;
		padding: 2px;
		font-size: 0.7em;
	}

	.occupantCount {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-block: auto;
	}
</style>

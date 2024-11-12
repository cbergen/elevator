<script lang="ts">
	let { elevator, game }: any = $props();
</script>

<div class="shaft" style:--numFloors={game.floors.length} style:--floorHeight={game.floorHeight}>
	<div class="cab"></div>
</div>

<style>
	.shaft {
		height: calc(var(--numFloors) * var(--floorHeight));

		display: flex;
		flex-direction: column-reverse;
	}

	.cab {
		width: var(--floorHeight);
		height: var(--floorHeight);
		background-color: rgba(0, 200, 0, 0.5);

		transition: all 0.5s linear;
	}
</style>

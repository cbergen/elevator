<script lang="ts">
	let { floor, game }: any = $props();

	const numElevators = game.elevators.length;

	$inspect(floor.meepleCount, floor.number);
</script>

<section
	data-floor={floor.number}
	style:--numElevators={numElevators}
	style:--floorHeight={game.floorHeight + 'px'}
>
	<div class="queue">
		<div class="meeples">
			{floor.meepleCount || ''}
		</div>

		<div class="lights">
			<div class="upLight">
				{#if floor.upIndicator}
					▲
				{/if}
			</div>
			<div class="downLight">
				{#if floor.downIndicator}
					▼
				{/if}
			</div>
		</div>
	</div>

	{#each Array(numElevators) as _, i}
		<div class="elevatorShaft"></div>
	{/each}

	<div class="exit"></div>
</section>

<style>
	section {
		position: relative;
		display: grid;
		grid-template-columns: 1fr repeat(var(--numElevators), var(--floorHeight)) 1fr;
		gap: 2px;
		background-color: rgb(236, 226, 199);
		outline: 1px solid;

		font-family: monospace;
	}

	section::before {
		content: attr(data-floor);
		position: absolute;
		top: 50%;
		left: 10px;
		transform: translateY(-50%);
		font-weight: 700;
		opacity: 0.5;
		background-color: white;
		border-radius: 10px;
		width: calc(var(--floorHeight) / 1.7);
		height: calc(var(--floorHeight) / 1.7);
		text-align: center;
		line-height: calc(var(--floorHeight) / 1.7);
	}

	section > * {
		height: var(--floorHeight);
	}

	.queue {
		display: flex;
	}

	.meeples {
		display: flex;
		margin-inline: auto;
		line-height: var(--floorHeight);
		width: 2rem;
		justify-content: center;
	}

	.lights {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 6px;
	}

	.lights > * {
	}

	div.elevatorShaft {
		display: flex;
		background-color: white;
	}
</style>

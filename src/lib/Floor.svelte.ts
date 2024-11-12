import type { Meeple } from './Meeple.svelte';

export class Floor {
	public number: number = 1;
	public upIndicator: boolean = $state(false);
	public downIndicator: boolean = $state(false);

	private upQueue: Meeple[] = $state([]);
	private downQueue: Meeple[] = $state([]);

	public meepleCount: number = $derived(this.upQueue.length + this.downQueue.length);

	constructor(number: number) {
		this.number = number;
	}

	public addMeeple = (meeple: Meeple): void => {
		// If the meeple's destination is greater than the floor number, the direction is up
		const direction = meeple.destination > this.number ? 'up' : 'down';

		if (direction === 'up') {
			this.upQueue.push(meeple);
		} else {
			this.downQueue.push(meeple);
		}

		// console.log({
		// 	floor: this.number,
		// 	going: `${meeple.destination} (${direction})`
		// });
	};

	public update = (sec: number): void => {
		// Push buttons
		this.pushButtons();
	};

	private pushButtons = (): void => {
		// If there are meeples in the up queue, set the up indicator to true
		if (this.upQueue.length > 0) {
			// Only set the indicator if there is a meeple in "waiting" state
			if (this.upQueue.some((meeple) => meeple.location === 'waiting')) {
				this.upIndicator = true;
			}
		} else {
			this.upIndicator = false;
		}

		// If there are meeples in the down queue, set the down indicator to true
		if (this.downQueue.length > 0) {
			// Only set the indicator if there is a meeple in "waiting" state
			if (this.downQueue.some((meeple) => meeple.location === 'waiting')) {
				this.downIndicator = true;
			}
		} else {
			this.downIndicator = false;
		}
	};

	public reset = (): void => {
		this.upQueue = [];
		this.downQueue = [];
		this.upIndicator = false;
		this.downIndicator = false;
	};
}

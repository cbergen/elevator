import type { Elevator } from './Elevator.svelte';
import type { Meeple } from './Meeple.svelte';

export class Floor {
	public number: number = 1;
	public upIndicator: boolean = $state(false);
	public downIndicator: boolean = $state(false);

	private queue: Meeple[] = $state([]);

	public meepleCount: number = $derived(this.queue.length);

	constructor(number: number) {
		this.number = number;
	}

	public addMeeple = (meeple: Meeple): void => {
		meeple.originFloor = this.number;
		this.queue.push(meeple);

		console.log({
			floor: this.number,
			going: `${meeple.destination} (${meeple.direction})`
		});
	};

	public update = (sec: number): void => {
		// Push buttons
		this.pushButtons();
	};

	private pushButtons = (): void => {
		// If there are meeples in the queue, set the indicators

		// Only set the up indicator if there is a meeple in "waiting" state and it is going up
		if (this.queue.some((meeple) => meeple.location === 'waiting' && meeple.direction === 'up')) {
			this.upIndicator = true;
		} else {
			this.upIndicator = false;
		}

		// Only set the down indicator if there is a meeple in "waiting" state and it is going down
		if (this.queue.some((meeple) => meeple.location === 'waiting' && meeple.direction === 'down')) {
			this.downIndicator = true;
		} else {
			this.downIndicator = false;
		}
	};

	public reset = (): void => {
		this.queue = [];
		this.upIndicator = false;
		this.downIndicator = false;
	};

	public loadElevator = (elevator: Elevator): void => {
		// Attempt to load each person in the queue into the elevator
		this.queue = elevator.load(this.queue);
	};
}

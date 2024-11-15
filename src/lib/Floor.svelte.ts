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

	public maybeLoadElevators = (elevators: Elevator[]): void => {
		elevators.forEach((elevator) => {
			// If the queue is empty, skip
			if (this.queue.length === 0) {
				return;
			}

			// If elevator is moving, skip
			if (elevator.movement === 'moving') {
				return;
			}

			// If elevator is not stopped at this floor, skip
			if (elevator.floor !== this.number) {
				return;
			}

			// Try to load the elevator
			if (elevator.hasCapacity()) {
				this.queue.forEach((meeple) => {
					if (elevator.direction === null || elevator.direction === meeple.direction) {
						elevator.load(meeple);

						// Remove the meeple from the queue
						this.queue = this.queue.filter((m) => m !== meeple);
					}
				});
			}
		});
	};

	public maybeUnloadElevators = (elevators: Elevator[]): void => {
		elevators.forEach((elevator) => {
			// If elevator is empty, skip
			if (elevator.occupants.length === 0) {
				return;
			}

			// If elevator is moving, skip
			if (elevator.movement === 'moving') {
				return;
			}

			// If elevator is not stopped at this floor, skip
			if (elevator.floor !== this.number) {
				return;
			}

			// Try to unload the elevator
			elevator.occupants.forEach((meeple) => {
				if (meeple.destination === this.number) {
					elevator.unload(meeple);
				}
			});
		});
	};
}

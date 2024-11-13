import type { Meeple } from './Meeple.svelte';
import { SvelteSet } from 'svelte/reactivity';

// TODO: use anime.js to animate the elevator

export class Elevator {
	public floor: number = 1;
	public direction: 'up' | 'down' | 'idle' = 'idle';
	public pressedFloors: SvelteSet<number> = $state(new SvelteSet());
	public isMoving: boolean = false;
	public occupants: Meeple[] = $state([]);
	private capacity: number = 5;

	constructor() {}

	public reset = (): void => {
		this.floor = 1;
		this.direction = 'idle';
		this.isMoving = false;
		this.occupants = [];
	};

	public load = (queue: Meeple[]): Meeple[] => {
		// Load as many meeples as possible
		while (this.occupants.length < this.capacity && queue.length > 0) {
			switch (this.direction) {
				case 'idle':
					// The first meeple in the queue enters the elevator
					this.enter(queue.shift() as Meeple);
					break;
				case 'up':
					if (queue[0].direction === 'up') {
						this.enter(queue.shift() as Meeple);
					}
					break;
				case 'down':
					if (queue[0].direction === 'down') {
						this.enter(queue.shift() as Meeple);
					}
					break;
			}
		}

		return queue;
	};

	private enter = (meeple: Meeple): void => {
		// TODO: animate the meeple entering the elevator

		// Set the meeple's location to 'elevator'
		meeple.location = 'elevator';

		// Add the meeple to the occupants array
		this.occupants.push(meeple);

		// Push the button for the meeple's destination floor if floor light isn't already lit
		if (!this.pressedFloors.has(meeple.destination)) {
			this.pushFloorButton(meeple.destination);
		}
	};

	private pushFloorButton = (floor: number): void => {
		this.pressedFloors.add(floor);
	};
}

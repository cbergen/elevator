import type { Meeple } from './Meeple.svelte';
import { SvelteSet } from 'svelte/reactivity';

// TODO: use anime.js to animate the elevator

export class Elevator {
	public floor: number = $state(1);
	public destinationFloor: number | null = null;
	public topFloor: number = 2;
	public movement: 'idle' | 'moving' | 'paused' = $state('idle');
	public direction: 'up' | 'down' | null = $state(null);
	public pressedFloors: SvelteSet<number> = $state(new SvelteSet());
	public occupants: Meeple[] = $state([]);
	public destinationQueue: number[] = $state([]);

	// Constants
	private capacity: number = 5;
	private minPauseTimeSecs = 1;

	// Loop intervals
	private pauseInterval: number = 0;

	private idleEvents: Callback[] = [];

	constructor(opts: { topFloor: number }) {
		this.topFloor = opts.topFloor;
	}

	public reset = (): void => {
		this.floor = 1;
		this.movement = 'idle';
		this.direction = null;
		this.occupants = [];
		this.pressedFloors.clear();
		this.destinationQueue = [];
		this.idleEvents = [];
	};

	public update = (sec: number): void => {
		/**
		 * Movement states:
		 * - idle (stopped at a floor with no destination floors)
		 *      can be interrupted at any time - no internal timer
		 * - paused (waiting for meeples to load/unload)
		 *      has a minimum time before moving again
		 *      timer can be extended if there are a lot of meeples to load/unload
		 * - moving (between floors)
		 *      can be interrupted by a new destination floor.
		 *      if it needs to suddenly switch directions, it will do so immediately without stopping at the nearest floor
		 *      time between floors is constant with a small bit of easing at the start and end
		 *
		 * Events:
		 * - paused
		 *      when elevator stops at a floor
		 * - idle
		 *      when first entering idle state
		 * - moving
		 *      when first entering moving state
		 * - stopped
		 *      when switching away from moving state
		 *
		 * State transitions:
		 * - idle -> moving
		 *      when a destination floor is added to queue
		 *      triggers the 'moving' event
		 * - paused -> moving
		 *      after all loading/unloading is complete and there is somewhere to go
		 *      triggers the 'moving' event
		 * - paused -> idle
		 *      when there are no more destination floors and elevator has finished waiting for meeples
		 *      triggers the 'idle' event
		 * - moving -> paused
		 *      when a destination floor is reached
		 *      triggers the 'stopped' event
		 *      triggers the 'paused' event
		 *
		 * Directions:
		 * - up (when moving or paused)
		 * - down (when moving or paused)
		 * - none (when idle)
		 */

		switch (this.movement) {
			case 'idle':
				console.log({ destQeueu: this.destinationQueue.length });

				// If there are destination floors, transition to the "moving" state
				if (this.destinationQueue.length > 0) {
					this.idle_to_moving();
				}

				break;

			case 'paused':
				this.pauseInterval += sec;

				// If the minimum pause time has not passed, stay in paused state
				if (this.pauseInterval < this.minPauseTimeSecs) {
					break;
				}

				// We've been paused for long enough, so we can move again or go idle
				if (this.destinationQueue.length > 0) {
					this.paused_to_moving();
				} else {
					this.paused_to_idle();
				}

				break;

			case 'moving':
				// Transition to the "paused" state if we've arrived at the destination floor
				if (this.floor === this.destinationFloor) {
					this.moving_to_paused();
				}

				// TODO: calculate the exact elevator position
				break;
		}
	};

	private idle_to_moving = (): void => {
		console.log('idle_to_moving');

		// Get the next destination floor
		const destination = this.destinationQueue.shift() as number;

		// Set the direction
		this.direction = destination > this.floor ? 'up' : 'down';

		// Change the movement state
		this.movement = 'moving';

		// TEMP: immediately set the floor to the destination floor (no animation yet)
		this.floor = destination;
	};

	private paused_to_moving = (): void => {
		console.log('paused_to_moving');

		// Get the next destination floor
		const destination = this.destinationQueue.shift() as number;

		// Set the direction
		this.direction = destination > this.floor ? 'up' : 'down';

		// Change the movement state
		this.movement = 'moving';

		// Reset the paused timer
		this.pauseInterval = 0;
	};

	private paused_to_idle = (): void => {
		console.log('paused_to_idle');

		// Change the movement state
		this.movement = 'idle';

		// Reset the paused timer
		this.pauseInterval = 0;

		// Reset the direction
		this.direction = null;

		// Trigger the 'idle' event
		this.idleEvents.forEach((fn) => fn());
	};

	private moving_to_paused = (): void => {
		console.log('moving_to_paused');

		// Change the movement state
		this.movement = 'paused';

		// Reset destination floor
		this.destinationFloor = null;

		// If we're on the bottom or top floor, turn off the up/down lights
		if (this.floor === 1 || this.floor === this.topFloor) {
			this.direction = null;
		}
	};

	public load = (queue: Meeple[]): Meeple[] => {
		// Load as many meeples as possible
		while (this.occupants.length < this.capacity && queue.length > 0) {
			switch (this.direction) {
				case null:
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

	// Set handlers for all custom elevator events
	public on = (event: string, fn: Callback): void => {
		const allowedEvents = ['idle'];
		if (!allowedEvents.includes(event)) {
			throw new Error(`Invalid event: ${event}`);
		}

		switch (event) {
			case 'idle':
				this.idleEvents.push(fn);
				break;
		}
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

	private goToFloor = (floor: number): void => {
		console.log('Going to floor:', floor);
		this.destinationQueue.push(floor);
	};

	private pushFloorButton = (floor: number): void => {
		this.pressedFloors.add(floor);
	};
}

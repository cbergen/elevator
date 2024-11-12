import { Elevator } from './Elevator.svelte';
import { Floor } from './Floor.svelte';
import { Meeple } from './Meeple.svelte';

function randomIntFromInterval(min: number, max: number): number {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Game {
	// Game stats
	public elapsedTime: number = $state(0);
	public longestTimeWaiting: number = $state(0);

	// Loop variables
	private intervalID: number = 0;
	private ms: number = 125;
	private lastRunTime: number = 0;
	private elapsedSinceSpawn: number = 0;
	private meepleSpawnFrequency: number = 2; // seconds

	// Game objects
	public floors: Floor[] = [];
	public elevators: Elevator[] = [];
	public meeples: Meeple[] = [];

	// Constants
	public floorHeight: number = 50;

	constructor(opts: GameOptions) {
		// Set floors
		for (let i = 1; i <= opts.numFloors; i++) {
			this.floors.push(new Floor(i));
		}

		// Set elevators
		for (let i = 0; i < opts.numElevators; i++) {
			this.elevators.push(new Elevator());
		}

		// More floors, more meeples
		this.meepleSpawnFrequency = 5 / (this.floors.length / 2);
	}

	public start = (): void => {
		if (this.intervalID > 0) return;

		console.log('Game started');
		this.lastRunTime = Date.now();
		this.intervalID = setInterval(this.loop.bind(this), this.ms);
	};

	public pause = (): void => {
		if (this.intervalID === 0) return;

		console.log('Game paused');
		clearInterval(this.intervalID);
		this.intervalID = 0;
	};

	public reset = (): void => {
		console.log('Game reset');
		clearInterval(this.intervalID);
		this.intervalID = 0;
		this.elapsedTime = 0;
		this.longestTimeWaiting = 0;
		this.lastRunTime = 0;
		this.elapsedSinceSpawn = 0;
		this.meeples = [];
		this.floors.forEach((floor) => {
			floor.reset();
		});
		this.elevators.forEach((elevator) => {
			elevator.reset();
		});
	};

	private update = (deltaTime: number): void => {
		this.elapsedTime += deltaTime;
		this.elapsedSinceSpawn += deltaTime;

		// Spawn meeples at specified rate
		if (this.elapsedSinceSpawn >= this.meepleSpawnFrequency) {
			this.spawnMeeple();
			this.elapsedSinceSpawn = 0;
		}

		// Update floor timers
		this.floors.forEach((floor) => {
			floor.update(deltaTime);
		});

		// Update meeple timers
		this.meeples.forEach((meeple) => {
			meeple.update(deltaTime);

			// Get longest waiting time
			if (meeple.waitingTime > this.longestTimeWaiting) {
				this.longestTimeWaiting = meeple.waitingTime;
			}
		});

		// Move meeples into elevators
		// For each elevator stopped at a floor, load meeples
		this.elevators.forEach((elevator) => {
			if (elevator.isMoving) return;

			// Get the floor the elevator is stopped at
			const floor = this.floors.find((f) => f.number === elevator.floor) as Floor;

			floor.loadElevator(elevator);
		});

		// TODO: Move elevators

		// TODO: Move meeples out of elevators
	};

	private render = (): void => {
		// console.log('Elapsed time:', this.elapsedTime);
	};

	private loop = (): void => {
		const currentTime = Date.now();

		// calculate deltaT based on the current time and the last run time
		// we are using Math.max and Math.min to make sure deltaT is between 0 and 1 seconds
		const deltaTime = Math.max(Math.min((currentTime - this.lastRunTime) / 1000, 1), 0);
		this.lastRunTime = currentTime;

		this.update(deltaTime);
		this.render();
	};

	private spawnMeeple = (): void => {
		// High chance of spawning a meeple on the ground floor
		const floor = Math.random() < 0.55 ? 1 : randomIntFromInterval(2, this.floors.length);

		// Destination floor.
		let destination: number;

		// If floor is not bottom floor there's a better chance of going to the first floor
		if (floor > 1 && Math.random() < 0.7) {
			destination = 1;
		} else {
			do {
				destination = randomIntFromInterval(1, this.floors.length);
			} while (destination === floor);
		}

		const meeple = new Meeple(destination);

		// Add meeple to the game's list of meeples
		this.meeples.push(meeple);

		// Add the meeple to the floor's queue
		const floorIndex = this.floors.findIndex((f) => f.number === floor);
		this.floors[floorIndex].addMeeple(meeple);
	};
}

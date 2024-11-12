import { Floor } from './Floor.svelte';
import { Meeple } from './Meeple.svelte';

function randomIntFromInterval(min: number, max: number): number {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Game {
	// Game stats
	public elapsedTime: number = $state(0);

	// Loop variables
	private intervalID: number = 0;
	private ms: number = 125;
	private lastRunTime: number = 0;
	private elapsedSinceSpawn: number = 0;
	private meepleSpawnFrequency: number = 2; // seconds

	// Game objects
	public floors: Floor[] = [];
	public elevators: { number: number }[] = [];
	public meeples: Meeple[] = [];

	// Constants
	public floorHeight: string = '50px';

	constructor(opts: GameOptions) {
		// Set floors
		for (let i = 1; i <= opts.numFloors; i++) {
			this.floors.push(new Floor(i));
		}

		// Set elevators
		for (let i = 0; i < opts.numElevators; i++) {
			this.elevators.push({
				number: i + 1
			});
		}

		this.meepleSpawnFrequency = 5 / (this.floors.length / 2);
	}

	start = (): void => {
		if (this.intervalID > 0) return;

		console.log('Game started');
		this.lastRunTime = Date.now();
		this.intervalID = setInterval(this.loop.bind(this), this.ms);
	};

	pause = (): void => {
		if (this.intervalID === 0) return;

		console.log('Game paused');
		clearInterval(this.intervalID);
		this.intervalID = 0;
	};

	reset = (): void => {
		console.log('Game reset');
		clearInterval(this.intervalID);
		this.intervalID = 0;
		this.elapsedTime = 0;
		this.lastRunTime = 0;
		this.elapsedSinceSpawn = 0;
		this.meeples = [];
		this.floors.forEach((floor) => {
			floor.reset();
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

		// Push buttons on floors
		this.floors.forEach((floor) => {
			floor.pushButtons();
		});

		// Update meeple timers
		this.meeples.forEach((meeple) => {
			meeple.update(deltaTime);
		});

		// Move elevators

		// Move meeples into elevators

		// Move meeples out of elevators
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
		const floor = Math.random() < 0.5 ? 1 : randomIntFromInterval(2, this.floors.length);

		// Destination floor.
		let destination: number;

		// If floor is not bottom floor there's a better chance of going to the first floor
		if (floor > 1 && Math.random() < 0.5) {
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

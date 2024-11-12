// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface GameOptions {
		numFloors: number;
		numElevators: number;
	}

	interface Floor {
		number: number;
		upIndicator: boolean;
		downIndicator: boolean;
		meeplesUpQueue: [];
		meeplesDownQueue: [];
	}
}

export {};

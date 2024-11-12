export class Meeple {
	public destination: number = 1;
	public originFloor: number = 1;
	public direction = $derived(this.destination > this.originFloor ? 'up' : 'down');
	public location: 'floor' | 'waiting' | 'elevator' | 'exiting' | 'gone' = 'floor';

	// Timers
	private elapsedSinceSpawn: number = 0;
	private elapsedSinceExited: number = 0;
	public waitingTime: number = 0;

	constructor(destination: number) {
		this.destination = destination;
	}

	public update = (sec: number): void => {
		switch (this.location) {
			case 'floor':
				// console.log('Meeple is on the floor');
				this.elapsedSinceSpawn += sec;

				if (this.elapsedSinceSpawn > 0.5) {
					this.location = 'waiting';
				}

				break;

			case 'waiting':
				// console.log('Meeple is waiting');
				this.waitingTime += sec;
				break;

			case 'elevator':
				// console.log('Meeple is in the elevator');
				break;

			case 'exiting':
				// console.log('Meeple is exiting');
				this.elapsedSinceExited += sec;

				if (this.elapsedSinceExited > 3) {
					this.location = 'gone';
				}

				break;

			case 'gone':
				// console.log('Meeple is gone');
				break;
		}
	};
}

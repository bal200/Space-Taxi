import { Person } from './person';
import { SpaceTaxiGame } from './app';

export interface Slot {
	p: Person,
	text?: Phaser.GameObjects.Text,
}

export class Dashboard extends Phaser.Scene {
	info :Phaser.GameObjects.Text;
	game: SpaceTaxiGame;
	slots: Slot[] = [];

	constructor( config ) {
		super(config);
	}
	init() {
		const h = this.cameras.main.height;
		const w = this.cameras.main.width;
		this.info = this.add.text(10, h - 25, 'Text', { font: '24px Arial Bold', fill: '#FBFBAC' });
		this.info.setScrollFactor(0);

	}
	preload(): void {}
	create(): void {}

	public pickUp( p: Person ) {
		//this.info.destroy();
		let slotNo = this.getFreeSlot();
		let slot:Slot = this.slots[slotNo] = {p:p};
		const w = this.cameras.main.width;
		const h = this.cameras.main.height;
		const x = w - (210 * (slotNo+1));
		slot.text = this.add.text(x, h - 25, 'Passenger '+p.id+' to pad '+p.toPad, 
			{ font: '24px Arial Bold', fill: '#FBFBAC' });
		slot.text.setScrollFactor(0);

	}

	public alight( person: Person ) {
		let slotNo = this.findSlot(person)
		let slot = this.slots[slotNo]
		slot.text.destroy();
		this.slots[slotNo] = null;
	}
	public kickOut( person: Person ) {
		let slotNo = this.findSlot(person)
		this.slots[slotNo].text.destroy();
		this.slots[slotNo] = null;
	}

	private getFreeSlot() {
		for (let n=0; n<5; n++) {
			if ( ! this.slots[n] ) return n;
		}
	}
	private findSlot(p:Person) {
		//let slot = (this.slots as any).find( slot => slot.p.id == p.id );
		//return slot
		for (let n=0; n<5; n++) {
			const slot = this.slots[n]
			if ( slot && slot.p.id == p.id ) return n;
		}
	}
	
	shutdown() {}


}






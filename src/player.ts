import { DoorData } from './levels';


export class Player extends Phaser.Physics.Matter.Sprite { //Phaser.GameObjects.Sprite {
	myType :string;
	doors: DoorData[];

	constructor(scene:Phaser.Scene, x,y, shape, doors?:DoorData[]) {
		super(scene.matter.world, x, y, "taxi", null, {shape: shape});
		//this.setScale(0.20);

		this.myType='player';
		this.setFriction(0.003); //(0.006);
		this.setFrictionAir(0.025);
		this.setBounce(0.800);
		this.doors = doors;

		scene.add.existing(this);
	}
	update() {
		this.checkForDoors()
	}

	checkForDoors() {
			let pos = this.getCenter()
			this.doors.forEach(door => {
				//door.
			});
	}

}

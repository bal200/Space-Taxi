import { DoorData } from './levels';
import { Door } from './door';
import { GameScene } from './gameScene';

export class Player extends Phaser.Physics.Matter.Sprite {
	myType :string;
	doors: DoorData[];

	constructor(scene:GameScene, x,y, shape, doors?:DoorData[]) {
		//let a : Phaser.Types.Physics.Matter.MatterSetBodyConfig ={};
		//a.type = 'fromPhysicsEditor';
		super(scene.matter.world, x, y, "taxi", null, {shape: shape});
		//this.setScale(0.20);

		this.myType='player';
		this.setFriction(0.003); //(0.006);
		this.setFrictionAir(0.025);
		this.setBounce(0.800);
		this.doors = doors;
		this.setCollisionCategory(scene.colCategoryShip);
		this.setCollidesWith([scene.colCategoryLand, scene.colCategoryShip])

		scene.add.existing(this);
		// this.setOnCollideActive(()=>{
		// 	console.log("players on colide active");
		// });
		scene.events.on('update', (time, delta) => { this.update(time, delta)} );
	}
	update(time, delta) {
		//this.checkForDoors()
		this.stabilisers()
	}

	stabilisers() {
		let angle = this.angle;
		let target = 0;
		let change = (target-angle) ;
		// console.log(angle.toFixed(0),change.toFixed(1));
		if (change > +2)
			this.applyForceFrom(new Phaser.Math.Vector2(0,0), new Phaser.Math.Vector2(0,-0.000005) );
		
		if (change < -2)
			this.applyForceFrom(new Phaser.Math.Vector2(0,0), new Phaser.Math.Vector2(0,+0.000005) );
	}

	checkForDoors( doors:Door[]) {
			let pos = this.getCenter()
			this.doors.forEach(door => {
				//door.
			});
	}
	//player.setVelocity(0);
	th = 0.0015;
	goLeft() {
		//console.log("left");
		this.thrustBack(this.th * 0.5);
		//player.applyForceFrom(new Phaser.Math.Vector2(-80.0, 0), new Phaser.Math.Vector2(0,-0.0001) );
		//player.setAngularVelocity(-0.02);
	}
	goRight() {
		//console.log("right");
		this.thrust(this.th * 0.5);
		//player.applyForceFrom(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(0,-0.0001) );
		//player.setAngularVelocity(+0.02);
	}
	goUp() {
		//console.log("up");
		this.thrustLeft(this.th);
	}
	goDown() {
		//console.log("down");
		this.thrustRight(this.th * 0.5);
	}

}

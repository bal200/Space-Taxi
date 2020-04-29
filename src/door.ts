import { GameScene } from "./gameScene";

export interface DoorMapData {
	type: string;
	name: string;
	x: number; y: number; width: number; height: number;
	visible: boolean;
	properties: any;
	/* padId, face, toDoor, toScreen */
}

export class Door /*extends Phaser.Physics.Matter.Sprite*/ {
	myType :string;
	doorId : number;
	face : string;
	toDoor : number;
	toScreen : number;
	x:number; y:number; width:number; height:number;

	constructor(scene:GameScene, doorMapData:DoorMapData, padData?:any) {
		this.x = (doorMapData ? doorMapData.x : padData.pos.x)
		this.y = (doorMapData ? doorMapData.y : padData.pos.y)
		this.width = doorMapData.width;
		this.height = doorMapData.height;

		//super( scene.matter.world, x,y, 'landing_pad', null, 
		//		{shape: scene.shapes.landing_pad, isStatic:true} );

		if (doorMapData) {
			this.doorId = parseInt(doorMapData.properties.find( prop => prop.name == 'doorId' ).value);
			this.face = doorMapData.properties.find( prop => prop.name == 'face' ).value;
			this.toDoor = parseInt(doorMapData.properties.find( prop => prop.name == 'toDoor' ).value);
			this.toScreen = parseInt(doorMapData.properties.find( prop => prop.name == 'toScreen' ).value);
			
		}
			
		//this.setPosition(padData.x /*+ pad.centerOfMass.x*/, y /*+ pad.centerOfMass.y*/);
		this.myType = 'door';
		scene.doors.push(this);

		//scene.add.existing(this);
	}

	checkIfDoor(x,y) {
		
	}

}


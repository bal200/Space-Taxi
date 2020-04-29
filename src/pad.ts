import { PadData } from './levels';
import { GameScene } from "./gameScene";

export interface PadMapData {
	type: string;
	name: string;
	x: number; y: number;
	visible: boolean;
	properties: any;
	/* padId: number; */
}

export class Pad extends Phaser.Physics.Matter.Sprite {
	myType :string;
	padId : number;

	constructor(scene:GameScene, padTilemap:PadMapData, padData?:PadData) {
		let x = (padTilemap ? padTilemap.x : padData.pos.x)
		let y = (padTilemap ? padTilemap.y : padData.pos.y)

		super( scene.matter.world, x,y, 'landing_pad', null, 
				{shape: scene.shapes.landing_pad, isStatic:true} );

		if (padTilemap) {
			this.padId = parseInt(padTilemap.properties.find( prop => prop.name == 'padId' ).value);
		}else
			this.padId = padData.id
		//this.setPosition(padData.x /*+ pad.centerOfMass.x*/, y /*+ pad.centerOfMass.y*/);
		this.myType = 'pad';
		scene.pads.push(this);

		scene.add.existing(this);
	}

}


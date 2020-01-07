import { GameScene } from "./gameScene";


export class Pad extends Phaser.Physics.Matter.Sprite {
	myType :string;
	padId : number;

	constructor(scene:GameScene, padData:any ) {
		super( scene.matter.world, padData.x, padData.y, 'landing_pad', null, 
				{shape: scene.shapes.landing_pad, isStatic:true} );

		this.padId = parseInt(padData.properties.find( prop => prop.name == 'padId' ).value);
		//this.setPosition(padData.x /*+ pad.centerOfMass.x*/, y /*+ pad.centerOfMass.y*/);
		this.myType = 'pad';
		scene.pads.push(this);

		scene.add.existing(this);
	}
}


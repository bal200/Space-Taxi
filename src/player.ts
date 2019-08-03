

export class Player extends Phaser.Physics.Matter.Sprite { //Phaser.GameObjects.Sprite {
	myType :string;

	constructor(scene:Phaser.Scene, x,y, shape) {
		super(scene.matter.world, x, y, "hotdog", null, {shape: shape});
		this.setScale(0.20);

		this.myType='player';

		scene.add.existing(this);
	}

}

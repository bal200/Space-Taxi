
export class Parallax extends Phaser.GameObjects.TileSprite {
	myType :string;
	factor: number;
	
	//this.add.image(0, 0, 'sheet', 'background').setOrigin(0, 0);
	// background = mygame.add.tileSprite(0, 0, this.game.width, this.game.height, "background");

	constructor(scene:Phaser.Scene, x,y, image:string, factor:number = 0.2) {
		super(scene, x, y, 800,600, image);

		this.myType='background';
		this.factor = factor;
		this.setOrigin(0, 0);
		scene.add.existing(this);
	}

	preUpdate() {
		this.x = this.scene.cameras.main.scrollX * this.factor;
		this.y = this.scene.cameras.main.scrollY * this.factor;
	}


}

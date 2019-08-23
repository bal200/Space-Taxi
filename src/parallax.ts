
export class Parallax extends Phaser.Tilemaps.StaticTilemapLayer {
	myType :string;
	factor: number;
	pos :Phaser.Math.Vector2;

	//this.add.image(0, 0, 'sheet', 'background').setOrigin(0, 0);
	// background = mygame.add.tileSprite(0, 0, this.game.width, this.game.height, "background");

	constructor(scene:Phaser.Scene, map:Phaser.Tilemaps.Tilemap, 
					tileset:Phaser.Tilemaps.Tileset, layerName:string, 
					factor:number = 0.2, pos = new Phaser.Math.Vector2(0,0)) {
		// let map = scene.add.tilemap('map');
		//var tiles = map.addTilesetImage('ground_1x1');
		//var layer = map.createStaticLayer('Tile Layer', tiles);
  
		super(scene, map, map.getLayerIndex(layerName), tileset, pos.x, pos.y);  //, pos.x, pos.y);
		this.setScale(1.5);
		//this = map.createStaticLayer(layerName, tileset,0,0);
/*'Tile Layer'*/
		this.myType='background';
		this.factor = factor;
		this.pos = pos;
		this.setOrigin(0, 0);
		scene.add.existing(this);
	}

	preUpdate() {
		this.x = this.pos.x + this.scene.cameras.main.scrollX * this.factor;
		this.y = this.pos.y + this.scene.cameras.main.scrollY * this.factor;
	}


}

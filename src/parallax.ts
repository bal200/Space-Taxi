
export class Parallax extends Phaser.Tilemaps.StaticTilemapLayer {
	myType :string;
	scrollFactor: number;
	pos :Phaser.Math.Vector2;

	//this.add.image(0, 0, 'sheet', 'background').setOrigin(0, 0);
	// background = mygame.add.tileSprite(0, 0, this.game.width, this.game.height, "background");

	constructor(scene:Phaser.Scene, map:Phaser.Tilemaps.Tilemap, 
					tileset:Phaser.Tilemaps.Tileset, layerName:string, 
					factor:number = 0.2, pos = new Phaser.Math.Vector2(0,0)) {
		// let map = scene.add.tilemap('map');
		//var tiles = map.addTilesetImage('ground_1x1');
		//var layer = map.createStaticLayer('Tile Layer', tiles);
		const layerData = map.getLayer(layerName);

		super(scene, map, map.getLayerIndex(layerName), tileset, layerData.x, layerData.y);  //, pos.x, pos.y);

		this.scrollFactor = (layerData.properties as any).find( prop => prop.name == 'scrollFactor' ).value;
		this.setScale( (layerData.properties as any).find( prop => prop.name == 'scale' ).value );
		this.myType='background';
		this.pos = new Phaser.Math.Vector2(layerData.x,layerData.y);
		this.setOrigin(0, 0);
		scene.add.existing(this);
	}

	preUpdate() {
		this.x = this.pos.x + this.scene.cameras.main.scrollX * this.scrollFactor;
		this.y = this.pos.y + this.scene.cameras.main.scrollY * this.scrollFactor;
	}


}

import { SpaceTaxiGame } from './app';
import { Scene } from 'phaser';

import { Player } from "./player";
import { LandImage, LandTilemap } from "./land";
import { Parallax } from "./parallax";

import {levels, LevelData, ScreenData} from "./levels";
import { Dashboard } from "./dashboard";
import { Pad, PadMapData } from './pad';
import { Door, DoorMapData } from './door';

export type Params = {
	levelNum?:number,
	screenNum?:number,
	p?:Player,
	door?:number,
}

export class GameScene extends Scene {
	info: Phaser.GameObjects.Text;
	dashboard: Dashboard;

	background :Parallax;
	land: LandImage | LandTilemap;
	pads: Pad[] =[];
	doors: Door[] = [];
	player: Player; 

	cursors :Phaser.Types.Input.Keyboard.CursorKeys;
	shapes: any;

	levelNum: number = 0;
	level: LevelData;
	screenNum: number = 0;
	screen: ScreenData;

	game: SpaceTaxiGame;

	//constructor() { super() }

	init( params:Params ): void {
		console.log("init ", params.screenNum);
		this.levelNum = params.levelNum;
		this.screenNum = params.screenNum;
		this.level = levels[params.levelNum];
		this.screen = this.level.screen[params.screenNum];

		this.events.on('wake', this.wake);
		this.events.on('resume', this.resume);
	}
	wake(sys,params:Params) {
		console.log("wake",params);
		const p = params.p;
		this.player.angle = p.angle;

	}
	resume(sys,params:Params) {
		console.log("resume",params);
	}

	preload(): void {
		console.log("preload ", this.screenNum);
		this.load.image("star", "assets/star.png");
		this.load.image("grid", "assets/grid.png");
		this.load.image("block", "assets/block.png");
		this.load.image("taxi", "assets/yellow taxi 60px.png");
		this.load.image("level1", "assets/level1.png");
		this.load.image("landing_pad", "assets/landing_pad.png");
		
		this.load.json('shapes', 'assets/shapes.json');

		this.load.tilemapTiledJSON('tilemap', "assets/tilemap.json");
		this.load.image("cave_tileset", "assets/cave_tileset.png");
	}
	
	create(): void {
		console.log("create ",this.screenNum);
		let map = this.add.tilemap('tilemap');
		let tileset = map.addTilesetImage('cave_tileset');
		let objects = map.getObjectLayer(this.screen.objectLayer);

		/***** PARALLAX BACKGROUNDS ******/
		this.screen.background.forEach( (data) => {
			new Parallax(this, map, tileset, data.image, data.factor, data.pos);
		});
		/***** LAND *****/
		this.shapes = this.cache.json.get('shapes');
		if (this.screen.land.type=='image') {
			this.land = new LandImage(this,0,0, this.screen.land.image, this.shapes[this.screen.land.shape]);
		}else{
			this.land = new LandTilemap(this, map, tileset, this.screen.land.layer);
		}

		this.cameras.main.setBounds(0, 0, this.land.width, this.land.height );
		//this.matter.world.setBounds(0, 0, this.screen.width, this.screen.height);

		/****** PADS ******/
		if (this.screen.land.type=='image') {
			this.screen.pads.forEach( padData => {const a = new Pad(this,null, padData);});
		}else{
			let padsData = map.filterObjects(objects, obj => obj.type === 'pad') as unknown as PadMapData[];
			// as PadMapData[];
			padsData.forEach( d => { new Pad(this, d) });
		}

		/****** DOORS ******/
		let doorsData = map.filterObjects(objects, obj => obj.type === 'door') as unknown as DoorMapData[];
		doorsData.forEach( d => { new Door(this, d) });
console.log("Doors: ", this.doors);

		/***** SHIP *******/
		const shipStart:any = map.findObject(objects, obj => obj.name === "shipStart");
		this.player = new Player(this, shipStart.x,shipStart.y, this.shapes.taxi);

		//this.matter.world.createDebugGraphic();

		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			this.game.progress.passengers.landedCheck( bodyA.gameObject as Pad );
		});
		this.matter.world.on('collisionend', (event, bodyA, bodyB) => {
			this.game.progress.passengers.collisionEnd( bodyA.gameObject as Pad );
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.input.keyboard.on('keyup_ONE', () => {
			this.scene.sleep();
			this.scene.run('L2_S0' );
		}, this);
		this.input.keyboard.on('keyup_TWO', () => {
			this.scene.sleep();
			this.scene.run('L2_S1' );
		}, this);
		

		this.input.keyboard.on('keyup_Z', () => {
			console.log( "ship xy: (" +this.player.x.toFixed(0)+ "," +this.player.y.toFixed(0)+ ")" )
	  });

	  this.cameras.main.startFollow(this.player, false, 0.1);

	}

	update(time: number): void {

		this.keyboardMovements( this.player )
		this.stabilisers( this.player )
  
		this.doorCheck( this.player )
	}

	doorCheck( p:Player ) {
		p.x
		this.doors.forEach( d => {
			if (p.x > d.x  &&  p.x < d.x+d.width &&
				 p.y > d.y  &&  p.y < d.y+d.height) {
					console.log("In door ", d.doorId);
					this.jumpToScene(d.toScreen, d.toDoor)
			}
		})
	}
	jumpToScene(screenNum:number, door:number) {
		this.scene.sleep();
		this.scene.run('L'+this.levelNum+'_S'+screenNum, {
			p: this.player,
			door: door,
		} as Params );

		/* @TODO: */
	}

	keyboardMovements( player :Phaser.Physics.Matter.Sprite ) {
		//player.setVelocity(0);
		const th = 0.0015;
		if (this.cursors.left.isDown) {
			player.thrustBack(th * 0.5);
			//player.applyForceFrom(new Phaser.Math.Vector2(-80.0, 0), new Phaser.Math.Vector2(0,-0.0001) );
			//player.setAngularVelocity(-0.02);
			
		}
		else if (this.cursors.right.isDown) {
			player.thrust(th * 0.5);
			//player.applyForceFrom(new Phaser.Math.Vector2(0, 0), new Phaser.Math.Vector2(0,-0.0001) );
			//player.setAngularVelocity(+0.02);
		}
		if (this.cursors.up.isDown) {
			player.thrustLeft(th);
		}
		else if (this.cursors.down.isDown) {
			player.thrustRight(th * 0.5);
		}
	}

	stabilisers(player :Phaser.Physics.Matter.Sprite ) {
		let angle = player.angle;
		let target = 0;
		let change = (target-angle) ;
		// console.log(angle.toFixed(0),change.toFixed(1));
		if (change > +2)
			player.applyForceFrom(new Phaser.Math.Vector2(0,0), new Phaser.Math.Vector2(0,-0.000005) );
		
		if (change < -2)
			player.applyForceFrom(new Phaser.Math.Vector2(0,0), new Phaser.Math.Vector2(0,+0.000005) );
	}



	// landingPad(id:number, x:number, y:number) {
	// 	let pad = this.matter.add.sprite(x, y, 'landing_pad', null, {shape: this.shapes.landing_pad});
	// 	pad.setPosition(x /*+ pad.centerOfMass.x*/, y /*+ pad.centerOfMass.y*/);
	// 	(pad as any).padId = id;
	// 	(pad as any).myType='pad';
	// 	this.pads.push(pad);
	// }

	shutdown() {
		this.input.keyboard.shutdown();
	}

};


		//let touching = new Touching('player');
		// const pads = map.filterObjects(objects, obj => obj.type === 'pad') as any;
		// pads.forEach( (pad) => {
		// 	const padId = pad.properties.find( prop => prop.name == 'padId' ).value;
		// 	this.landingPad(padId, pad.x, pad.y);
		// });


		// this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
		// 	//if (bodyA) console.log("Force A "+bodyA.force.x+","+bodyA.force.y);
		// 	//if (bodyB) console.log("Force B "+bodyB.force.x+","+bodyB.force.y);
		// 	//console.log("collisionSTART "+log(event.pairs[0].bodyA) +' '+ log(event.pairs[0].bodyB));
			
		// 	this.game.progress.passengers.landedCheck( bodyA.gameObject as Pad );

		// 	function log(a:any) {
		// 		if (a.gameObject & a.gameObject.myType) 
		// 			return ''+a.gameObject.myType+' ' + (a.gameObject.padId?a.gameObject.padId:'');
		// 		//if (a.gameObject && a.gameObject.body && a.gameObject.body.label ) {
		// 		//	return (a.gameObject.body.label+' '+(a.gameObject.padId?a.gameObject.padId:''));
		// 		//}
		// 	}
		// });

		// let sand =this.matter.add.image(200, 250, 'sand', null, { restitution: 0.4, isStatic: true });
		
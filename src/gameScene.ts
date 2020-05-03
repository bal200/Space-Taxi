import { SpaceTaxiGame } from './app';
import { Scene } from 'phaser';

import { Player } from "./player";
import { LandImage, LandTilemap } from "./land";
import { Parallax } from "./parallax";

import {levels, LevelData, ScreenData} from "./levels";
import { Pad, PadMapData } from './pad';
import { Door, DoorMapData } from './door';

export type Params = {
	levelNum?:number,
	screenNum?:number,
	p?:Player,
	door?:number,
}

export class GameScene extends Scene {
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
	colCategoryLand: any; colCategoryShip: any; colCategoryPeople: any;

	//constructor() { super() }

	init( params:Params ): void {
		console.log("init ", params.screenNum);
		this.levelNum = params.levelNum;
		this.screenNum = params.screenNum;
		this.level = levels[params.levelNum];
		this.screen = this.level.screen[params.screenNum];

		this.events.on('wake', this.wake.bind(this));
		this.events.on('resume', this.resume.bind(this));
		this.events.on('pause', this.pause.bind(this));

		if (params.p) this.setPlayerInMotion(params.p, params.door);
	}
	wake(sys,params:Params) {
		console.log("wake",params);
		if (params.p) this.setPlayerInMotion(params.p, params.door);
	}
	resume(sys,params:Params) {
		console.log("resume",params);
	}
	setPlayerInMotion(p:Player, doorNum:number) {
		if (!this.player) return;
		const b = p.body as any; //Phaser.Physics.Matter.Body;
//console.log("angle ", p.angle); console.log("velocity x", b.velocity.x ); console.log("velocity angular", b.angularVelocity);

		this.player.setRotation( p.rotation );
		this.player.setVelocity( b.velocity.x, b.velocity.y );
		this.player.setAngularVelocity(b.angularVelocity);
		if (doorNum != undefined) {
			const d = this.doors.find(d => d.doorId==doorNum);
			switch (d.face){
				case 'right': this.player.x = d.x+d.width+1; this.player.y = d.y+(d.height/2); break;
				case 'left':  this.player.x = d.x-1; this.player.y = d.y+(d.height/2); break;
			}
		}
	}

	preload(): void {
		console.log("preload ", this.screenNum);
		this.load.spritesheet('person', 'assets/student_spritesheet_16x28.png', { frameWidth: 16, frameHeight: 28 });
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

		this.colCategoryLand = 0x0001;
		this.colCategoryShip = this.matter.world.nextCategory();
		this.colCategoryPeople = this.matter.world.nextCategory();

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

		/***** SHIP *******/
		const shipStart:any = map.findObject(objects, obj => obj.name === "shipStart");
		this.player = new Player(this, shipStart.x,shipStart.y, this.shapes.taxi);

		this.matter.world.createDebugGraphic();

		/******** COLISION DETECTION *****/
		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			this.game.progress.passengers.collisionStart( this, bodyA.gameObject as Pad, bodyB.gameObject as Pad );
			
		});
		this.matter.world.on('collisionend', (event, bodyA, bodyB) => {
			this.game.progress.passengers.collisionEnd( this, bodyA.gameObject as Pad );
		});

		this.game.anims.create({
			key: 'walk_left', frameRate: 8, repeat: -1,
			frames: this.game.anims.generateFrameNumbers('person', { start: 0, end: 7 }),
		});
		this.game.anims.create({
			key: 'walk_right', frameRate: 8, repeat: -1,
			frames: this.game.anims.generateFrameNumbers('person', { start: 16, end: 23, first: 16 }),
		});
		this.game.anims.create({
			key: 'standing', frameRate: 2, repeat: -1,
			frames: this.game.anims.generateFrameNumbers('person', { frames: [8,8,8,9,8,9,8,8,8,8,10] }),
		});
		this.game.anims.create({
			key: 'falling_left', frameRate: 2, repeat: -1,
			frames: this.game.anims.generateFrameNumbers('person', { frames: [10] }),
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.input.keyboard.on('keyup_ONE', () => {
			this.jumpToScene(0, undefined)
		}, this);
		this.input.keyboard.on('keyup_TWO', () => {
			this.jumpToScene(1, undefined)
		}, this);
		

		this.input.keyboard.on('keyup_K', () => {
			console.log( "ship xy: (" +this.player.x.toFixed(0)+ "," +this.player.y.toFixed(0)+ ")" )
			this.game.progress.passengers.kickOut(this, this.player);
		});

		this.cameras.main.startFollow(this.player, false, 0.1);

	}

	update(time: number): void {

		this.keyboardMovements( this.player )

		this.doorCheck( this.player )
	}

	doorCheck( p:Player ) {
		this.doors.forEach( d => {
			if (p.x > d.x  &&  p.x < d.x+d.width &&
				 p.y > d.y  &&  p.y < d.y+d.height) {
					this.jumpToScene(d.toScreen, d.toDoor)
			}
		})
	}
	jumpToScene(screenNum:number, door:number) {
		this.scene.sleep();
		this.scene.run('L'+this.levelNum+'_S'+screenNum, {
			levelNum: this.levelNum,
			screenNum,
			p: this.player,
			door,
		} as Params );

		/* @TODO: */
	}

	keyboardMovements( player: Player ) {
		if (this.cursors.left.isDown)  player.goLeft();
		else if (this.cursors.right.isDown)  player.goRight();
		if (this.cursors.up.isDown)  player.goUp();
		else if (this.cursors.down.isDown)  player.goDown();
	}



	// landingPad(id:number, x:number, y:number) {
	// 	let pad = this.matter.add.sprite(x, y, 'landing_pad', null, {shape: this.shapes.landing_pad});
	// 	pad.setPosition(x /*+ pad.centerOfMass.x*/, y /*+ pad.centerOfMass.y*/);
	// 	(pad as any).padId = id;
	// 	(pad as any).myType='pad';
	// 	this.pads.push(pad);
	// }
	pause() {
		console.log("pause");
	}
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
		
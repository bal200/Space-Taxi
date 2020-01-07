import "phaser";
import { PassengerManager } from './passengermanager';
import { Scene } from 'phaser';

import { Player } from "./player";
import { LandImage, LandTilemap } from "./land";
import { Parallax } from "./parallax";

import {level1, LevelData, ScreenData} from "./levels";
import { Dashboard } from "./dashboard";
import { Pad } from './pad';

export class GameScene extends Scene {
	// sand: Phaser.Physics.Arcade.StaticGroup;
	info: Phaser.GameObjects.Text;
	dashboard: Dashboard;
	passengers: PassengerManager;

	background :Parallax;
	land: LandImage | LandTilemap;
	pads :Pad[] =[];
	player :Phaser.Physics.Matter.Sprite; 

	cursors :Phaser.Types.Input.Keyboard.CursorKeys;
	shapes: any;

	level: LevelData;
	// screenNum: number = 0;
	screen: ScreenData;

	constructor() {
		super({ key: "GameScene" });
	}

	init( params: {level:LevelData, screen:ScreenData} ): void {
		this.level = params.level;
		this.screen = params.screen; // level.screens[this.screenNum];
	}

	preload(): void {
		this.load.image("star", "assets/star.png");
		this.load.image("grid", "assets/grid.png");
		this.load.image("block", "assets/block.png");
		this.load.image("hotdog", "assets/hotdog.png");
		this.load.image("level1", "assets/level1.png");
		this.load.image("landing_pad", "assets/landing_pad.png");
		
		this.load.json('shapes', 'assets/shapes.json');

		this.load.tilemapTiledJSON('tilemap', "assets/tilemap.json");
		this.load.image("cave_tileset", "assets/cave_tileset.png");
	}
	
	create(): void {
		let map = this.add.tilemap('tilemap');
		let tileset = map.addTilesetImage('cave_tileset');
		let objects = map.getObjectLayer(this.level.objectLayer);

		this.screen.background.forEach( (data) => {
			new Parallax(this, map, tileset, data.image, data.factor, data.pos);
		});

		this.shapes = this.cache.json.get('shapes');
		if (this.screen.land.type=='image') {
			this.land = new LandImage(this,0,0, this.screen.land.image, this.shapes[this.screen.land.shape]);
		}else{
			this.land = new LandTilemap(this, map, tileset, this.screen.land.layer);
		}

		this.cameras.main.setBounds(0, 0, this.land.width, this.land.height );
		//this.matter.world.setBounds(0, 0, this.screen.width, this.screen.height);

		//let touching = new Touching('player');
		// const pads = map.filterObjects(objects, obj => obj.type === 'pad') as any;
		// pads.forEach( (pad) => {
		// 	const padId = pad.properties.find( prop => prop.name == 'padId' ).value;
		// 	this.landingPad(padId, pad.x, pad.y);
		// });

		const padsData = map.filterObjects(objects, obj => obj.type === 'pad') as any;
		padsData.forEach( padData => {
			const a = new Pad(this, padData);
		});

		// let sand =this.matter.add.image(200, 250, 'sand', null, { restitution: 0.4, isStatic: true });
		
		const shipStart:any = map.findObject(objects, obj => obj.name === "shipStart");
		this.player = new Player(this, shipStart.x,shipStart.y, this.shapes.hotdog);
		this.player.setFriction(0.006);
		this.player.setFrictionAir(0.040);
		this.player.setBounce(0.800);

		// this.matter.world.createDebugGraphic();

		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			//if (bodyA) console.log("Force A "+bodyA.force.x+","+bodyA.force.y);
			//if (bodyB) console.log("Force B "+bodyB.force.x+","+bodyB.force.y);
			//console.log("collisionSTART "+log(event.pairs[0].bodyA) +' '+ log(event.pairs[0].bodyB));
			
			this.passengers.landedCheck( bodyA.gameObject as Pad );

			function log(a:any) {
				if (a.gameObject & a.gameObject.myType) 
					return ''+a.gameObject.myType+' ' + (a.gameObject.padId?a.gameObject.padId:'');
				//if (a.gameObject && a.gameObject.body && a.gameObject.body.label ) {
				//	return (a.gameObject.body.label+' '+(a.gameObject.padId?a.gameObject.padId:''));
				//}
			}
		});
		this.matter.world.on('collisionend', function (event, bodyA, bodyB) {
			//console.log("collisionEnd "+log(event.pairs[0].bodyA) +' '+ log(event.pairs[0].bodyB));

			function log(a:any) {
				return ''+a.gameObject.myType+' ' + (a.gameObject.padId?a.gameObject.padId:'');
			}
		});

		//this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
		this.dashboard = new Dashboard(this);
		this.passengers = new PassengerManager(this, this.dashboard, this.level.passengers, this.pads);

		this.cursors = this.input.keyboard.createCursorKeys();
		this.input.keyboard.once('keyup_ONE', function () {
			this.scene.start('GameScene', { level: level1, screen: level1.screen[1] });
		}, this);
		this.input.keyboard.on('keyup_Z', () => {
			console.log( "ship xy: (" +this.player.x.toFixed(0)+ "," +this.player.y.toFixed(0)+ ")" )
	  });

	}

	update(time: number): void {
		this.cameras.main.startFollow(this.player, false, 0.01)

		this.keyboardMovements( this.player )
		this.stabilisers( this.player )
  
	}

	keyboardMovements( player :Phaser.Physics.Matter.Sprite ) {
		//player.setVelocity(0);
		const th = 0.0006;
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
		console.log(angle.toFixed(0),change.toFixed(1));
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

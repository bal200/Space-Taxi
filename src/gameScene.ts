import "phaser";
import { Scene } from 'phaser';

import { Player } from "./player";
import { Land } from "./land";
import { Parallax } from "./parallax";

import {level1, LevelData, ScreenData} from "./levels";

export class GameScene extends Scene {
	// sand: Phaser.Physics.Arcade.StaticGroup;
	info: Phaser.GameObjects.Text;

	background :Parallax;
	land: Land;
	pads :Phaser.Physics.Matter.Image[] =[];
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
		this.load.image("level1", "assets/level2.png");
		this.load.image("landing_pad", "assets/landing_pad.png");
		
		this.load.json('shapes', 'assets/sprites.json');
	}
	
	create(): void {
		this.matter.world.setBounds(0, 0, this.screen.width, this.screen.height);
		this.cameras.main.setBounds(0, 0, this.screen.width, this.screen.height /*3200, 600*/);

		this.shapes = this.cache.json.get('shapes');

		this.screen.background.forEach( (data) => {
			new Parallax(this, 0,0, data.image);
		});

		this.land = new Land(this,0,0, this.screen.land.image, this.shapes[this.screen.land.shape]);

		//let touching = new Touching('player');
		
		this.screen.pads.forEach( (pad) => {
			this.landingPad(pad.id, pad.pos.x, pad.pos.y);
		});

		// let sand =this.matter.add.image(200, 250, 'sand', null, { restitution: 0.4, isStatic: true });

		this.player = new Player(this, this.level.shipStart.x,this.level.shipStart.y, this.shapes.hotdog);
		this.player.setFriction(0.006);
		this.player.setFrictionAir(0.040);
		this.player.setBounce(0.800);

		this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
			//if (bodyA) console.log("Force A "+bodyA.force.x+","+bodyA.force.y);
			//if (bodyB) console.log("Force B "+bodyB.force.x+","+bodyB.force.y);
			console.log("collisionSTART "+log(event.pairs[0].bodyA) +' '+ log(event.pairs[0].bodyB));
			// if (bodyA & bodyA.gameObject) bodyA.gameObject.setTint(0xff0000);
			// if (bodyB & bodyB.gameObject) bodyB.gameObject.setTint(0x00ff00);
			function log(a:any) {
				if (a.gameObject & a.gameObject.myType) 
				console.log(a.gameObject.myType);

					return ''+a.gameObject.myType+' ' + (a.gameObject.padId?a.gameObject.padId:'');
				//if (a.gameObject && a.gameObject.body && a.gameObject.body.label ) {
				//	return (a.gameObject.body.label+' '+(a.gameObject.padId?a.gameObject.padId:''));
				//}
			}
		});
		this.matter.world.on('collisionend', function (event, bodyA, bodyB) {
			console.log("collisionEnd "+log(event.pairs[0].bodyA) +' '+ log(event.pairs[0].bodyB));

			function log(a:any) {
				return ''+a.gameObject.myType+' ' + (a.gameObject.padId?a.gameObject.padId:'');
			}
		});

		this.info = this.add.text(10, 10, '', { font: '24px Arial Bold', fill: '#FBFBAC' });
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update(time: number): void {
		this.cameras.main.startFollow(this.player, true, 0.0001,0.0001, 0,0);

		this.keyboardMovements( this.player );
		// this.stabilisers( this.player );
  
		this.info.text = "Info here";
	}

	keyboardMovements( player :Phaser.Physics.Matter.Sprite ) {
		//player.setVelocity(0);
		const th = 0.0006;
		if (this.cursors.left.isDown) {
			//player.thrustBack(th);
			//player.applyForceFrom(new Phaser.Math.Vector2(+200,0), new Phaser.Math.Vector2(0,-0.0001) );
			player.setAngularVelocity(-0.02);
		}
		else if (this.cursors.right.isDown) {
			//player.thrust(th);
			//player.applyForceFrom(new Phaser.Math.Vector2(-200,0), new Phaser.Math.Vector2(0,-0.0001) );
			player.setAngularVelocity(+0.02);
		}
		if (this.cursors.up.isDown) {
			player.thrustLeft(th);
		}
		else if (this.cursors.down.isDown) {
			player.thrustRight(th);
		}
	}
	stabilisers(player :Phaser.Physics.Matter.Sprite ) {
		let angle = player.angle;
		let target = 0;
		let change = (target-angle) ;
		console.log(angle.toFixed(1),change.toFixed(1));
		//if (Math.abs(change) < 0.1) change=0;
		if (change > +0.5)
			player.setAngularVelocity(-change* 0.01);
		//	p.applyForceFrom(new Phaser.Math.Vector2(+20,0), new Phaser.Math.Vector2(0,-0.0001) );
		
		if (change < -0.5)
			player.setAngularVelocity(+change* 0.01);
		//	p.applyForceFrom(new Phaser.Math.Vector2(-20,0), new Phaser.Math.Vector2(0,-0.0001) );


		//p.setAngularVelocity( change );
	}

	landingPad(id:number, x:number, y:number) {
		let pad = this.matter.add.sprite(x, y, 'landing_pad', null, {shape: this.shapes.landing_pad});
		pad.setPosition(x + pad.centerOfMass.x, y + pad.centerOfMass.y);
		(pad as any).padId = id;
		(pad as any).myType='pad';
		this.pads.push(pad);
	}

	shutdown() {
		this.input.keyboard.shutdown();
	}

};

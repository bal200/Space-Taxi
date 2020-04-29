//import "phaser";
import { Scene } from 'phaser';

import { GameScene } from "./gameScene";
import { SpaceTaxiGame, Progress } from "./app";


export class MenuScene extends Scene {
	game: SpaceTaxiGame;

	constructor() {
		super({ key: "MenuScene" });
	}

	init(): void {
	}

	preload(): void {
		this.load.image("star", "assets/star.png");
	}
	
	create(): void {
		this.add.text(10, 10, 'Press A, B or C to Start', { font: '16px Courier', fill: '#00ff00' });
		const scenes = this.game.scenes;

		this.input.keyboard.once('keyup_A', () => {
			this.game.progress = {};
			scenes.push( this.scene.add("L0_S0", GameScene, false) as GameScene );
			this.scene.start('L0_S0', {
				level: 0, screen: 0,
			});
		}, this);

		this.input.keyboard.once('keyup_B', () => {
			this.game.progress = {};
			scenes.push( this.scene.add("L1_S0", GameScene ,false) as GameScene );
			this.scene.start('L1_S0', {
				levelNum: 1, screenNum: 0,
			});
		}, this);

		this.input.keyboard.once('keyup_C', () => {
			this.game.startNewGame( /*level*/ 2 );

		}, this);

		this.events.on('shutdown', this.shutdown, this);

	}

	update(time: number): void {}

	shutdown() {
		this.input.keyboard.shutdown();
	}

};

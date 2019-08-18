import "phaser";
import { Scene } from 'phaser';

import { GameScene } from "./gameScene";
import {level1, LevelData, ScreenData} from "./levels";


export class MenuScene extends Scene {

	constructor() {
		super({ key: "MenuScene" });
	}

	init(): void {
		//this.level = params.level;
		//this.screen = params.screen; // level.screens[this.screenNum];
	}

	preload(): void {
		this.load.image("star", "assets/star.png");
	}
	
	create(): void {

		this.add.text(10, 10, 'Press 1 to Start', { font: '16px Courier', fill: '#00ff00' });
		this.input.keyboard.once('keyup_ONE', function () {
			this.scene.start('GameScene', { level: level1, screen: level1.screen[0] });
		}, this);

		this.input.keyboard.once('keyup_TWO', function () {
			this.scene.start('GameScene', { level: level1, screen: level1.screen[1] });
		}, this);


		this.events.on('shutdown', this.shutdown, this);

	}

	update(time: number): void {}

	shutdown() {
		this.input.keyboard.shutdown();
	}

};

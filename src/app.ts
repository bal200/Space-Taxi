import { GameScene } from "./gameScene";
import { MenuScene } from "./menuScene";
import { PassengerManager } from "./passengermanager";
import { Dashboard } from "./dashboard";
import { levels } from "./levels";

const config: Phaser.Types.Core.GameConfig = {
	title: "Space Taxi",
	width: 800,
	height: 600,
	parent: "game",
	scene: [MenuScene],
	//@ts-ignore
	pixelArt: true,
	zoom: 1.0,
	physics: {
		default: "matter",
		matter: {
			gravity: { y: 0.5 },
			debug: false
		}
	}
	// backgroundColor: "#10102D"
};

export type Progress = {
	dashboard?: Dashboard,
	passengers?: PassengerManager,
}

export class SpaceTaxiGame extends Phaser.Game {
	progress: Progress = {};
	scenes: GameScene[] = [];
	
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}

	startNewGame(levelNum:number) {
		let progress:Progress = this.progress = {};
		let level = levels[levelNum];
		this.scenes.push( this.scene.add("L2_S0", GameScene ,false, {levelNum: 2, screenNum: 0}) as GameScene );
		this.scenes.push( this.scene.add("L2_S1", GameScene ,false, {levelNum: 2, screenNum: 1}) as GameScene );
		
		progress.dashboard = new Dashboard(this);
		this.scene.add("dashboard", progress.dashboard ,true, {}) as GameScene; 
		
		progress.passengers = new PassengerManager(this, progress.dashboard, level.passengers);
		// progress.passengers.watchPads(this.pads);

		this.scene.start('L2_S0'); //, {
			//levelNum: levelNum, screenNum: level.shipStartScreen,
		//});
	}

}

window.onload = () => {
	var game = new SpaceTaxiGame(config);
};

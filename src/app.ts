import "phaser";
import { GameScene } from "./gameScene";

const config: Phaser.Types.Core.GameConfig = {
	title: "Space Taxi",
	width: 800,
	height: 600,
	parent: "game",
	scene: [GameScene],
	physics: {
		default: "matter",
		matter: {
			gravity: { y: 0.5 },
			debug: false
		}
	},
	backgroundColor: "#10102D"
};

export class SpaceTaxiGame extends Phaser.Game {
	
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}

}

window.onload = () => {
	var game = new SpaceTaxiGame(config);
};

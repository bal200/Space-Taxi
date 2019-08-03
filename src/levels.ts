import "phaser";
const Vec2 = Phaser.Math.Vector2;

export interface LevelData {
	id: number;
	screens: ScreenData[];
	shipStart: Phaser.Math.Vector2;
	shipStartScreen: number;
}
export interface ScreenData {
	id: number;
	width: number;
	height: number;
	shipStart: Phaser.Math.Vector2;
	land: { image:string, shape:string },
	background: any[];
	pads: PadData[];
	doors?: DoorData[];
}

export interface PadData {
	id: number;
	pos: Phaser.Math.Vector2
}
export interface DoorData {
	id: number;
	pos: Phaser.Math.Vector2;
	toScreen: number;
	toDoor: number;
}

export const level1:LevelData = {
	id: 1,
	screens: [
		{
			id: 1,
			width: 800,
			height: 600,
			shipStart: new Vec2(530, 100),
			land: { image: 'level1', shape: 'level1'},
			background: [
				{image: 'grid', factor: 0.2}
			],
			pads: [
				{id:1, pos: new Vec2(664, 254)},
				{id:2, pos: new Vec2(107, 83) },
				{id:3, pos: new Vec2(282, 453) },
			]
		}
	],
	shipStart: new Vec2(530, 100),
	shipStartScreen: 1
}

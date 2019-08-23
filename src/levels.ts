import "phaser";
const Vec2 = Phaser.Math.Vector2;

export interface LevelData {
	id: number;
	screen: ScreenData[];
	shipStart: Phaser.Math.Vector2;
	shipStartScreen: number;
}
export interface ScreenData {
	id: number;
	width: number;
	height: number;
	land: any; //{ image:string, shape:string },
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
	face: number; /* 1=left, 2=right */
}

export const level1:LevelData = {
	id: 1,
	screen: [
		{
			id: 1,
			width: 800,
			height: 600,
			land: { type:'image', image: 'level1', shape: 'level1'},
			background: [
				{image: 'Tile Layer 2', factor: 0.3, pos: new Vec2(0, 50)},
				{image: 'Tile Layer 1', factor: 0.15, pos: new Vec2(0, 0)}
			],
			pads: [
				{id:1, pos: new Vec2(664, 254)},
				{id:2, pos: new Vec2(107, 83) },
				{id:3, pos: new Vec2(282, 453) },
			],
			doors: [
				{id:1, pos: new Vec2(700, 80), toScreen:2, toDoor:1, face:1}
			]
		},{
			id: 2,
			width: 1600,
			height: 1600,
			land: {type: 'tilemap', image: 'L1_S1_fore'},
			background: [
				/*{image: 'grid', factor: 0.2}*/
				{image: 'L1_S1_background', factor: 0.3, pos: new Vec2(0, 50)},
				{image: 'L1_S1_midground', factor: 0.15, pos: new Vec2(0, 0)}

			],
			pads: [
				{id:1, pos: new Vec2(664, 254)},
				{id:2, pos: new Vec2(107, 83) },
				{id:3, pos: new Vec2(282, 453) },
			],
			doors: [
				{id:1, pos: new Vec2(100, 80), toScreen:1, toDoor:1, face:2}
			]
		}
	],
	shipStart: new Vec2(430, 130),
	shipStartScreen: 1
}

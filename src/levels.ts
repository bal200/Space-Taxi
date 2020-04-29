const Vec2 = Phaser.Math.Vector2;
const Rect = Phaser.Geom.Rectangle;

export interface LevelData {
	id: number;
	screen: ScreenData[];
	shipStart?: Phaser.Math.Vector2;
	shipStartScreen: number;
	passengers: PersonData[];
}
export interface ScreenData {
	id: number;
	width?: number;
	height?: number;
	land: any; //{ image:string, shape:string },
	background: any[];
	objectLayer: string;
	pads: PadData[];
	doors?: DoorData[];
}

export interface PadData {
	id: number;
	pos: Phaser.Math.Vector2
}
export interface DoorData {
	id: number;
	pos: Phaser.Geom.Rectangle; // Phaser.Math.Vector2;
	toScreen: number;
	toDoor: number;
	face: number; /* 1=left, 2=right */
}

export interface PersonData {
	id: number,
	time: number,  /* time they'll appear */
	person: number,  /* person type */
	fromPad: number,
	toPad: number
}

export const levels : LevelData[] = [
	{
		/* Level 0 (A) */
		id: 0,
		screen: [
			{
				id: 0,
				//width: 800,
				//height: 600,
				land: { type:'image', image: 'level1', shape: 'level1'},
				background: [
					// {type:'image', image: 'grid', factor: 0.3, pos: new Vec2(0, 0)}
				],
				pads: [
					{id:1, pos: new Vec2(664, 254)},
					{id:2, pos: new Vec2(107, 83) },
					{id:3, pos: new Vec2(282, 453) },
				],
				objectLayer: 'L1_S1_Objects',
				doors: []
			}
		],
		shipStart: new Vec2(530, 250),
		shipStartScreen: 0,
		passengers: [
			{id: 1, time:1, person:1, fromPad: 1, toPad:2},
			{id: 2, time:16, person:1, fromPad: 1, toPad:3},
			{id: 3, time:30, person:1, fromPad: 2, toPad:1}
		]
	},{
		/* Level 1 (B) */
		id: 1,
		screen: [
			{
				id: 0,
				//width: 1600*1.5,
				//height: 1600*1.5,
				land: {type: 'tilemap', layer: 'L1_S1_fore'},
				background: [
					/*{image: 'grid', factor: 0.2}*/
					/* depthFactor: 0=stuck to land(nearer foreground), 1=stuck to camera(more distant) */
					{image: 'L1_S1_background', factor: 0.4, pos: new Vec2(0, 50)},
					{image: 'L1_S1_midground', factor: 0.28, pos: new Vec2(0, 50)}

				],
				objectLayer: 'L1_S1_Objects',
				pads: [
					{id:1, pos: new Vec2(175, 739)},
					{id:2, pos: new Vec2(925, 380) },
					{id:3, pos: new Vec2(1880, 2156) },
				],
				doors: [],
			}
		],
		shipStart: new Vec2(530, 250),
		shipStartScreen: 0,
		passengers: [
			{id: 1, time:1, person:1, fromPad: 1, toPad:2},
			{id: 2, time:16, person:1, fromPad: 1, toPad:3},
			{id: 3, time:30, person:1, fromPad: 2, toPad:1}
		]
	},{
		/* Level 2 (C) */
		id: 2,
		screen: [
			{
				id: 0,
				land: { type:'tilemap', layer: 'L2_S0_fore'},
				background: [
					{image: 'L1_S1_background', /*factor: 0.4, pos: new Vec2(0, 80)*/},
					{image: 'L1_S1_midground', /*factor: 0.28, pos: new Vec2(0, 80)*/}
				],
				objectLayer: 'L2_S0_Objects',
				pads: [],
				doors: [
					// {id:1, pos: new Rect(700, 80, 1,1), toScreen:2, toDoor:2, face:1}
				]
			},{
				id: 1,
				land: {type: 'tilemap', layer: 'L2_S1_fore'},
				background: [
					{image: 'L1_S1_background', /*factor: 0.4, pos: new Vec2(0, 50)*/},
					{image: 'L1_S1_midground', /*factor: 0.28, pos: new Vec2(0, 50)*/}
				],
				objectLayer: 'L2_S1_Objects',
				pads: [],
				doors: [
					// {id:2, pos: new Rect(100, 80, 1,1), toScreen:1, toDoor:1, face:2}
				],
			}
		],
		shipStart: new Vec2(530, 250),
		shipStartScreen: 0,
		passengers: [
			{id: 1, time:1,  person:1, fromPad: 1, toPad:2},
			{id: 2, time:16, person:1, fromPad: 2, toPad:1},
			{id: 3, time:30, person:1, fromPad: 3, toPad:1}
		]
	}
]

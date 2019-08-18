

export class LandImage extends Phaser.Physics.Matter.Sprite {
	myType :string;

	constructor(scene:Phaser.Scene, x:number,y:number, image:string, shape) {
		super(scene.matter.world, x, y, image, null, {shape: shape, isStatic:true});

		this.setPosition(x + this.centerOfMass.x, y + this.centerOfMass.y);
		this.myType='land';

		scene.add.existing(this);
	}

}

export class LandTilemap extends Phaser.Tilemaps.StaticTilemapLayer {
	myType :string;

	//constructor(scene:Phaser.Scene, x:number,y:number, image:string, shape) {
		//super(scene, x, y, image, null, {shape: shape, isStatic:true});

		//this.setPosition(x + this.centerOfMass.x, y + this.centerOfMass.y);
		//this.myType='land';

		//scene.add.existing(this);
	//}

}


export interface Touch {
	obj1: string;
	obj2: string;
	count: number;
}

// export class Touching {

// 	touches :Touch[];
// 	primaryObj: string;

// 	constructor(primaryObj:string) {
// 		this.primaryObj = primaryObj;
// 		this.touches = [];
// 	}

// 	touching() {
// 		let ret:[];
// 		this.touches.forEach(element => {
			
// 		});
// 	}

// 	colisionStart(event, bodyA, bodyB) {
// 			console.log("collisionSTART "+log(event.pairs[0].bodyA) +' '+ log(event.pairs[0].bodyB));
			
// 			let a = event.pairs[0].bodyA.gameObject.myType;
// 			let b = event.pairs[0].bodyB.gameObject.myType;

// 			function log(a:any) {
// 				return ''+a.gameObject.myType+' ' + (a.gameObject.padId?a.gameObject.padId:'');
// 			}
// 	}

// 	findTouch( a:string, b:string)  {
// 		return this.touches.find( t => {
// 			return (( t.obj1 == a && t.obj2 == b)
// 				  || ( t.obj1 == b && t.obj2 == a))
// 		});
// 	}

// }
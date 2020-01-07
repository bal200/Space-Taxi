import { PersonData } from './levels';
import { Pad } from './pad';
import { GameScene } from './gameScene';


export class Person {
	data: PersonData;
	sprite: Phaser.GameObjects.Sprite;
	status?: 'waiting'|'onboard'|'arrived';
	onPad: Pad;

	constructor( myScene:GameScene, data:PersonData ) {
		this.data = data;
		// @ts-ignore
		this.onPad = myScene.pads.find( (p:Pad) => p.padId == data.fromPad );

		this.sprite = myScene.add.sprite( this.onPad.x-20, this.onPad.y-15, 'star')
		this.sprite.setScale(0.1)

	}
	get fromPad() { return this.data.fromPad }
	get toPad() { return this.data.toPad }
	get id() { return this.data.id }

	public appear() {
		this.status = 'waiting';
		console.log('person '+this.data.id+' appeared at '+this.onPad.padId)
		/* animate them appearing? */
	}

	public pickUp() {
		this.status = 'onboard'
		this.onPad = null;
		this.sprite.active = false;
		this.sprite.setX(-1000)
		console.log('person '+this.data.id+' picked up')
	}

	public alight( pad:Pad) {
		this.status = 'arrived'
		this.onPad = pad;
		console.log('person '+this.data.id+' arrived at '+pad.padId)

		this.sprite.active = true;
		this.sprite.setPosition(pad.x-20, pad.y-15);

		setTimeout( ()=>{
			this.sprite.active = false;
			this.sprite.setX(-1000)
		},1000)
	}


}






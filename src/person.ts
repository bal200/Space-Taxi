import { PersonData } from './levels';
import { Pad } from './pad';
import { GameScene } from './gameScene';
import { Player } from './player';


export class Person {
	data: PersonData;
	scene: GameScene;
	sprite: Phaser.Physics.Matter.Sprite;
	status?: 'waiting'|'onboard'|'loose'|'arrived';
	onPad: Pad;

	constructor( data:PersonData ) {
		this.data = data;
		//this.scene = scene;
	}
	get fromPad() { return this.data.fromPad }
	get toPad() { return this.data.toPad }
	get id() { return this.data.id }

	public appear( scene:GameScene ) {
		this.scene = scene
		this.onPad = scene.pads.find( p => p.padId == this.data.fromPad );
		this.status = 'waiting';
		this.makeSprite( this.onPad.x-20, this.onPad.y-15)
		console.log('person '+this.data.id+' appeared at pad '+this.onPad.padId)
		/* animate them appearing? */
		this.sprite.anims.play('standing')
	}

	public pickUp() {
		this.status = 'onboard'
		this.onPad = undefined;
		this.sprite.destroy()
		this.sprite = undefined
		this.scene = undefined
		console.log('person '+this.data.id+' picked up')
	}
	public kickOut( scene:GameScene, player:Player) {
		this.status = 'loose'
		this.scene = scene;
		this.makeSprite( player.x, player.y+10)
		const b = player.body as any;
		this.sprite.setVelocity( b.velocity.x, b.velocity.y );
		this.sprite.anims.play('falling_left')
	}
	public alight(scene:GameScene, pad:Pad) {
		this.status = 'arrived'
		this.onPad = pad;
		console.log('person '+this.data.id+' arrived at '+pad.padId)
		this.scene = scene;
		this.makeSprite( pad.x-20, pad.y-15)
		this.sprite.anims.play('walk_left')

		setTimeout( ()=>{
			this.sprite.destroy()
		},4000)
	}

	private makeSprite(x,y) {
		this.sprite = this.scene.matter.add.sprite(x, y, 'person',0);
		(this.sprite as any).myType="person";
		//this.sprite.setCircle(20,{});
		//this.sprite.setFriction(0.003)
		//this.sprite.setFrictionAir(0.025)
		this.sprite.setBounce(0.800);
		this.sprite.setCollisionCategory(this.scene.colCategoryPeople);
		this.sprite.setCollidesWith([this.scene.colCategoryLand, this.scene.colCategoryPeople])
	}


}






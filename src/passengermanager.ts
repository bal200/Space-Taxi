import { SpaceTaxiGame } from './app';
import { Person } from './person';
import { Dashboard } from './dashboard';
import { PersonData } from './levels';
import { Pad } from './pad';
import { GameScene } from './gameScene';
import { Player } from './player';

export class PassengerManager {
	game: SpaceTaxiGame;
	myTime: number =0;
	timer: number;
	data: PersonData[];
	people: Person[] = [];
	//pads: Pad[];
	dashboard: Dashboard;

	constructor(game:SpaceTaxiGame, dashboard:Dashboard, data:PersonData[]) {
		this.game = game;
		this.data = data;
		//this.pads = pads;
		this.dashboard = dashboard;
		
		// game.time.addEvent({ 
		// 	delay: 1000, 
		// 	loop: true,
		// 	callbackScope: this, 
		// 	callback: () => {
		this.timer = setInterval(()=>{
				this.myTime++;
				//console.log("now "+scene.time.now.toFixed(0)+" myTime "+this.myTime);

				data.forEach( pdata => {
					if (pdata.time == this.myTime) {
						let scene=this.findPadsScene(pdata.fromPad);
						const p = new Person( pdata );
						this.people.push( p );
						p.appear(scene);
					}
				})
		}, 1000);
		//	}
		//})
	}
	public kickOut( scene:GameScene, player:Player) {
		this.people.forEach(p => {
			if (p.status=='onboard') {
				p.kickOut(scene, player);
				this.dashboard.kickOut( p )
			}
		});
	}

	/* find the gameScene that a Pad number is on */
	findPadsScene( padNum: number ) : GameScene {
		return (this.game.scenes as any).find( (scene:GameScene) => {
			let pad = (scene.pads as any).find( (p:Pad) => p.padId == padNum );
			return pad ? true : false;
		});
	}

	/* Called by collision detection. Checks if we landed and picked up anyone */
	public collisionStart( scene:GameScene, obj:Pad, obj2:Pad ) {
		if (!obj || !obj2) return;

		if ((obj.myType=='pad' && obj2.myType=='player') 
		 || (obj.myType=='player' && obj2.myType=='pad')) {
			console.log("player on a Pad");
			this.people.forEach(p => {
				if (p.status == 'waiting') {
					if (p.onPad.padId == obj.padId) {
						p.pickUp()
						this.dashboard.pickUp( p )
					}
				}else if (p.status == 'onboard') {
					if (p.toPad == obj.padId) {
						p.alight( scene, obj )
						this.dashboard.alight( p )
					}
				}
			})
		}
		if ((obj.myType=='person' && obj2.myType=='player') 
		 || (obj.myType=='player' && obj2.myType=='person')) {
			console.log("player touching a person");
		}
	}

	public collisionEnd(scene:GameScene, obj:Pad) {

	}
	

}






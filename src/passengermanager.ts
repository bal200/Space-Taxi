import { SpaceTaxiGame } from './app';
import { Person } from './person';
import { Dashboard } from './dashboard';
import { PersonData } from './levels';
import { Pad } from './pad';
import { GameScene } from './gameScene';

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
console.log("making person (pdata):",pdata);
console.log("scene:", scene);

						const p = new Person( scene, pdata );
						this.people.push( p );
						p.appear();
					}
				})
		}, 1000);
		//	}
		//})
	}
	/* find the gameScene that a Pad number is on */
	findPadsScene( padNum: number ) : GameScene {
		return (this.game.scenes as any).find( (scene:GameScene) => {
			let pad = (scene.pads as any).find( (p:Pad) => p.padId == padNum );
			return pad ? true : false;
		});
	}

	public watchPads( pads:Pad[] ) {
		//this.pads = pads;
	}

	/* Called by collision detection. Checks if we landed and picked up anyone */
	public landedCheck( obj:Pad ) {
		if (obj && obj.myType == 'pad') {

			this.people.forEach(p => {
				if (p.status == 'waiting') {
					if (p.onPad.padId == obj.padId) {
						p.pickUp()
						this.dashboard.pickUp( p )
					}
				}else if (p.status == 'onboard') {
					if (p.toPad == obj.padId) {
						p.alight( obj )
						this.dashboard.alight( p )
					}
				}

			})
		}
	}

	public collisionEnd(obj:Pad) {
		
	}
	

}






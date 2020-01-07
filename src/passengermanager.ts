import { Person } from './person';
import { Dashboard } from './dashboard';
import { PersonData } from './levels';
import { Pad } from './pad';
import { GameScene } from './gameScene';

export class PassengerManager {
	myTime: number =0;
	data: any[];
	people: Person[] = [];
	pads: Pad[];
	dashboard: Dashboard;

	constructor(scene:GameScene, dashboard:Dashboard, data:PersonData[], pads:Pad[]) {
		this.data = data;
		this.pads = pads;
		this.dashboard = dashboard;
		scene.time.addEvent({ 
			delay: 1000, 
			loop: true,
			callbackScope: this, 
			callback: () => {
				this.myTime++;
				//console.log("now "+scene.time.now.toFixed(0)+" myTime "+this.myTime);

				data.forEach( pdata => {
					if (pdata.time == this.myTime) {
						const p = new Person( scene, pdata );
						this.people.push( p );
						p.appear();
					}
				})
			}
		})
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
	

}






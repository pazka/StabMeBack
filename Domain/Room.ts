import TimeStamped from "./TimeStamped";
import Player from "./Player";
import GameAction from "./GameAction";
import {send} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";

export default class Room extends TimeStamped{
    Id : string
    Players: Player[] = []
    History: GameAction [] = []
    Size : 20
    maxPlayers : 8
    Password: string = ""
    APDropNb : number = 1
    LastAPDropDate : number
    private APDropInterval : number // in minutes
    __APDropTrigger : any
    
    constructor(id:string) {
        super("room_"+id);
    }
    
    increaseHistory(gameAction : GameAction){
        gameAction.Id = this.History.length
        this.History.push(gameAction)

        send(internal_events.OBJECT_IS_ACTIVE, gameAction.Caster?.Id)
        send(internal_events.OBJECT_IS_ACTIVE, gameAction.Receiver?.Id)
        send(internal_events.OBJECT_IS_ACTIVE, this.Id)
    }

    getDropInterval(){
        return this.APDropInterval
    }
    
    setDropInterval(newAPDropInterval : number){
        this.APDropInterval = newAPDropInterval
        if(this.__APDropTrigger)
            clearInterval(this.__APDropTrigger)

        this.__APDropTrigger = setInterval(()=>{
            send(internal_events.ROOM_AP_DROP,{room : this})
        },this.APDropInterval * 60 * 1000)
    }
    
    isInBounds(pos : number[]){
        return !(pos[0] < 0 || pos[0] >= this.Size || pos[1] < 0 || pos[1] >= this.Size)
    }
}
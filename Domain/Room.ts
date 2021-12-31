import TimeStamped from "./TimeStamped";
import Player from "./Player";
import GameAction from "./GameAction";
import {send} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";

const allApDropTriggers : any= {}

export default class Room extends TimeStamped{
    Id : string
    Players: Player[] = []
    History: GameAction [] = []
    Size : number = 20
    MaxPlayers : number =  8
    Password: string = ""
    APDropAmount : number = 1
    LastAPDropDate : number
    StartAP : number
    StartHP : number
    StartRange : number
    private APDropInterval : number // in minutes
    
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

    public get DropInterval(){
        return this.APDropInterval
    }
    
    public set DropInterval(newAPDropInterval : number){
        this.APDropInterval = newAPDropInterval
        if(allApDropTriggers[this.Id])
            clearInterval(allApDropTriggers[this.Id])

        if(!newAPDropInterval)
            return

        allApDropTriggers[this.Id] = setInterval(()=>{
            send(internal_events.ROOM_AP_DROP,{room : this})
        },this.APDropInterval * 60 * 1000)
    }
    
    isInBounds(pos : number[]){
        return !(pos[0] < 0 || pos[0] >= this.Size || pos[1] < 0 || pos[1] >= this.Size)
    }
}
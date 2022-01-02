import TimeStamped from "./TimeStamped";
import Player from "./Player";
import GameAction from "./GameAction";
import {send} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";

const allApDropTriggers: any = {}

class HistoryItem {
    Id: number
    Date: number = Date.now()
    data = ""

    constructor(Id: number, data: any) {
        this.Id = Id
        this.data = data
    }
}

export default class Room extends TimeStamped {
    Id: string
    Name : string
    Players: Player[] = []
    History: HistoryItem [] = []
    Size: number = 20
    MaxPlayers: number = 8
    Password: string = ""
    APDropAmount: number = 1
    LastAPDropDate: number
    StartAP: number
    StartHP: number
    StartRange: number
    Creator : Player
    
    private APDropInterval: number // in minutes

    constructor(id: string,name : string) {
        super("room_" + id);
        this.Name = name
    }

    increaseHistoryRaw(data: any) {
        this.History.push(new HistoryItem(this.History.length, data))
    }

    increaseHistory(gameAction: GameAction) {
        this.increaseHistoryRaw(gameAction)

        send(internal_events.OBJECT_IS_ACTIVE, gameAction.Caster?.Id)
        send(internal_events.OBJECT_IS_ACTIVE, gameAction.Receiver?.Id)
        send(internal_events.OBJECT_IS_ACTIVE, this.Id)
    }

    public get DropInterval() {
        return this.APDropInterval
    }

    public set DropInterval(newAPDropInterval: number) {
        this.APDropInterval = newAPDropInterval
        if (allApDropTriggers[this.Id])
            clearInterval(allApDropTriggers[this.Id])

        if (!newAPDropInterval)
            return

        allApDropTriggers[this.Id] = setInterval(() => {
            send(internal_events.ROOM_AP_DROP, {room: this})
        }, this.APDropInterval * 60 * 1000)
    }

    isInBounds(pos: number[]) {
        return !(pos[0] < 0 || pos[0] >= this.Size || pos[1] < 0 || pos[1] >= this.Size)
    }
    
    toShallow() : ShallowRoom{
        return {
            Id: this.Id,
            Name : this.Name,
            NbPlayers: this.Players.length,
            MaxPlayers: this.MaxPlayers,
            DateCreated: this.DateCreated,
            PasswordProtected : this.Password != ""
        }
    }        
    
}

interface ShallowRoom{
    Id: string
    Name : string
    NbPlayers: number
    MaxPlayers: number
    DateCreated: number
    PasswordProtected : boolean
}
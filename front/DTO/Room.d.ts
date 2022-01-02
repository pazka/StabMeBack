import {Player} from "./Player";
import {TimeStamped} from "./TimeStamped";

export interface Room extends TimeStamped{
    Name : string
    Players: Player[] 
    History: HistoryItem [] 
    Size: number
    MaxPlayers: number
    Password:string
    APDropAmount: number
    LastAPDropDate: number
    StartAP: number
    StartHP: number
    StartRange: number
    Creator : Player
}

export interface ShallowRoom{
    Id: string
    Name : string
    NbPlayers: number
    MaxPlayers: number
    DateCreated: number
    PasswordProtected : boolean
}

export interface HistoryItem {
    Id: number
    Date: number
    /* json string */
    data : string
}
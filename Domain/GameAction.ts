import Player from "./Player";

export enum GameActionType {
    GIVE_AP = "GIVE_AP",
    SHOOT = "SHOOT",
    MOVE = "MOVE",
    UPGRADE = "UPGRADE",
    HEAL = "HEAL",
    WIN = "WIN"
}

export default class GameAction{
    Caster : Player
    Receiver : Player
    Type : GameActionType
    Params : any
    initState : string = ""
        
    constructor() {
    }
    
    saveInitState(){
        this.initState = JSON.stringify(this)
    }
}
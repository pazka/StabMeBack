import Player from "./Player";

export enum GameActionType {
    GIVE_AP = "GIVE_AP",
    SHOOT = "SHOOT",
    MOVE = "MOVE",
    UPGRADE = "UPGRADE",
    WIN = "WIN"
}

export default class GameAction{
    Caster : Player
    Receiver : Player
    Type : GameActionType
    Params : any
    Id : number
    Date : number = Date.now()
}
import TimeStamped from "./TimeStamped";

export default class Player extends TimeStamped{
    HP: number = 3
    Range: number = 3
    AP: number = 1
    Id: string
    Name: string
    Pos : number[]
    RoomId : string
    
    constructor(id:string) {
        super("player_"+id);
    }
    
    tryUpgradeRange(){
        if (this.AP > 1) {
            throw `Not enough AP to upgrade player[${this.Name}]#${this.Id}`
        }

        this.Range += 1
        this.AP -= 1  
    }
}
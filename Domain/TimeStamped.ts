import {sub} from "../Services/events";
import allEvents from "../Services/Constants/allEvents";
import BaseObject from "./BaseObject";

export default class TimeStamped extends BaseObject{
    LastActive : number = Date.now()
    
    constructor(id : string) {
        super(id)
        
        sub(allEvents.OBJECT_IS_ACTIVE,(id : string)=>{
            if(this.Id == id)
                this.LastActive = Date.now()
        })
    }
}
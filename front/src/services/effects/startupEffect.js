import {fetchRooms} from "./lobbyEffects";

export function triggerStartupEffects(){
    return async (dispatch,getState)=>{
        await dispatch(fetchRooms())
    }
}
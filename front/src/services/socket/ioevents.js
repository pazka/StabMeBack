import store from "../redux";
import {fetchRooms} from "../effects/lobbyEffects";

export function setupEventsListeners(socket){
    socket.on("lightUpdateRoom",(data)=>{
        store.dispatch(fetchRooms())
    })
}
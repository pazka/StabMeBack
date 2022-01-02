import {apiGetAllRooms} from "../endpoints/roomEndpoint";
import {updateRooms} from "../redux/reducers/lobbySlice";
import {startLoading, stopLoading} from "../redux/reducers/loadingsSlice";
import {notifyError} from "../notify";

export function fetchRooms() {
    return async (dispatch, getState) => {
        dispatch(startLoading("rooms"))
        
        apiGetAllRooms().then(rooms=> {
            dispatch(updateRooms(rooms))
        }).catch(err => {
            dispatch(updateRooms([]))
            notifyError("Couldn't fetch rooms")
            return []
        }).finally(e=>{
            dispatch(stopLoading("rooms"))
        })
    }
}
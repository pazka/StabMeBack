import {apiGetAllRooms} from "../endpoints/roomEndpoint";
import {notifyError} from "../../Components/Commons/Notifier";
import {updateRooms} from "../redux/reducers/lobbySlice";

export function fetchRooms() {
    return async (dispatch, getState) => {
        const rooms = await apiGetAllRooms().catch(err => {
            notifyError("Couldn't fetch rooms")
        })
        
        dispatch(updateRooms(rooms))
    }
}
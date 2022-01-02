import {getData} from "../rest";

export function apiGetAllRooms(){
    return getData('/room/all')
}
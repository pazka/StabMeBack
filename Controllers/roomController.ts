import logger from "../Services/logger";
import {removePlayer} from "./playerController";
import Room from "../Domain/Room";
import {getConfig} from "../Services/env";

let allRooms: any = {}

export function createRoom(password: string = '',APDropInterval : number = null) {
    let room = new Room(newUniqueId(8))
    allRooms[room.Id] = room
    
    room.Password = password
    
    if(!APDropInterval){
        room.resetDropInterval(getConfig().DefaultAPDropInterval)
    }
    room.LastAPDropDate = Date.now()
    
    logger.log(`Created room#${room.Id}/DAP=${room.APDropInterval}`)
    return room
}

export function getAllRooms() {
    return allRooms
}

export function getRoom(id: string) {
    if (!Object.keys(allRooms).includes(id)) {
        throw `room#${id} not found for fetching`
    }

    return allRooms[id]
}

export function saveRoom(room: Room) {
    if (!Object.keys(allRooms).includes(room.Id)) {
        throw `room#${room.Id} not found for update`
    }

    allRooms[room.Id] = room
}

export function removeRoom(id: string) {
    if (!Object.keys(allRooms).includes(id)) {
        throw `room#${id} not found for removal`
    }

    let room: Room = allRooms[id]
    room.Players.forEach(p => removePlayer(p.Id))
    delete allRooms[id]
}

export function cleanUpRooms(){
    const entityTTL = getConfig("EntityTTL") 
    const idsToRemove : any = []
    
    Object.values(allRooms).forEach((room : Room) => {
        if (Date.now() - room.LastActive > (entityTTL * 1000)) {
            idsToRemove.push(room.Id)
        }
    })

    idsToRemove.forEach(removeRoom)
}

function newUniqueId(l: number): string {
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newId = new Array(l).fill(0).map(x => cs[Math.floor(Math.random() *
        cs.length)]).join('');

    return Object.keys(allRooms).includes(newId) ? newUniqueId(l) : newId
}

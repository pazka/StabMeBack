import logger from "../Services/logger";
import Player from "../Domain/Player";
import {send} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {getConfig} from "../Services/env";
import Room from "../Domain/Room";
import {removeRoom} from "./roomController";

let allPlayers: any = {}

export function getAllPlayers() {
    return allPlayers
}

export function createPlayer(name : string): Player {
    let player = new Player(newUniqueId(8))
    allPlayers[player.Id] = player
    
    player.Name = name
    
    return player
}

export function removePlayer(id: string) {
    if (!Object.keys(allPlayers).includes(id)) {
        logger.log(`player#${id} not found for removal`)
        return
    }

    delete allPlayers[id]
}

export function cleanUpPlayers(){
    const entityTTL = getConfig("Entity.TTL")
    const idsToRemove : any = []

    Object.values(allPlayers).forEach((room : Room) => {
        if (Date.now() - room.LastActive > (entityTTL * 1000)) {
            idsToRemove.push(room.Id)
        }
    })

    idsToRemove.forEach(removeRoom)
}

const cleanup_interval = setInterval(cleanUpPlayers,getConfig("Entity.CleanupInterval")*2000)


export function getPlayer(playerId: string) : Player {
    if (!Object.keys(allPlayers).includes(playerId))
        throw new Error(`player #${playerId} not found`)

    return allPlayers[playerId]
}

export function findPlayer(name :string) : Player{
    //@ts-ignore
    return Object.values(allPlayers).find((p:Player) => p.Name == name)
}

export function savePlayer(player: Player): Player {
    if (!Object.keys(allPlayers).includes(player.Id))
        throw new Error(`player[${player.Name}]#${player.Id} not found for saving`)

    send(internal_events.OBJECT_IS_ACTIVE,player.Id)
    allPlayers[player.Id] = player
    
    return player
}

function newUniqueId(l: number): string {
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newId = new Array(l).fill(0).map(x => cs[Math.floor(Math.random() *
        cs.length)]).join('');

    return Object.keys(allPlayers).includes(newId) ? newUniqueId(l) : newId
}
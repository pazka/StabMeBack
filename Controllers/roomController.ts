import logger from "../Services/logger";
import Room from "../Domain/Room";
import {getConfig} from "../Services/env";
import internal_events from "../Services/Constants/allEvents";
import {send} from "../Services/events";
import Player from "../Domain/Player";
import GameBonus from "../Domain/GameBonus";
import {GameActionType} from "../Domain/GameAction";

let allRooms: any = {}

export function createRoom(password: string = "",
                           name : string,
                           APDropInterval: number = getConfig("DefaultValues.APDropInterval"),
                           APDropAmount: number = getConfig("DefaultValues.APDropAmount"),
                           startAP: number = getConfig("DefaultValues.startAP"),
                           startHP: number = getConfig("DefaultValues.startHP"),
                           startRange: number = getConfig("DefaultValues.startRange"),
                           roomSize: number = getConfig("DefaultValues.roomSize"),
                           maxPlayers: number = getConfig("DefaultValues.maxPlayers")) : Room {
    let room = new Room(newUniqueId(8),name)
    allRooms[room.Id] = room
    
    room.Password = password
    room.DropInterval = APDropInterval
    room.APDropAmount = APDropAmount
    room.LastAPDropDate = Date.now()
    room.StartAP = startAP
    room.StartHP = startHP
    room.StartRange = startRange
    room.Size = roomSize
    room.MaxPlayers = maxPlayers

    
    logger.log(`Created room#${room.Id}/DAP=${room.DropInterval}`)
    send(internal_events.ROOM_UPDATED,room)
    return room
}

export function getAllRooms() : Room[]{
    return Object.values(allRooms)
}

export function getRoom(id: string) : Room {
    if (!Object.keys(allRooms).includes(id)) {
        throw new Error(`room#${id} not found for fetching`)
    }

    return allRooms[id]
}

export function saveRoom(room: Room) {
    if (!Object.keys(allRooms).includes(room.Id)) {
        throw new Error(`room#${room.Id} not found for update`)
    }

    allRooms[room.Id] = room
}

export function removeRoom(id: string) {
    if (!Object.keys(allRooms).includes(id)) {
        throw new Error(`room#${id} not found for removal`)
    }

    delete allRooms[id]
}

export function addPlayerToRoom(room: Room, player: Player, password: string): Room {
    if (password != room.Password)
        throw new Error(`Bad password`)

    if (room.Players.findIndex((p) => p.Id == player.Id) != -1) {
        logger.warn(`player[${player.Name}]#${player.Id} already in room`)
        return
    }

    if (room.Players.length >= room.MaxPlayers) {
        throw new Error(`Room is full`)
    }

    player.HP = room.StartHP
    player.Range = room.StartRange
    player.AP = room.StartAP
    player.Pos = [Math.floor(Math.random()*room.Size),Math.floor(Math.random()*room.Size)]

    room.Players.push(player)
    player.RoomId = room.Id

    return room
}

export function kickPlayerOfRoom(room: Room, player: Player) {
    const playerIndex = room.Players.findIndex((p) => p.Id == player.Id)
    if (playerIndex < 0) {
        logger.warn(`player[${player.Name}]#${player.Id} not in room`)
        return
    }

    //remove room from player
    room.Players[playerIndex].RoomId = null

    //remove player from room
    room.Players = room.Players.splice(playerIndex, 1)

    return room
}

export function generateBonus(room : Room){
    const availableBonus : GameActionType[] = [GameActionType.UPGRADE,GameActionType.GIVE_AP,GameActionType.HEAL]
    const lastBonusIndex =  Math.max(...room.ActiveBonuses.map(b=>b.Id))
    const bonus = new GameBonus()
    
    bonus.Id = lastBonusIndex+1
    bonus.Pos = [Math.floor(Math.random()*room.Size),Math.floor(Math.random()*room.Size)]
    bonus.Type = availableBonus[Math.floor(Math.random()*availableBonus.length)]
    bonus.Params = 1
}

export function removeBonusFromRoom(room: Room,bonus : GameBonus){
    const bonusIndex = room.ActiveBonuses.findIndex(b => b.Id == bonus.Id)
    room.ActiveBonuses.splice(bonusIndex,1)
}

export function cleanUpRooms() {
    const entityTTL = getConfig("Entity.TTL")
    const idsToRemove: any = []

    Object.values(allRooms).forEach((room: Room) => {
        if (Date.now() - room.LastActive > (entityTTL * 1000)) {
            idsToRemove.push(room.Id)
        }
    })

    idsToRemove.forEach(removeRoom)
}

const cleanup_interval = setInterval(cleanUpRooms, getConfig("Entity.CleanupInterval") * 1000)

function newUniqueId(l: number): string {
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newId = new Array(l).fill(0).map(x => cs[Math.floor(Math.random() *
        cs.length)]).join('');

    return Object.keys(allRooms).includes(newId) ? newUniqueId(l) : newId
}


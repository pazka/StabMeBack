import Room from "../Domain/Room";
import Player from "../Domain/Player";
import logger from "../Services/logger";
import GameAction, {GameActionType} from "../Domain/GameAction";
import {send, sub} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {getConfig} from "../Services/env";
import {getDistance, playerDist} from "../utils/GameUtils";
import {removeRoom} from "./roomController";

const GamePlayer = new Player("###GAME###")
GamePlayer.Name = "Game"

export function addPlayerToRoom(room: Room, player: Player, password: string): Room {
    if (password != room.Password)
        throw "Bad password"

    if (room.Players.findIndex((p) => p.Id == player.Id)) {
        logger.warn(`player[${player.Name}]#${player.Id} already in room`)
        return
    }

    if (room.Players.length >= room.maxPlayers) {
        throw "Room is full"
    }

    player.HP = getConfig("defaultStartHP")
    player.Range = getConfig("defaultStartRange")
    player.AP = getConfig("defaultStartAP")
    player.Pos = [Math.floor(Math.random()*room.Size),Math.floor(Math.random()*room.Size)]

    room.Players.push(player)
    player.RoomId = room.Id

    return room
}

export function triggerRoomApDrop(room: Room, nb: number) {
    room.Players.forEach(player => {
        const action = new GameAction()
        action.Type = GameActionType.GIVE_AP
        action.Caster = GamePlayer
        action.Receiver = player
        action.Params = nb

        player.AP += nb

        room.increaseHistory(action)
    })
    room.LastAPDropDate = Date.now()
}

export function executePlayerAction(room: Room, action: GameAction) {
    const player = action.Caster

    if (room.Players.findIndex(p => p.Id == player.Id) < 0)
        throw `Caster [${player.Name}]#${player.Id} not in room`

    if (action.Receiver && room.Players.findIndex(p => p.Id == action.Receiver.Id) < 0)
        throw `Receiver [${action.Receiver.Name}]#${action.Receiver.Id} not in room`

    switch (action.Type) {
        case GameActionType.UPGRADE:
            player.tryUpgradeRange()
            break;
        case GameActionType.GIVE_AP:
            _tryTransferAP(action)
            break;
        case GameActionType.MOVE:
            _tryMovePlayer(room, action)
            break;
        case GameActionType.SHOOT:
            _tryShootPlayer(action)
            break;

        default:
            throw "Unknown action"
    }

    room.increaseHistory(action)   
    
    if(_hasSomebodyWon(room)){
        const winAction = new GameAction()
        winAction.Type = GameActionType.WIN
        winAction.Receiver = room.Players.filter(p => p.HP > 0)[0]
        winAction.Caster = room.Players.filter(p => p.HP > 0)[0]
        
        removeRoom(room.Id)
        room.increaseHistory(winAction)
    }
}

export function kickPlayerOfRoom(room: Room, player: Player) {
    const playerIndex = room.Players.findIndex((p) => p.Id == player.Id)
    if (playerIndex < 0) {
        logger.warn(`player[${player.Name}]#${player.Id} not in room`)
        return
    }

    room.Players[playerIndex].RoomId = null
    room.Players = room.Players.splice(playerIndex, 1)
    
    return room
}

export function _tryTransferAP(action: GameAction) {
    if (action.Caster.AP < action.Params) {
        throw "Not enough AP"
    }

    if (playerDist(action.Caster, action.Receiver) > action.Caster.Range) {
        throw "Not enough Caster Range"
    }

    action.Caster.AP -= action.Params
    action.Receiver.AP += action.Params
}

export function _tryShootPlayer(action: GameAction) {
    const dist = playerDist(action.Caster, action.Receiver)
    if (dist > action.Caster.Range) {
        throw `Not enough Caster Range. ${action.Caster.Name}#${action.Caster.Id}=${action.Caster.Range}; Need=${dist}`
    }

    if (action.Params > action.Caster.AP) {
        throw `Not enough Caster AP. ${action.Caster.Name}#${action.Caster.Id}=${action.Caster.AP}; Need=${dist}`
    }

    const finalAPUsed = Math.min(action.Receiver.HP, action.Params)

    if (action.Receiver.HP == 0) {
        throw "Player already dead"
    }

    action.Caster.AP -= finalAPUsed
    action.Receiver.HP -= finalAPUsed
    action.Params = finalAPUsed
}

export function _tryMovePlayer(room: Room, action: GameAction) {
    if (!Array.isArray(action.Params)) {
        throw "bad parameters"
    }

    const dist = getDistance(action.Caster.Pos, action.Params)
    if (dist > action.Caster.AP) {
        throw `Not enough Caster AP. ${action.Caster.Name}#${action.Caster.Id}=${action.Caster.AP}; Need=${dist}`
    }

    if (!room.isInBounds(action.Params))
        throw "Out of bounds"

    action.Caster.AP -= getDistance(action.Caster.Pos, action.Params)
    action.Caster.Pos = action.Params
}

export function _hasSomebodyWon(room : Room){
    return room.Players.filter(p => p.HP > 0).length == 1
}
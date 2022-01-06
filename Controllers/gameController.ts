import Room from "../Domain/Room";
import Player from "../Domain/Player";
import logger from "../Services/logger";
import GameAction, {GameActionType} from "../Domain/GameAction";
import GameBonus from "../Domain/GameBonus";
import {send, sub} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {getConfig} from "../Services/env";
import {getDistance, playerDist} from "../utils/GameUtils";
import {removeBonusFromRoom, removeRoom} from "./roomController";

const GamePlayer = new Player("###GAME###")
GamePlayer.Name = "Game"

const BonusPlayer = new Player("###BONUS###")
BonusPlayer.Name = "Bonus"



export function triggerRoomApDrop(room: Room, nb: number) {
    room.Players.forEach(player => {
        
        const action = new GameAction()
        action.Type = GameActionType.GIVE_AP
        action.Caster = GamePlayer
        action.Receiver = player
        action.Params = nb
        action.saveInitState()

        player.AP += nb
        
        room.increaseHistoryRaw(action)
    })
    room.LastAPDropDate = Date.now()
}

export function executePlayerAction(room: Room, action: GameAction) {
    const player = action.Caster
    action.saveInitState()

    if (room.Players.findIndex(p => p.Id == player.Id) < 0)
        throw new Error(`Caster [${player.Name}]#${player.Id} not in room`)

    if (action.Receiver && room.Players.findIndex(p => p.Id == action.Receiver.Id) < 0)
        throw new Error(`Receiver [${action.Receiver.Name}]#${action.Receiver.Id} not in room`)

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
            throw new Error(`Unknown action`)
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


export function _tryTransferAP(action: GameAction) {
    if (action.Caster.AP < action.Params) {
        throw new Error(`Not enough AP`)
    }

    if (playerDist(action.Caster, action.Receiver) > action.Caster.Range) {
        throw new Error(`Not enough Caster Range`)
    }

    action.Caster.AP -= action.Params
    action.Receiver.AP += action.Params
}

export function _tryShootPlayer(action: GameAction) {
    const dist = playerDist(action.Caster, action.Receiver)
    if (dist > action.Caster.Range) {
        throw new Error(`Not enough Caster Range. [${action.Caster.Name}]#${action.Caster.Id}=${action.Caster.Range}; Need=${dist}`)
    }

    if (action.Params > action.Caster.AP) {
        throw new Error(`Not enough Caster AP. [${action.Caster.Name}]#${action.Caster.Id}=${action.Caster.AP}; Need=${dist}`)
    }

    const finalAPUsed = Math.min(action.Receiver.HP, action.Params)

    if (action.Receiver.HP == 0) {
        throw new Error(`Player already dead`)
    }

    action.Caster.AP -= finalAPUsed
    action.Receiver.HP -= finalAPUsed
    action.Params = finalAPUsed
}

export function _tryConsumeBonus(room : Room, player : Player){
    room.ActiveBonuses.forEach((bonus : GameBonus)=>{
        if(getDistance(bonus.Pos,player.Pos) != 0)
            return;
        
        const action = new GameAction()
            action.Type = bonus.Type
            action.Caster = BonusPlayer
            action.Receiver = player
            action.Params = bonus.Params
            action.saveInitState()

            executePlayerAction(room,action)
            removeBonusFromRoom(room,bonus)
    })
}

export function _tryMovePlayer(room: Room, action: GameAction) {
    if (!Array.isArray(action.Params)) {
        throw new Error(`bad parameters`)
    }

    const dist = getDistance(action.Caster.Pos, action.Params)
    if (dist > action.Caster.AP) {
        throw new Error(`Not enough Caster AP. [${action.Caster.Name}]#${action.Caster.Id}=${action.Caster.AP}; Need=${dist}`)
    }

    if (!room.isInBounds(action.Params))
        throw new Error(`Out of bounds`)

    const otherPlayer = room.Players.find((p:Player)=> p.Pos[0] == action.Params[0] && p.Pos[1] == action.Params[1])
    if(otherPlayer){
        throw new Error(`[${otherPlayer.Name}]#${otherPlayer.Id} already at ${action.Params}`)
    }
    
    action.Caster.AP -= getDistance(action.Caster.Pos, action.Params)
    action.Caster.Pos = action.Params
}

export function _hasSomebodyWon(room : Room){
    return room.Players.filter(p => p.HP > 0).length == 1
}
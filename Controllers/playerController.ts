import logger from "../Services/logger";
import Player from "../Domain/Player";

let allPlayers: any = {}

export function createPlayer() {
    let player = new Player(newUniqueId(8))
    allPlayers[player.Id] = player
    return player
}

export function removePlayer(id: string) {
    if (!Object.keys(allPlayers).includes(id)) {
        logger.log(`player#${id} not found for removal`)
        return
    }

    delete allPlayers[id]
}


export function getPlayer(playerId: string) {
    if (!Object.keys(allPlayers).includes(playerId))
        throw `player #${playerId} not found`

    return allPlayers[playerId]
}

export function savePlayer(player: Player) {
    if (!Object.keys(allPlayers).includes(player.Id))
        throw `player[${player.Name}]#${player.Id} not found for saving`

    allPlayers[player.Id] = player
}

function newUniqueId(l: number): string {
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newId = new Array(l).fill(0).map(x => cs[Math.floor(Math.random() *
        cs.length)]).join('');

    return Object.keys(allPlayers).includes(newId) ? newUniqueId(l) : newId
}
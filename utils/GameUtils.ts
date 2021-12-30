import Player from "../Domain/Player";

export function getDistance(a: number[], b: number[]) {
    return Math.round(Math.sqrt(a[0] * b[0] + a[1] * b[1])) // Euclidean distance
    // return Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1])) // Manhattan distance
}

export function playerDist(p1: Player, p2: Player) {
    return getDistance(p1.Pos, p2.Pos)
}

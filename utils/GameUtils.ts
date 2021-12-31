import Player from "../Domain/Player";

export function getDistance(a: number[], b: number[]) {
    const diff = [(a[0] - b[0]),(a[1] - b[1])]
    return Math.round(Math.sqrt(diff[0]*diff[0] + diff[1]*diff[1])) // Euclidean distance
    // return Math.max(Math.abs(diff[0]),Math.abs(diff[1])) // Manhattan distance
}

export function playerDist(p1: Player, p2: Player) {
    return getDistance(p1.Pos, p2.Pos)
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerDist = exports.getDistance = void 0;
function getDistance(a, b) {
    var diff = [(a[0] - b[0]), (a[1] - b[1])];
    return Math.round(Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]));
}
exports.getDistance = getDistance;
function playerDist(p1, p2) {
    return getDistance(p1.Pos, p2.Pos);
}
exports.playerDist = playerDist;
//# sourceMappingURL=GameUtils.js.map
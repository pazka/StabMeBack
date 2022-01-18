"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._hasSomebodyWon = exports._tryMovePlayer = exports._tryConsumeBonus = exports._tryShootPlayer = exports._tryTransferAP = exports.executePlayerAction = exports.triggerRoomApDrop = void 0;
var Player_1 = require("../Domain/Player");
var GameAction_1 = require("../Domain/GameAction");
var GameUtils_1 = require("../utils/GameUtils");
var roomController_1 = require("./roomController");
var GamePlayer = new Player_1.default("###GAME###");
GamePlayer.Name = "Game";
var BonusPlayer = new Player_1.default("###BONUS###");
BonusPlayer.Name = "Bonus";
function triggerRoomApDrop(room, nb) {
    room.Players.forEach(function (player) {
        var action = new GameAction_1.default();
        action.Type = GameAction_1.GameActionType.GIVE_AP;
        action.Caster = GamePlayer;
        action.Receiver = player;
        action.Params = nb;
        action.saveInitState();
        player.AP += nb;
        room.increaseHistoryRaw(action);
    });
    room.LastAPDropDate = Date.now();
}
exports.triggerRoomApDrop = triggerRoomApDrop;
function executePlayerAction(room, action) {
    var player = action.Caster;
    action.saveInitState();
    if (room.Players.findIndex(function (p) { return p.Id == player.Id; }) < 0)
        throw new Error("Caster [".concat(player.Name, "]#").concat(player.Id, " not in room"));
    if (action.Receiver && room.Players.findIndex(function (p) { return p.Id == action.Receiver.Id; }) < 0)
        throw new Error("Receiver [".concat(action.Receiver.Name, "]#").concat(action.Receiver.Id, " not in room"));
    switch (action.Type) {
        case GameAction_1.GameActionType.UPGRADE:
            player.tryUpgradeRange();
            break;
        case GameAction_1.GameActionType.GIVE_AP:
            _tryTransferAP(action);
            break;
        case GameAction_1.GameActionType.MOVE:
            _tryMovePlayer(room, action);
            break;
        case GameAction_1.GameActionType.SHOOT:
            _tryShootPlayer(action);
            break;
        default:
            throw new Error("Unknown action");
    }
    room.increaseHistory(action);
    if (_hasSomebodyWon(room)) {
        var winAction = new GameAction_1.default();
        winAction.Type = GameAction_1.GameActionType.WIN;
        winAction.Receiver = room.Players.filter(function (p) { return p.HP > 0; })[0];
        winAction.Caster = room.Players.filter(function (p) { return p.HP > 0; })[0];
        (0, roomController_1.removeRoom)(room.Id);
        room.increaseHistory(winAction);
    }
}
exports.executePlayerAction = executePlayerAction;
function _tryTransferAP(action) {
    if (action.Caster.AP < action.Params) {
        throw new Error("Not enough AP");
    }
    if ((0, GameUtils_1.playerDist)(action.Caster, action.Receiver) > action.Caster.Range) {
        throw new Error("Not enough Caster Range");
    }
    action.Caster.AP -= action.Params;
    action.Receiver.AP += action.Params;
}
exports._tryTransferAP = _tryTransferAP;
function _tryShootPlayer(action) {
    var dist = (0, GameUtils_1.playerDist)(action.Caster, action.Receiver);
    if (dist > action.Caster.Range) {
        throw new Error("Not enough Caster Range. [".concat(action.Caster.Name, "]#").concat(action.Caster.Id, "=").concat(action.Caster.Range, "; Need=").concat(dist));
    }
    if (action.Params > action.Caster.AP) {
        throw new Error("Not enough Caster AP. [".concat(action.Caster.Name, "]#").concat(action.Caster.Id, "=").concat(action.Caster.AP, "; Need=").concat(dist));
    }
    var finalAPUsed = Math.min(action.Receiver.HP, action.Params);
    if (action.Receiver.HP == 0) {
        throw new Error("Player already dead");
    }
    action.Caster.AP -= finalAPUsed;
    action.Receiver.HP -= finalAPUsed;
    action.Params = finalAPUsed;
}
exports._tryShootPlayer = _tryShootPlayer;
function _tryConsumeBonus(room, player) {
    room.ActiveBonuses.forEach(function (bonus) {
        if ((0, GameUtils_1.getDistance)(bonus.Pos, player.Pos) != 0)
            return;
        var action = new GameAction_1.default();
        action.Type = bonus.Type;
        action.Caster = BonusPlayer;
        action.Receiver = player;
        action.Params = bonus.Params;
        action.saveInitState();
        executePlayerAction(room, action);
        (0, roomController_1.removeBonusFromRoom)(room, bonus);
    });
}
exports._tryConsumeBonus = _tryConsumeBonus;
function _tryMovePlayer(room, action) {
    if (!Array.isArray(action.Params)) {
        throw new Error("bad parameters");
    }
    var dist = (0, GameUtils_1.getDistance)(action.Caster.Pos, action.Params);
    if (dist > action.Caster.AP) {
        throw new Error("Not enough Caster AP. [".concat(action.Caster.Name, "]#").concat(action.Caster.Id, "=").concat(action.Caster.AP, "; Need=").concat(dist));
    }
    if (!room.isInBounds(action.Params))
        throw new Error("Out of bounds");
    var otherPlayer = room.Players.find(function (p) { return p.Pos[0] == action.Params[0] && p.Pos[1] == action.Params[1]; });
    if (otherPlayer) {
        throw new Error("[".concat(otherPlayer.Name, "]#").concat(otherPlayer.Id, " already at ").concat(action.Params));
    }
    action.Caster.AP -= (0, GameUtils_1.getDistance)(action.Caster.Pos, action.Params);
    action.Caster.Pos = action.Params;
}
exports._tryMovePlayer = _tryMovePlayer;
function _hasSomebodyWon(room) {
    return room.Players.filter(function (p) { return p.HP > 0; }).length == 1;
}
exports._hasSomebodyWon = _hasSomebodyWon;
//# sourceMappingURL=gameController.js.map
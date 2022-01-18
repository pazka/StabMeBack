"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameActionType = void 0;
var GameActionType;
(function (GameActionType) {
    GameActionType["GIVE_AP"] = "GIVE_AP";
    GameActionType["SHOOT"] = "SHOOT";
    GameActionType["MOVE"] = "MOVE";
    GameActionType["UPGRADE"] = "UPGRADE";
    GameActionType["HEAL"] = "HEAL";
    GameActionType["WIN"] = "WIN";
})(GameActionType = exports.GameActionType || (exports.GameActionType = {}));
var GameAction = (function () {
    function GameAction() {
        this.initState = "";
    }
    GameAction.prototype.saveInitState = function () {
        this.initState = JSON.stringify(this);
    };
    return GameAction;
}());
exports.default = GameAction;
//# sourceMappingURL=GameAction.js.map
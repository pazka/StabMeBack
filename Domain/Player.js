"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TimeStamped_1 = require("./TimeStamped");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(id) {
        var _this = _super.call(this, "player_" + id) || this;
        _this.HP = 3;
        _this.Range = 3;
        _this.AP = 1;
        return _this;
    }
    Player.prototype.tryUpgradeRange = function () {
        if (this.AP > 1) {
            throw new Error("Not enough AP to upgrade player[".concat(this.Name, "]#").concat(this.Id));
        }
        this.Range += 1;
        this.AP -= 1;
    };
    return Player;
}(TimeStamped_1.default));
exports.default = Player;
//# sourceMappingURL=Player.js.map
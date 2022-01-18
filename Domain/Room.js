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
var events_1 = require("../Services/events");
var allEvents_1 = require("../Services/Constants/allEvents");
var allApDropTriggers = {};
var HistoryItem = (function () {
    function HistoryItem(Id, data) {
        this.Date = Date.now();
        this.data = "";
        this.Id = Id;
        this.data = data;
    }
    return HistoryItem;
}());
var Room = (function (_super) {
    __extends(Room, _super);
    function Room(id, name) {
        var _this = _super.call(this, "room_" + id) || this;
        _this.Players = [];
        _this.History = [];
        _this.ActiveBonuses = [];
        _this.Size = 20;
        _this.MaxPlayers = 8;
        _this.Password = "";
        _this.APDropAmount = 1;
        _this.Name = name;
        return _this;
    }
    Room.prototype.increaseHistoryRaw = function (data) {
        this.History.push(new HistoryItem(this.History.length, data));
    };
    Room.prototype.increaseHistory = function (gameAction) {
        var _a, _b;
        this.increaseHistoryRaw(gameAction);
        (0, events_1.send)(allEvents_1.default.OBJECT_IS_ACTIVE, (_a = gameAction.Caster) === null || _a === void 0 ? void 0 : _a.Id);
        (0, events_1.send)(allEvents_1.default.OBJECT_IS_ACTIVE, (_b = gameAction.Receiver) === null || _b === void 0 ? void 0 : _b.Id);
        (0, events_1.send)(allEvents_1.default.OBJECT_IS_ACTIVE, this.Id);
    };
    Object.defineProperty(Room.prototype, "DropInterval", {
        get: function () {
            return this.APDropInterval;
        },
        set: function (newAPDropInterval) {
            var _this = this;
            this.APDropInterval = newAPDropInterval;
            if (allApDropTriggers[this.Id])
                clearInterval(allApDropTriggers[this.Id]);
            if (!newAPDropInterval)
                return;
            allApDropTriggers[this.Id] = setInterval(function () {
                (0, events_1.send)(allEvents_1.default.ROOM_AP_DROP, { room: _this });
            }, this.APDropInterval * 60 * 1000);
        },
        enumerable: false,
        configurable: true
    });
    Room.prototype.isInBounds = function (pos) {
        return !(pos[0] < 0 || pos[0] >= this.Size || pos[1] < 0 || pos[1] >= this.Size);
    };
    Room.prototype.toShallow = function () {
        return {
            Id: this.Id,
            Name: this.Name,
            NbPlayers: this.Players.length,
            MaxPlayers: this.MaxPlayers,
            DateCreated: this.DateCreated,
            PasswordProtected: this.Password != ""
        };
    };
    return Room;
}(TimeStamped_1.default));
exports.default = Room;
//# sourceMappingURL=Room.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpRooms = exports.removeBonusFromRoom = exports.generateBonus = exports.kickPlayerOfRoom = exports.addPlayerToRoom = exports.removeRoom = exports.saveRoom = exports.getRoom = exports.getAllRooms = exports.createRoom = exports.destroy = exports.init = void 0;
var logger_1 = require("../Services/logger");
var Room_1 = require("../Domain/Room");
var env_1 = require("../Services/env");
var allEvents_1 = require("../Services/Constants/allEvents");
var events_1 = require("../Services/events");
var GameBonus_1 = require("../Domain/GameBonus");
var GameAction_1 = require("../Domain/GameAction");
var RoomPersistor_1 = require("../Services/storage/Persistors/RoomPersistor");
var allRooms = {};
var persistor = { hydrate: RoomPersistor_1.hydrate, persist: RoomPersistor_1.persist };
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            allRooms = persistor.hydrate();
            return [2];
        });
    });
}
exports.init = init;
function destroy() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            persistor.persist(allRooms);
            return [2];
        });
    });
}
exports.destroy = destroy;
function createRoom(password, name, APDropInterval, APDropAmount, startAP, startHP, startRange, roomSize, maxPlayers) {
    if (password === void 0) { password = ""; }
    if (APDropInterval === void 0) { APDropInterval = (0, env_1.getConfig)("DefaultValues.APDropInterval"); }
    if (APDropAmount === void 0) { APDropAmount = (0, env_1.getConfig)("DefaultValues.APDropAmount"); }
    if (startAP === void 0) { startAP = (0, env_1.getConfig)("DefaultValues.startAP"); }
    if (startHP === void 0) { startHP = (0, env_1.getConfig)("DefaultValues.startHP"); }
    if (startRange === void 0) { startRange = (0, env_1.getConfig)("DefaultValues.startRange"); }
    if (roomSize === void 0) { roomSize = (0, env_1.getConfig)("DefaultValues.roomSize"); }
    if (maxPlayers === void 0) { maxPlayers = (0, env_1.getConfig)("DefaultValues.maxPlayers"); }
    var room = new Room_1.default(newUniqueId(8), name);
    allRooms[room.Id] = room;
    room.Password = password;
    room.DropInterval = APDropInterval;
    room.APDropAmount = APDropAmount;
    room.LastAPDropDate = Date.now();
    room.StartAP = startAP;
    room.StartHP = startHP;
    room.StartRange = startRange;
    room.Size = roomSize;
    room.MaxPlayers = maxPlayers;
    logger_1.default.log("Created room#".concat(room.Id, "/DAP=").concat(room.DropInterval));
    (0, events_1.send)(allEvents_1.default.ROOM_UPDATED, room);
    return room;
}
exports.createRoom = createRoom;
function getAllRooms() {
    return Object.values(allRooms);
}
exports.getAllRooms = getAllRooms;
function getRoom(id) {
    if (!Object.keys(allRooms).includes(id)) {
        throw new Error("room#".concat(id, " not found for fetching"));
    }
    return allRooms[id];
}
exports.getRoom = getRoom;
function saveRoom(room) {
    if (!Object.keys(allRooms).includes(room.Id)) {
        throw new Error("room#".concat(room.Id, " not found for update"));
    }
    allRooms[room.Id] = room;
}
exports.saveRoom = saveRoom;
function removeRoom(id) {
    if (!Object.keys(allRooms).includes(id)) {
        throw new Error("room#".concat(id, " not found for removal"));
    }
    delete allRooms[id];
}
exports.removeRoom = removeRoom;
function addPlayerToRoom(room, player, password) {
    if (password != room.Password)
        throw new Error("Bad password");
    if (room.Players.findIndex(function (p) { return p.Id == player.Id; }) != -1) {
        logger_1.default.warn("player[".concat(player.Name, "]#").concat(player.Id, " already in room"));
        return;
    }
    if (room.Players.length >= room.MaxPlayers) {
        throw new Error("Room is full");
    }
    player.HP = room.StartHP;
    player.Range = room.StartRange;
    player.AP = room.StartAP;
    player.Pos = [Math.floor(Math.random() * room.Size), Math.floor(Math.random() * room.Size)];
    room.Players.push(player);
    player.RoomId = room.Id;
    return room;
}
exports.addPlayerToRoom = addPlayerToRoom;
function kickPlayerOfRoom(room, player) {
    var playerIndex = room.Players.findIndex(function (p) { return p.Id == player.Id; });
    if (playerIndex < 0) {
        logger_1.default.warn("player[".concat(player.Name, "]#").concat(player.Id, " not in room"));
        return;
    }
    room.Players[playerIndex].RoomId = null;
    room.Players = room.Players.splice(playerIndex, 1);
    return room;
}
exports.kickPlayerOfRoom = kickPlayerOfRoom;
function generateBonus(room) {
    var availableBonus = [GameAction_1.GameActionType.UPGRADE, GameAction_1.GameActionType.GIVE_AP, GameAction_1.GameActionType.HEAL];
    var lastBonusIndex = Math.max.apply(Math, room.ActiveBonuses.map(function (b) { return b.Id; }));
    var bonus = new GameBonus_1.default();
    bonus.Id = lastBonusIndex + 1;
    bonus.Pos = [Math.floor(Math.random() * room.Size), Math.floor(Math.random() * room.Size)];
    bonus.Type = availableBonus[Math.floor(Math.random() * availableBonus.length)];
    bonus.Params = 1;
}
exports.generateBonus = generateBonus;
function removeBonusFromRoom(room, bonus) {
    var bonusIndex = room.ActiveBonuses.findIndex(function (b) { return b.Id == bonus.Id; });
    room.ActiveBonuses.splice(bonusIndex, 1);
}
exports.removeBonusFromRoom = removeBonusFromRoom;
function cleanUpRooms() {
    var entityTTL = (0, env_1.getConfig)("Entity.TTL");
    var idsToRemove = [];
    Object.values(allRooms).forEach(function (room) {
        if (Date.now() - room.LastActive > (entityTTL * 1000)) {
            idsToRemove.push(room.Id);
        }
    });
    idsToRemove.forEach(removeRoom);
}
exports.cleanUpRooms = cleanUpRooms;
var cleanup_interval = setInterval(cleanUpRooms, (0, env_1.getConfig)("Entity.CleanupInterval") * 1000);
function newUniqueId(l) {
    var cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var newId = new Array(l).fill(0).map(function (x) { return cs[Math.floor(Math.random() *
        cs.length)]; }).join('');
    return Object.keys(allRooms).includes(newId) ? newUniqueId(l) : newId;
}
//# sourceMappingURL=roomController.js.map
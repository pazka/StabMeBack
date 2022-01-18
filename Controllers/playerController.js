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
exports.savePlayer = exports.findPlayer = exports.getPlayer = exports.tryGetPlayer = exports.cleanUpPlayers = exports.removePlayer = exports.createPlayer = exports.getAllPlayers = exports.destroy = exports.init = void 0;
var logger_1 = require("../Services/logger");
var Player_1 = require("../Domain/Player");
var events_1 = require("../Services/events");
var allEvents_1 = require("../Services/Constants/allEvents");
var env_1 = require("../Services/env");
var roomController_1 = require("./roomController");
var PlayerPersistor_1 = require("../Services/storage/Persistors/PlayerPersistor");
var allPlayers = {};
var persistor = { hydrate: PlayerPersistor_1.hydrate, persist: PlayerPersistor_1.persist };
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            allPlayers = persistor.hydrate();
            return [2];
        });
    });
}
exports.init = init;
function destroy() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            persistor.persist(allPlayers);
            return [2];
        });
    });
}
exports.destroy = destroy;
function getAllPlayers() {
    return Object.values(allPlayers);
}
exports.getAllPlayers = getAllPlayers;
function createPlayer(name) {
    var player = new Player_1.default(newUniqueId(8));
    allPlayers[player.Id] = player;
    player.Name = name;
    return player;
}
exports.createPlayer = createPlayer;
function removePlayer(id) {
    if (!Object.keys(allPlayers).includes(id)) {
        logger_1.default.log("player#".concat(id, " not found for removal"));
        return;
    }
    delete allPlayers[id];
}
exports.removePlayer = removePlayer;
function cleanUpPlayers() {
    var entityTTL = (0, env_1.getConfig)("Entity.TTL");
    var idsToRemove = [];
    Object.values(allPlayers).forEach(function (room) {
        if (Date.now() - room.LastActive > (entityTTL * 1000)) {
            idsToRemove.push(room.Id);
        }
    });
    idsToRemove.forEach(roomController_1.removeRoom);
}
exports.cleanUpPlayers = cleanUpPlayers;
var cleanup_interval = setInterval(cleanUpPlayers, (0, env_1.getConfig)("Entity.CleanupInterval") * 2000);
function tryGetPlayer(playerId) {
    var _a;
    return (_a = allPlayers[playerId]) !== null && _a !== void 0 ? _a : null;
}
exports.tryGetPlayer = tryGetPlayer;
function getPlayer(playerId) {
    if (!Object.keys(allPlayers).includes(playerId))
        throw new Error("player #".concat(playerId, " not found"));
    return allPlayers[playerId];
}
exports.getPlayer = getPlayer;
function findPlayer(name) {
    return Object.values(allPlayers).find(function (p) { return p.Name == name; });
}
exports.findPlayer = findPlayer;
function savePlayer(player) {
    if (!Object.keys(allPlayers).includes(player.Id))
        throw new Error("player[".concat(player.Name, "]#").concat(player.Id, " not found for saving"));
    (0, events_1.send)(allEvents_1.default.OBJECT_IS_ACTIVE, player.Id);
    allPlayers[player.Id] = player;
    return player;
}
exports.savePlayer = savePlayer;
function newUniqueId(l) {
    var cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var newId = new Array(l).fill(0).map(function (x) { return cs[Math.floor(Math.random() *
        cs.length)]; }).join('');
    return Object.keys(allPlayers).includes(newId) ? newUniqueId(l) : newId;
}
//# sourceMappingURL=playerController.js.map
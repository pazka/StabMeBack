"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var events_1 = require("../Services/events");
var allEvents_1 = require("../Services/Constants/allEvents");
var gameController_1 = require("../Controllers/gameController");
var roomController_1 = require("../Controllers/roomController");
var express_validator_1 = require("express-validator");
var authentication_1 = require("../Services/authentication");
var playerController_1 = require("../Controllers/playerController");
var env_1 = require("../Services/env");
var adminRoomRoutes_1 = require("./adminRoomRoutes");
var router = express.Router();
router.get('/admin', authentication_1.requireAdmin, adminRoomRoutes_1.default);
router.get('/all', function (req, res, next) {
    res.send((0, roomController_1.getAllRooms)().map(function (room) { return (room.toShallow()); }));
});
router.post('/create', authentication_1.requirePlayerCreated, (0, express_validator_1.check)('password').default('').trim().escape().isLength({ min: 0, max: 30 }).withMessage('Must be less than 30 chars'), (0, express_validator_1.check)("name").trim().escape().isLength({ min: 5, max: 50 }).withMessage('Must be between 5 and 50 chars'), (0, express_validator_1.check)('dropInterval').default((0, env_1.getConfig)("DefaultValues.APDropInterval")).isInt({
    min: 1,
    max: 7 * 24 * 60
}).withMessage('Must be 1 < x < 7*24*60'), (0, express_validator_1.check)('dropAmount').default((0, env_1.getConfig)("DefaultValues.APDropAmount")).isInt({
    min: 1,
    max: 1000
}).withMessage('Must be 1 < x < 1000'), (0, express_validator_1.check)('startAP').default((0, env_1.getConfig)("DefaultValues.startAP")).isInt({
    min: 0,
    max: 1000
}).withMessage('Must be 0 < x < 1000'), (0, express_validator_1.check)('startHP').default((0, env_1.getConfig)("DefaultValues.startHP")).isInt({
    min: 1,
    max: 1000
}).withMessage('Must be 1 < x < 1000'), (0, express_validator_1.check)('startRange').default((0, env_1.getConfig)("DefaultValues.startRange")).isInt({
    min: 0,
    max: 1000
}).withMessage('Must be 0 < x < 1000'), (0, express_validator_1.check)('maxPlayers').default((0, env_1.getConfig)("DefaultValues.maxPlayers")).isInt({
    min: 2,
    max: 20
}).withMessage('Must be 2 < x < 20'), (0, express_validator_1.check)('roomSize').default((0, env_1.getConfig)("DefaultValues.roomSize")).isInt({
    min: 2,
    max: 1000
}).withMessage('Must be 2 < x < 1000'), authentication_1.requireBodyValidation, function (req, res, next) {
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    try {
        var room = (0, roomController_1.createRoom)(req.body.password, req.body.name, req.body.dropInterval, req.body.dropAmount, req.body.startAP, req.body.startHP, req.body.startRange, req.body.maxPlayers, req.body.roomSize);
        room.Creator = player;
        return res.send(room);
    }
    catch (err) {
        return res.status(403).send(err.message);
    }
});
router.delete('/:roomId', authentication_1.requirePlayerCreated, function (req, res, next) {
    var room = (0, roomController_1.getRoom)(req.params.roomId);
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    if (room.Creator.Id != player.Id) {
        return res.status(403).send({ message: "Only the creator of the room can remove it" });
    }
    try {
        (0, roomController_1.removeRoom)(room.Id);
    }
    catch (err) {
        return res.status(400).send({ message: "Error removing room", error: err.message });
    }
    res.send("OK");
});
router.post('/join/:roomId', (0, express_validator_1.body)('password').default('').trim().escape(), function (req, res, next) {
    var room;
    var player;
    var session = req.session;
    try {
        room = (0, roomController_1.getRoom)(req.params.roomId);
    }
    catch (err) {
        return res.status(403).send({ message: "Room don't exist", error: err.message });
    }
    player = (0, playerController_1.getPlayer)(session.playerId);
    try {
        (0, roomController_1.addPlayerToRoom)(room, player, req.body.password);
    }
    catch (err) {
        return res.status(403).send({ message: "Couldn't join room", error: err.message });
    }
    session.roomId = room.Id;
    res.send(room);
});
router.post('/leave', authentication_1.requirePlayerCreated, authentication_1.requireRoomJoined, function (req, res, next) {
    var session = req.session;
    var room = (0, roomController_1.getRoom)(session.roomId);
    var player = (0, playerController_1.getPlayer)(session.playerId);
    (0, roomController_1.kickPlayerOfRoom)(room, player);
    res.send("OK");
});
router.get('/:roomId', authentication_1.requireRoomJoined, function (req, res, next) {
    var room;
    try {
        room = (0, roomController_1.getRoom)(req.params.roomId);
    }
    catch (err) {
        return res.status(403).send(err.message);
    }
    res.send(room);
});
(0, events_1.sub)(allEvents_1.default.ROOM_AP_DROP, function (data) {
    (0, gameController_1.triggerRoomApDrop)(data.room, data.room.APDropAmount);
});
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map
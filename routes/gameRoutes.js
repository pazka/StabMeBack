"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authentication_1 = require("../Services/authentication");
var playerController_1 = require("../Controllers/playerController");
var GameAction_1 = require("../Domain/GameAction");
var gameController_1 = require("../Controllers/gameController");
var express_validator_1 = require("express-validator");
var roomController_1 = require("../Controllers/roomController");
var express = require("express");
var adminGameRoutes_1 = require("./adminGameRoutes");
var router = express.Router();
router.use('/admin', authentication_1.requireAdmin, adminGameRoutes_1.default);
router.post('/shoot', authentication_1.requirePlayerCreated, authentication_1.requireRoomJoined, function (req, res, next) {
    var _a;
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    var room = (0, roomController_1.getRoom)(session.roomId);
    var gameAction = new GameAction_1.default();
    gameAction.Caster = player;
    gameAction.Type = GameAction_1.GameActionType.SHOOT;
    gameAction.Receiver = (0, playerController_1.getPlayer)(req.body.targetId);
    gameAction.Params = (_a = req.body.amount) !== null && _a !== void 0 ? _a : 1;
    try {
        (0, gameController_1.executePlayerAction)(room, gameAction);
    }
    catch (e) {
        res.status(400).send({ message: "couldn't execute action", error: e.message });
    }
    res.status(200).send(room);
});
router.post('/give', authentication_1.requirePlayerCreated, authentication_1.requireRoomJoined, function (req, res, next) {
    var _a;
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    var room = (0, roomController_1.getRoom)(session.roomId);
    var gameAction = new GameAction_1.default();
    gameAction.Caster = player;
    gameAction.Type = GameAction_1.GameActionType.GIVE_AP;
    gameAction.Receiver = (0, playerController_1.getPlayer)(req.body.targetId);
    gameAction.Params = (_a = req.body.amount) !== null && _a !== void 0 ? _a : 1;
    try {
        (0, gameController_1.executePlayerAction)(room, gameAction);
    }
    catch (e) {
        res.status(400).send({ message: "couldn't execute action", error: e.message });
    }
    res.status(200).send(room);
});
router.post('/upgrade', authentication_1.requirePlayerCreated, authentication_1.requireRoomJoined, function (req, res, next) {
    var _a;
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    var room = (0, roomController_1.getRoom)(session.roomId);
    var gameAction = new GameAction_1.default();
    gameAction.Caster = player;
    gameAction.Type = GameAction_1.GameActionType.UPGRADE;
    gameAction.Params = (_a = req.body.amount) !== null && _a !== void 0 ? _a : 1;
    try {
        (0, gameController_1.executePlayerAction)(room, gameAction);
    }
    catch (e) {
        res.status(400).send({ message: "couldn't execute action", error: e.message });
    }
    res.status(200).send(room);
});
router.post('/move', authentication_1.requirePlayerCreated, authentication_1.requireRoomJoined, (0, express_validator_1.body)("dest").isArray({ min: 2, max: 2 }), function (req, res, next) {
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    var room = (0, roomController_1.getRoom)(session.roomId);
    var gameAction = new GameAction_1.default();
    gameAction.Caster = player;
    gameAction.Type = GameAction_1.GameActionType.MOVE;
    gameAction.Params = req.body.dest;
    try {
        (0, gameController_1.executePlayerAction)(room, gameAction);
    }
    catch (e) {
        res.status(400).send({ message: "couldn't execute action", error: e.message });
    }
    res.status(200).send(room);
});
exports.default = router;
//# sourceMappingURL=gameRoutes.js.map
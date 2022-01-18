"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var roomController_1 = require("../Controllers/roomController");
var GameAction_1 = require("../Domain/GameAction");
var playerController_1 = require("../Controllers/playerController");
var gameController_1 = require("../Controllers/gameController");
var express = require("express");
var router = express.Router();
router.post('/:roomId', function (req, res, next) {
    var room = (0, roomController_1.getRoom)(req.params.roomId);
    var gameAction = new GameAction_1.default();
    gameAction.Caster = (0, playerController_1.getPlayer)(req.body.Caster);
    gameAction.Type = req.body.Type;
    gameAction.Receiver = (0, playerController_1.getPlayer)(req.body.Receiver);
    gameAction.Params = req.body.Params;
    try {
        (0, gameController_1.executePlayerAction)(room, gameAction);
    }
    catch (e) {
        res.status(400).send({ message: "couldn't execute action", error: e.message });
    }
    res.status(200).send(room);
});
exports.default = router;
//# sourceMappingURL=adminGameRoutes.js.map
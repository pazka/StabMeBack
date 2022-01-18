"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var express_validator_1 = require("express-validator");
var playerController_1 = require("../Controllers/playerController");
var authentication_1 = require("../Services/authentication");
var events_1 = require("../Services/events");
var allEvents_1 = require("../Services/Constants/allEvents");
var adminPlayerRoutes_1 = require("./adminPlayerRoutes");
var logger_1 = require("../Services/logger");
var router = express.Router();
router.use('/admin', authentication_1.requireAdmin, adminPlayerRoutes_1.default);
router.get('/me', authentication_1.requirePlayerCreated, function (req, res, next) {
    var session = req.session;
    var playerId = session.playerId;
    var player = (0, playerController_1.getPlayer)(playerId);
    (0, events_1.send)(allEvents_1.default.OBJECT_IS_ACTIVE, playerId);
    res.send(player);
});
router.post('/edit', (0, express_validator_1.body)('name').trim().escape().notEmpty().isLength({ min: 4, max: 25 }), authentication_1.requirePlayerCreated, function (req, res, next) {
    var session = req.session;
    var player = (0, playerController_1.getPlayer)(session.playerId);
    player.Name = req.body.name;
    (0, playerController_1.savePlayer)(player);
    res.send(player);
});
router.post('/create', (0, express_validator_1.body)('name').trim().escape().notEmpty().isLength({ min: 4, max: 25 }), function (req, res, next) {
    var session = req.session;
    if (session.playerId) {
        try {
            var player_1 = (0, playerController_1.getPlayer)(session.playerId);
            return res.send(player_1);
        }
        catch (e) {
            logger_1.default.warn("User tried to get its outdated player");
        }
    }
    if ((0, playerController_1.findPlayer)(req.body.name)) {
        return res.status(403).send("Name already took");
    }
    var player = (0, playerController_1.createPlayer)(req.body.name);
    res.send(player);
});
router.post('/login', (0, express_validator_1.body)('name').trim().escape().notEmpty().isLength({ min: 4, max: 25 }), (0, express_validator_1.body)('playerId').trim().escape().notEmpty(), function (req, res, next) {
    var session = req.session;
    var player;
    try {
        player = (0, playerController_1.getPlayer)(req.body.playerId);
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
    if (session.playerId != player.Id) {
        return res.status(400).send("Bad playerId");
    }
    (0, events_1.send)(allEvents_1.default.OBJECT_IS_ACTIVE, player.Id);
    session.playerId = player.Id;
    res.send(player);
});
exports.default = router;
//# sourceMappingURL=playerRoutes.js.map
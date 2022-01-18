"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var playerController_1 = require("../Controllers/playerController");
var Player_1 = require("../Domain/Player");
var express = require("express");
var router = express.Router();
router.get('/all', function (req, res, next) {
    res.send((0, playerController_1.getAllPlayers)());
});
router.get('/:playerId', function (req, res, next) {
    res.send((0, playerController_1.getPlayer)(req.params.playerId));
});
router.post('/:playerId', function (req, res, next) {
    var _a, _b, _c, _d, _e, _f;
    var player = (0, playerController_1.getPlayer)(req.body.Id);
    if (!player) {
        player = new Player_1.default(req.body.Id);
    }
    player.HP = (_a = req.body.HP) !== null && _a !== void 0 ? _a : player.HP;
    player.Range = (_b = req.body.Range) !== null && _b !== void 0 ? _b : player.Range;
    player.AP = (_c = req.body.AP) !== null && _c !== void 0 ? _c : player.AP;
    player.Name = (_d = req.body.Name) !== null && _d !== void 0 ? _d : player.Name;
    player.Pos = (_e = req.body.Pos) !== null && _e !== void 0 ? _e : player.Pos;
    player.RoomId = (_f = req.body.RoomId) !== null && _f !== void 0 ? _f : player.RoomId;
    res.send((0, playerController_1.savePlayer)(player));
});
exports.default = router;
//# sourceMappingURL=adminPlayerRoutes.js.map
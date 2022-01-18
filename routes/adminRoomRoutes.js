"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var roomController_1 = require("../Controllers/roomController");
var router = express.Router();
router.get('/:roomId', function (req, res, next) {
    res.send((0, roomController_1.getRoom)(req.params.roomId));
});
router.post('/:roomId', function (req, res, next) {
    (0, roomController_1.saveRoom)(req.body);
    res.send("OK");
});
router.get('/all', function (req, res, next) {
    res.send((0, roomController_1.getAllRooms)());
});
exports.default = router;
//# sourceMappingURL=adminRoomRoutes.js.map
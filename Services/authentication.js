"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requirePlayerCreated = exports.requireRoomJoined = exports.requireBodyValidation = void 0;
var roomController_1 = require("../Controllers/roomController");
var env_1 = require("./env");
var playerController_1 = require("../Controllers/playerController");
var express_validator_1 = require("express-validator");
var requireBodyValidation = function (req, res, next) {
    var valRes = (0, express_validator_1.validationResult)(req);
    if (!valRes.isEmpty()) {
        return res.status(400).send((0, express_validator_1.validationResult)(req).array());
    }
    next();
};
exports.requireBodyValidation = requireBodyValidation;
var requireRoomJoined = function (req, res, next) {
    var session = req.session;
    if (!req.params.roomId)
        return res.send(503).send("No room Id found in path to use for requirement");
    if (!session.roomId)
        return res.send(401).send("No room Id found in session to use for requirement");
    if (!session.playerId)
        return res.send(401).send("No playerId found in session to use for requirement");
    var room = (0, roomController_1.getRoom)(session.roomId);
    if (room.Players.findIndex(function (p) { return p.Id == session.playerId; }) < 0)
        return res.send(403).send("Player not in room");
    next();
};
exports.requireRoomJoined = requireRoomJoined;
var requirePlayerCreated = function (req, res, next) {
    var session = req.session;
    if (!session.playerId)
        return res.status(401).send("No playerId found in session to use for requirement");
    try {
        (0, playerController_1.getPlayer)(session.playerId);
    }
    catch (err) {
        return res.status(401).send("Player unknown");
    }
    next();
};
exports.requirePlayerCreated = requirePlayerCreated;
var requireAdmin = function (req, res, next) {
    var auth = { login: (0, env_1.getConfig)("admin.user"), password: (0, env_1.getConfig)("admin.password") };
    var b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    var _a = Buffer.from(b64auth, 'base64').toString().split(':'), login = _a[0], password = _a[1];
    if (!(login && password && login === auth.login && password === auth.password)) {
        res.set('WWW-Authenticate', 'Basic realm="admin"');
        return res.status(401).send('Authentication required.');
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=authentication.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require("multer");
var express = require("express");
var router = express.Router();
var upload = multer({
    dest: "uploads"
});
var avatars = multer({
    dest: "avatars",
    fieldSize: 1024
});
exports.default = router;
//# sourceMappingURL=api.js.map
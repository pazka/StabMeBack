"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = require("./env");
var SimpleNodeLogger = require("simple-node-logger");
var logger = console;
if (!(0, env_1.getConfig)("debug")) {
    var opts = {
        logDirectory: '.',
        fileNamePattern: 'stabmebacklog-<DATE>.log',
        dateFormat: 'YYYY.MM.DD.HH-mm-ss'
    };
    logger = SimpleNodeLogger.createSimpleLogger(opts);
}
exports.default = logger;
//# sourceMappingURL=logger.js.map
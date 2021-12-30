"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var http = require("http");
var httpServer = http.createServer(app);
var cors = require("cors");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var path = require("path");
var api_1 = require("./Services/api");
var sockets = require("./Services/sockets");
var env_1 = require("./Services/env");
app.use(cors({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (env_1["default"].allowedOrigin.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.options('*', cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, 'front/build/')));
app.use('/api', api_1["default"]);
Promise.all([
    sockets.init(httpServer)
]).then(function () {
    httpServer.listen(env_1["default"].PORT, function () {
        console.log('Listening on ' + env_1["default"].PORT);
    });
});
//# sourceMappingURL=index.js.map
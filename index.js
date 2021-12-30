"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var cors = require("cors");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var path = require("path");
var env_1 = require("./Services/env");
(0, env_1.initConfig)(path.join(__dirname, "./env.json"));
var api_1 = require("./Services/api");
var sockets = require("./Services/sockets");
var playerRoutes_1 = require("./routes/playerRoutes");
var roomRoutes_1 = require("./routes/roomRoutes");
var logger_1 = require("./Services/logger");
var gameRoutes_1 = require("./routes/gameRoutes");
var app = express();
var httpServer = http.createServer(app);
app.use(cors({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if ((0, env_1.getConfig)('allowedOrigin').indexOf(origin) === -1) {
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
if ((0, env_1.getConfig)('debug')) {
    var swaggerUi = require('swagger-ui-express');
    var swaggerJSDoc = require('swagger-jsdoc');
    var swaggerSpec = swaggerJSDoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'StabMeBackAPI',
                version: '1.0.0',
            },
        },
        apis: ['./Services/api.ts', './routes/*.ts'],
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use('/', express.static(path.join(__dirname, 'front/build/')));
app.use('/api', api_1.default);
app.use('/player', playerRoutes_1.default);
app.use('/room', roomRoutes_1.default);
app.use('/game', gameRoutes_1.default);
Promise.all([
    sockets.init(httpServer)
]).then(function () {
    httpServer.listen((0, env_1.getConfig)('PORT'), function () {
        logger_1.default.log('Listening on ' + (0, env_1.getConfig)('PORT'));
    });
});
//# sourceMappingURL=index.js.map
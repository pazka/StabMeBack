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
var PORT = (0, env_1.getConfig)('PORT');
var api_1 = require("./Services/api");
var sockets = require("./Services/sockets");
var playerRoutes_1 = require("./routes/playerRoutes");
var roomRoutes_1 = require("./routes/roomRoutes");
var gameRoutes_1 = require("./routes/gameRoutes");
var logger_1 = require("./Services/logger");
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
    var swaggerUi_1 = require('swagger-ui-express');
    var swaggerAutogen = require('swagger-autogen')();
    var doc = {
        info: {
            title: 'My API',
            description: 'Description',
        },
        host: 'localhost:' + 8080,
        schemes: ['http'],
    };
    var filepath_1 = './swagger-doc.json';
    swaggerAutogen(filepath_1, ['./index.js', './routes/*'], doc).then(function () {
        app.use('/api-docs', swaggerUi_1.setup(require(filepath_1)));
    });
}
var session = require('express-session');
var sessionOptions = {
    secret: (0, env_1.getConfig)('session.CookieSecret'),
    cookie: {
        maxAge: (0, env_1.getConfig)('session.TTL')
    },
    saveUninitialized: true,
    resave: true,
    secure: !(0, env_1.getConfig)('debug')
};
app.use(session(sessionOptions));
app.use('/', express.static(path.join(__dirname, 'front/build/')));
app.use('/api', api_1.default);
app.use('/player', playerRoutes_1.default);
app.use('/room', roomRoutes_1.default);
app.use('/game', gameRoutes_1.default);
Promise.all([
    sockets.init(httpServer)
]).then(function () {
    httpServer.listen(PORT, function () {
        logger_1.default.log('Listening on ' + PORT);
    });
});
//# sourceMappingURL=index.js.map
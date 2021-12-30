import * as express from 'express'
import * as http from 'http'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as path from 'path'

import {initConfig,getConfig} from "./Services/env"
initConfig(path.join(__dirname, "./env.json"))

import routes from './Services/api'
import * as sockets from './Services/sockets'
import playerRoutes from "./routes/playerRoutes"
import roomRoutes from "./routes/roomRoutes";
import logger from "./Services/logger";
import gameRoutes from "./routes/gameRoutes";

const app = express()
const httpServer = http.createServer(app);



app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (getConfig('allowedOrigin').indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.options('*', cors())
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('combined'));

if (getConfig('debug')){
    const swaggerUi = require('swagger-ui-express');
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerSpec = swaggerJSDoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'StabMeBackAPI',
                version: '1.0.0',
            },
        },
        apis: ['./Services/api.ts','./routes/*.ts'], // files containing annotations as above
    })
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// @ts-ignore
app.use('/', express.static(path.join(__dirname, 'front/build/')));
app.use('/api', routes)
app.use('/player', playerRoutes)
app.use('/room', roomRoutes)
app.use('/game', gameRoutes)
//websocket

Promise.all([
    sockets.init(httpServer)
]).then(() => {
    httpServer.listen(getConfig('PORT'), () => {
        logger.log('Listening on ' + getConfig('PORT'))
    });
})


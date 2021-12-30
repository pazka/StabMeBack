import * as express from 'express'
import * as http from 'http'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as path from 'path'

import routes from './Services/api'
import * as sockets from './Services/sockets'
import {initConfig,getConfig} from "./Services/env"
import playerRoutes from "./routes/playerRoutes"
import logger from "./Services/logger";

const app = express()
const httpServer = http.createServer(app);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

initConfig(path.join(__dirname, "./env.json"))

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

if (getConfig('debug'))
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// @ts-ignore
app.use('/', express.static(path.join(__dirname, 'front/build/')));


app.use('/api', routes)
app.use('/player', playerRoutes)
//websocket

Promise.all([
    sockets.init(httpServer)
]).then(() => {
    httpServer.listen(getConfig('PORT'), () => {
        logger.log('Listening on ' + getConfig('PORT'))
    });
})


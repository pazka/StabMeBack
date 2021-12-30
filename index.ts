import * as express from 'express'
import * as http from 'http'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as path from 'path'

import {initConfig,getConfig} from "./Services/env"
initConfig(path.join(__dirname, "./env.json"))

const PORT = getConfig('PORT')
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
    
    const swaggerAutogen = require('swagger-autogen')();

    const doc = {
        info: {
            title: 'My API',
            description: 'Description',
        },
        host: 'localhost:'+8080,
        schemes: ['http'],
    };
    const filepath = './swagger-doc.json'

    swaggerAutogen(filepath, ['./index.js','./routes/*'], doc).then(()=>{
        app.use('/api-docs', swaggerUi.setup(require(filepath)));
    })
}

let session = require('express-session');
let sessionOptions = {
    secret: getConfig('session.CookieSecret'),
    cookie: {
        maxAge:getConfig('session.TTL')
    },
    saveUninitialized: true,
    resave:true,
    secure : !getConfig('debug')
};

app.use(session(sessionOptions));

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
    httpServer.listen(PORT, () => {
        logger.log('Listening on ' + PORT)
    });
})


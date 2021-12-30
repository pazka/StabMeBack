import {SessionData} from "express-session";
import session = require("express-session");

export default interface IClientSession extends SessionData{
    playerId : string;
    roomId : string;
    cookie: session.Cookie;
}
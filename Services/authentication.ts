import {getRoom} from "../Controllers/roomController";
import Room from "../Domain/Room";
import {Request} from "express-serve-static-core";
import {NextFunction, Response} from "express";
import IClientSession from "./Constants/IClientSession";
import {getConfig} from "./env";
import {getPlayer} from "../Controllers/playerController";

export const requireRoomJoined = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const session: IClientSession = req.session

    if (!req.params.roomId)
        return res.send(503).send("No room Id found in path to use for requirement")

    if (!session.roomId)
        return res.send(401).send("No room Id found in session to use for requirement")

    if (!session.playerId)
        return res.send(401).send("No playerId found in session to use for requirement")

    const room: Room = getRoom(session.roomId)
    if (room.Players.findIndex(p => p.Id == session.playerId) < 0)
        return res.send(403).send("Player not in room")

    next()
}

export const requirePlayerCreated= (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const session: IClientSession = req.session
    
    if (!session.playerId)
        return res.status(401).send("No playerId found in session to use for requirement")
    
    try{
        getPlayer(session.playerId)
    }catch(err){
        return res.status(401).send("Player unknown")
    }

    next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = {login: getConfig("admin.user"), password: getConfig("admin.password")}

    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    if (!(login && password && login === auth.login && password === auth.password)) {
        res.set('WWW-Authenticate', 'Basic realm="admin"') // change this
        return res.status(401).send('Authentication required.') // custom message
    }

    next()
}
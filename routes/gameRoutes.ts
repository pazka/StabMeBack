import {requireAdmin, requirePlayerCreated, requireRoomJoined} from "../Services/authentication";
import {getPlayer} from "../Controllers/playerController";
import Player from "../Domain/Player";
import Room from "../Domain/Room";
import IClientSession from "../Services/Constants/IClientSession";
import GameAction, {GameActionType} from "../Domain/GameAction";
import {executePlayerAction} from "../Controllers/gameController";
import {body} from "express-validator";
import {getRoom} from "../Controllers/roomController";
import * as express from "express";
import adminGameRoutes from "./adminGameRoutes";

const router = express.Router()

router.use('/admin',requireAdmin,adminGameRoutes)

router.post('/shoot',
    requirePlayerCreated,
    requireRoomJoined,
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player: Player = getPlayer(session.playerId)
        const room: Room = getRoom(session.roomId)

        const gameAction: GameAction = new GameAction()
        gameAction.Caster = player
        gameAction.Type = GameActionType.SHOOT

        //getting params
        gameAction.Receiver = getPlayer(req.body.targetId)
        gameAction.Params = req.body.amount ?? 1

        try {
            executePlayerAction(room, gameAction)
        }catch (e) {
            res.status(400).send({message : "couldn't execute action" , error : e.message})
        }
        res.status(200).send(room)
    }
)

router.post('/give',
    requirePlayerCreated,
    requireRoomJoined,
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player: Player = getPlayer(session.playerId)
        const room: Room = getRoom(session.roomId)

        const gameAction: GameAction = new GameAction()
        gameAction.Caster = player
        gameAction.Type = GameActionType.GIVE_AP

        //getting params
        gameAction.Receiver = getPlayer(req.body.targetId)
        gameAction.Params = req.body.amount ?? 1

        try {
            executePlayerAction(room, gameAction)
        }catch (e) {
            res.status(400).send({message : "couldn't execute action" , error : e.message})
        }
        res.status(200).send(room)
    }
)

router.post('/upgrade',
    requirePlayerCreated,
    requireRoomJoined,
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player: Player = getPlayer(session.playerId)
        const room: Room = getRoom(session.roomId)

        const gameAction: GameAction = new GameAction()
        gameAction.Caster = player
        gameAction.Type = GameActionType.UPGRADE

        //getting params
        gameAction.Params = req.body.amount ?? 1

        try {
            executePlayerAction(room, gameAction)
        }catch (e) {
            res.status(400).send({message : "couldn't execute action" , error : e.message})
        }
        res.status(200).send(room)
    }
)

router.post('/move',
    requirePlayerCreated,
    requireRoomJoined,
    body("dest").isArray({min: 2, max: 2}),
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player: Player = getPlayer(session.playerId)
        const room: Room = getRoom(session.roomId)

        const gameAction: GameAction = new GameAction()
        gameAction.Caster = player
        gameAction.Type = GameActionType.MOVE

        //getting params
        gameAction.Params = req.body.dest
        
        try {
            executePlayerAction(room, gameAction)
        }catch (e) {
            res.status(400).send({message : "couldn't execute action" , error : e.message})
        }
        res.status(200).send(room)
    }
)

export default router
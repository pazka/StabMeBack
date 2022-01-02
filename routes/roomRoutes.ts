import * as express from "express";
import {sub} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {addPlayerToRoom, triggerRoomApDrop} from "../Controllers/gameController";
import {createRoom, getAllRooms, getRoom, removeRoom} from "../Controllers/roomController";
import {body, check} from "express-validator";
import Room from "../Domain/Room";
import {requireAdmin, requireBodyValidation, requirePlayerCreated, requireRoomJoined} from "../Services/authentication";
import IClientSession from "../Services/Constants/IClientSession";
import {getPlayer} from "../Controllers/playerController";
import Player from "../Domain/Player";
import {getConfig} from "../Services/env";
import adminRoomRoutes from "./adminRoomRoutes";

const router = express.Router()

router.get('/admin', requireAdmin, adminRoomRoutes)

router.get('/all', (req, res, next) => {
    res.send(getAllRooms().map((room: Room) => (room.toShallow())))
})

router.post('/create',
    requirePlayerCreated,
    check('password').default('').trim().escape().isLength({min : 0 , max : 30}).withMessage('Must be less than 30 chars'),
    check("name").trim().escape().isLength({min : 5 , max : 50}).withMessage('Must be between 5 and 50 chars'),
    check('dropInterval').default(getConfig("DefaultValues.APDropInterval")).isInt({min : 1,max : 7*24*60}).withMessage('Must be 1 < x < 7*24*60'),
    check('dropAmount').default(getConfig("DefaultValues.APDropAmount")).isInt({min : 1, max : 1000}).withMessage('Must be 1 < x < 1000'),
    check('startAP').default(getConfig("DefaultValues.startAP")).isInt({min : 0, max : 1000}).withMessage('Must be 0 < x < 1000'),
    check('startHP').default(getConfig("DefaultValues.startHP")).isInt({min : 1, max : 1000}).withMessage('Must be 1 < x < 1000'),
    check('startRange').default(getConfig("DefaultValues.startRange")).isInt({min : 0, max : 1000}).withMessage('Must be 0 < x < 1000'),
    check('maxPlayers').default(getConfig("DefaultValues.maxPlayers")).isInt({min : 2, max : 20}).withMessage('Must be 2 < x < 20'),
    check('roomSize').default(getConfig("DefaultValues.roomSize")).isInt({min : 2, max : 1000}).withMessage('Must be 2 < x < 1000'),
    requireBodyValidation,
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player = getPlayer(session.playerId)
        try {
            const room = createRoom(
                req.body.password,
                req.body.name,
                req.body.dropInterval,
                req.body.dropAmount,
                req.body.startAP,
                req.body.startHP,
                req.body.startRange,
                req.body.maxPlayers,
                req.body.roomSize)
            room.Creator = player
            return res.send(room)
        } catch (err) {
            return res.status(403).send(err.message)
        }
    }
)

router.delete('/:roomId',
    requirePlayerCreated,
    (req, res, next) => {
        let room: Room = getRoom(req.params.roomId)
        
        // @ts-ignore
        const session: IClientSession = req.session
        const player = getPlayer(session.playerId)

        if(room.Creator.Id != player.Id){
            return res.status(403).send({message: "Only the creator of the room can remove it"})
        }
        
        try {
            removeRoom(room.Id)
        } catch (err) {
            return res.status(400).send({message: "Error removing room", error: err.message})
        }
        
        res.send("OK")
    }
)

router.post('/join/:roomId',
    body('password').default('').trim().escape(),
    (req, res, next) => {
        let room: Room
        let player: Player
        // @ts-ignore
        const session: IClientSession = req.session

        try {
            room = getRoom(req.params.roomId)
        } catch (err) {
            return res.status(403).send({message: "Room don't exist", error: err.message})
        }

        if (!session.playerId) {
            return res.status(400).send({message: "No playerId in cookie, please create a player", error: null})
        }

        try {
            player = getPlayer(session.playerId)
        } catch (err) {
            return res.status(401).send({message: "Error when getting player", error: err.message})
        }

        try {
            addPlayerToRoom(room, player, req.body.password)
        } catch (err) {
            return res.status(403).send({message: "Couldn't join room", error: err.message})
        }

        // @ts-ignore
        session.roomId = room.Id
        res.send(room)
    }
)

router.get('/:roomId',
    requireRoomJoined,
    (req, res, next) => {
        let room: Room

        try {
            room = getRoom(req.params.roomId)
        } catch (err) {
            return res.status(403).send(err.message)
        }

        res.send(room)
    }
)

// @ts-ignore
sub(internal_events.ROOM_AP_DROP, (data: IEventApDrop) => {
    triggerRoomApDrop(data.room, data.room.APDropAmount)
})

export default router
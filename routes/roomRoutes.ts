import * as express from "express";
import {sub} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {addPlayerToRoom, triggerRoomApDrop} from "../Controllers/gameController";
import {createRoom, getAllRooms, getRoom, removeRoom} from "../Controllers/roomController";
import {body} from "express-validator";
import Room from "../Domain/Room";
import {requireAdmin, requirePlayerCreated, requireRoomJoined} from "../Services/authentication";
import IClientSession from "../Services/Constants/IClientSession";
import {getPlayer} from "../Controllers/playerController";
import Player from "../Domain/Player";
import {getConfig} from "../Services/env";
import adminRoomRoutes from "./adminRoomRoutes";

const router = express.Router()

router.get('/admin', requireAdmin, adminRoomRoutes)

router.get('/all', (req, res, next) => {
    res.send(getAllRooms().map((room: Room) => ({
        Id: room.Id,
        NbPlayers: room.Players.length,
        MaxPlayers: room.MaxPlayers,
        DateCreated: room.DateCreated,
        PasswordProtected : room.Password != ""
    })))
})

router.post('/create',
    requirePlayerCreated,
    body('password').default('').trim().escape(),
    body('dropInterval').default(getConfig("DefaultValues.APDropInterval")).isNumeric(),
    body('dropAmount').default(getConfig("DefaultValues.APDropAmount")).isNumeric(),
    body('startAP').default(getConfig("DefaultValues.startAP")).isNumeric(),
    body('startHP').default(getConfig("DefaultValues.startHP")).isNumeric(),
    body('startRange').default(getConfig("DefaultValues.startRange")).isNumeric(),
    body('maxPlayers').default(getConfig("DefaultValues.maxPlayers")).isNumeric(),
    body('roomSize').default(getConfig("DefaultValues.roomSize")).isNumeric(),
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player = getPlayer(session.playerId)
        try {
            const room = createRoom(
                req.body.password,
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
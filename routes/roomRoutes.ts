import * as express from "express";
import {send, sub} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {addPlayerToRoom, triggerRoomApDrop} from "../Controllers/gameController";
import {createRoom, getAllRooms, getRoom} from "../Controllers/roomController";
import {body} from "express-validator";
import Room from "../Domain/Room";
import {requireAdmin, requireRoomJoined} from "../Services/authentication";
import IClientSession from "../Services/Constants/IClientSession";
import {getPlayer} from "../Controllers/playerController";
import Player from "../Domain/Player";

const router = express.Router()


router.get('/:roomId/admin',
    requireAdmin,
    (req, res, next) => {
        res.send(getRoom(req.params.roomId))
    }
)


router.get('/all',
    requireAdmin,
    (req, res, next) => {
        res.send(getAllRooms())
    }
)


router.post('/create',
    body('password').default('').trim().escape(),
    body('propInterval').default(3).trim().escape().isNumeric(),
    (req, res, next) => {
        try {
            const room = createRoom(req.body.password, req.body.propInterval)
            res.send(room)
        } catch (err) {
            res.status(403).send(err)
        }
    }
)


router.post('/:roomId/join',
    body('password').default('').trim().escape(),
    (req, res, next) => {
        let room: Room
        let player: Player
        // @ts-ignore
        const session: IClientSession = req.session

        try {
            room = getRoom(req.params.roomId)
        } catch (err) {
            return res.status(403).send({message: "Room don't exist", error: err})
        }

        if (!session.playerId) {
            return res.status(400).send({message: "No playerId in cookie, please create a player", error: null})
        }

        try {
            player = getPlayer(session.playerId)
        } catch (err) {
            return res.status(403).send({message: "Error when getting player", error: err})
        }

        try {
            addPlayerToRoom(room, player, req.body.password)
        } catch (err) {
            return res.status(403).send({message: "Couldn't join room", error: err})
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
            return res.status(403).send(err)
        }

        res.send(room)
    }
)

// @ts-ignore
sub(internal_events.ROOM_AP_DROP, (data: IEventApDrop) => {
    triggerRoomApDrop(data.room, data.room.APDropNb)
    send(internal_events.ROOM_UPDATED, data.room)
})

export default router
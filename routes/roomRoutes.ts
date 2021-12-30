import * as express from "express";
import * as playerController from "../Controllers/playerController";
import Player from "../Domain/Player";
import IClientSession from "../Services/Constants/IClientSession";
import {send, sub} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import {triggerRoomApDrop} from "../Controllers/gameController";

const {check} = require('express-validator');
const router = express.Router()

router.use('/action', (req, res, next) => {
    const session: IClientSession = req.session
    const roomId: string = session.roomId

    let player: Player = playerController.getPlayer(roomId)
    if (!player)
        return res.status(404).send("roomId doesn't exist")

    next()
})


sub(internal_events.ROOM_AP_DROP, (data: IEventApDrop) => {
    triggerRoomApDrop(data.room, data.room.APDropNb)
    send(internal_events.ROOM_UPDATED, data.room)
})


export default router
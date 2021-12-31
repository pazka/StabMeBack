﻿import * as express from "express";
import IClientSession from "../Services/Constants/IClientSession";
import Player from "../Domain/Player";
import {body} from "express-validator";
import {createPlayer, findPlayer, getAllPlayers, getPlayer, savePlayer} from "../Controllers/playerController";
import {requireAdmin, requirePlayerCreated} from "../Services/authentication";
import Room from "../Domain/Room";
import {getAllRooms, getRoom} from "../Controllers/roomController";
import {send} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import adminPlayerRoutes from "./adminPlayerRoutes";

const router = express.Router()

router.use('/admin',adminPlayerRoutes)

router.get('/me', requirePlayerCreated,(req, res, next) => {
    // @ts-ignore
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = getPlayer(playerId)

    send(internal_events.OBJECT_IS_ACTIVE,playerId)
    res.send(player)
})

router.post('/create',
    body('name').trim().escape().notEmpty().isLength({min: 4, max: 25}),
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        if (findPlayer(req.body.name)) {
            return res.status(403).send("Name already took")
        }

        let player: Player = createPlayer(req.body.name)
        session.playerId = player.Id

        res.send(player)
    })



router.post('/login',
    body('name').trim().escape().notEmpty().isLength({min: 4, max: 25}),
    body('playerId').trim().escape().notEmpty(),
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        let player: Player

        try {
            player = getPlayer(req.body.playerId)
        } catch (err) {
            return res.status(400).send(err.message)
        }

        if (session.playerId != player.Id) {
            return res.status(400).send("Bad playerId")
        }

        send(internal_events.OBJECT_IS_ACTIVE,player.Id)
        session.playerId = player.Id
        res.send(player)
    })


export default router
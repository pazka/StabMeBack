import * as express from "express";
import IClientSession from "../Services/Constants/IClientSession";
import Player from "../Domain/Player";
import {body} from "express-validator";
import {createPlayer, findPlayer, getPlayer, savePlayer} from "../Controllers/playerController";
import {requireAdmin, requirePlayerCreated} from "../Services/authentication";
import {send} from "../Services/events";
import internal_events from "../Services/Constants/allEvents";
import adminPlayerRoutes from "./adminPlayerRoutes";
import logger from "../Services/logger";

const router = express.Router()

router.use('/admin', requireAdmin, adminPlayerRoutes)

router.get('/me', requirePlayerCreated, (req, res, next) => {
    // @ts-ignore
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = getPlayer(playerId)

    send(internal_events.OBJECT_IS_ACTIVE, playerId)
    res.send(player)
})

router.post('/edit',
    body('name').trim().escape().notEmpty().isLength({min: 4, max: 25}),
    requirePlayerCreated,
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        const player: Player = getPlayer(session.playerId)

        player.Name= req.body.name
        savePlayer(player)
        
        res.send(player)
    })

router.post('/create',
    body('name').trim().escape().notEmpty().isLength({min: 4, max: 25}),
    (req, res, next) => {
        // @ts-ignore
        const session: IClientSession = req.session
        if (session.playerId) {
            try {
                const player: Player = getPlayer(session.playerId)
                return res.send(player)
            } catch (e) {
                logger.warn("User tried to get its outdated player")
            }
        }

        if (findPlayer(req.body.name)) {
            return res.status(403).send("Name already took")
        }

        let player: Player = createPlayer(req.body.name)

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

        send(internal_events.OBJECT_IS_ACTIVE, player.Id)
        session.playerId = player.Id
        res.send(player)
    })


export default router
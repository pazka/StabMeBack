import * as express from "express";
import * as playerController from "../Controllers/playerController";
import IClientSession from "../Services/Constants/IClientSession";
import Player from "../Domain/Player";

const {check} = require('express-validator');
const router = express.Router()

router.use('/action', (req, res, next) => {
    const session: IClientSession = req.session
    const playerId: string = session.playerId

    let player: Player = playerController.getPlayer(playerId)
    if (!player)
        return res.status(404).send("player doesn't exist")

    next()
})

router.get('me', (req, res, next) => {
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = playerController.getPlayer(playerId)

    res.send(player)
})

router.post('action/shoot', (req, res, next) => {
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = playerController.getPlayer(playerId)

    res.send(player)
})

router.post('action/move', (req, res, next) => {
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = playerController.getPlayer(playerId)

    res.send(player)
})

router.post('action/upgrade', (req, res, next) => {
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = playerController.getPlayer(playerId)

    try {
        player = playerController.tryUpgradePlayer(player)
    } catch (e) {
        return res.status(402).send(e)
    }

    res.send(player)
})

router.post('action/give', (req, res, next) => {
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = playerController.getPlayer(playerId)

    res.send(player)
})

export default router
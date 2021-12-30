import * as express from "express";
import IClientSession from "../Services/Constants/IClientSession";
import Player from "../Domain/Player";
import {body} from "express-validator";
import {createPlayer, findPlayer, getAllPlayers, getPlayer, savePlayer} from "../Controllers/playerController";
import {requireAdmin, requirePlayerCreated} from "../Services/authentication";
import Room from "../Domain/Room";
import {getAllRooms, getRoom} from "../Controllers/roomController";

const router = express.Router()

router.get('/me', requirePlayerCreated,(req, res, next) => {
    // @ts-ignore
    const session: IClientSession = req.session
    const playerId: string = session.playerId
    let player: Player = getPlayer(playerId)

    res.send(player)
})

router.get('/:playerId/admin',
    requireAdmin,
    (req, res, next) => {
        res.send(getPlayer(req.params.playerId))
    }
)

router.post('/:playerId/admin/edit',
    requireAdmin,
    (req, res, next) => {
        let player : Player = getPlayer(req.body.Id)      
        if(!player){
            player = new Player(req.body.Id)
        }
        player.HP = req.body.HP ?? player.HP
        player.Range = req.body.Range ?? player.Range
        player.AP = req.body.AP ?? player.AP
        player.Name = req.body.Name ?? player.Name
        player.Pos = req.body.Pos ?? player.Pos
        player.RoomId = req.body.RoomId ?? player.RoomId
        
        res.send(savePlayer(player))
        return player
    }
)



router.get('/all',
    requireAdmin,
    (req, res, next) => {
        res.send(getAllPlayers())
    }
)

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
            return res.status(400).send(err)
        }

        if (session.playerId != player.Id) {
            return res.status(400).send("Bad playerId")
        }

        session.playerId = player.Id
        res.send(player)
    })


export default router
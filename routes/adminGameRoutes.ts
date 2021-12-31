import {requireAdmin} from "../Services/authentication";
import Room from "../Domain/Room";
import {getRoom} from "../Controllers/roomController";
import GameAction from "../Domain/GameAction";
import {getPlayer} from "../Controllers/playerController";
import {executePlayerAction} from "../Controllers/gameController";
import * as express from "express";

const router = express.Router()

router.post('/:roomId',
    (req, res, next) => {
        // @ts-ignore
        const room: Room = getRoom(req.params.roomId)

        const gameAction: GameAction = new GameAction()
        gameAction.Caster = getPlayer(req.body.Caster)
        gameAction.Type = req.body.Type
        gameAction.Receiver = getPlayer(req.body.Receiver)
        gameAction.Params = req.body.Params

        try {
            executePlayerAction(room, gameAction)
        }catch (e) {
            res.status(400).send({message : "couldn't execute action" , error : e.message})
        }
        res.status(200).send(room)
    }
)

export default router
import {requireAdmin} from "../Services/authentication";
import {getAllPlayers, getPlayer, savePlayer} from "../Controllers/playerController";
import Player from "../Domain/Player";
import * as express from "express";
const router = express.Router()

router.use('/*',requireAdmin)

router.get('/all',(req, res, next) => {
        res.send(getAllPlayers())
    }
)

router.get('/:playerId',(req, res, next) => {
        res.send(getPlayer(req.params.playerId))
    }
)

router.post('/:playerId',(req, res, next) => {
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
    }
)

export default router
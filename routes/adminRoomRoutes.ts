import * as express from "express";
import {requireAdmin} from "../Services/authentication";
import {getAllRooms, getRoom, saveRoom} from "../Controllers/roomController";

const router = express.Router()

router.get('/:roomId',
    (req, res, next) => {
        res.send(getRoom(req.params.roomId))
    }
)

router.post('/:roomId',
    (req, res, next) => {
        saveRoom(req.body)
        res.send("OK")
    }
)

router.get('/all',
    (req, res, next) => {
        res.send(getAllRooms())
    }
)

export default router

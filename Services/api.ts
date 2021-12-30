import * as path from "path";

const multer = require("multer");
import * as express from 'express'

const router = express.Router()

import {isFormatValid, validFormats, writeFile} from "../Controllers/fileController";
import * as itemController from '../Controllers/itemController'


const upload = multer({
    dest: "uploads"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

const avatars = multer({
    dest: "avatars",
    fieldSize: 1024
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


/* name attribute of <file> element in your form 
router.post("/upload", upload.single("file" ),
    (req: any, res: any) => {
        writeFile(req.file.originalname, req.params.roomId, req.params.layerId, req.file.path).then(r => {
            res
                .sendStatus(200)
        }).catch(err => {
            res
                .status(403)
                .send({message: err});
        })
    }
)
*/

export default router
import * as fs from "fs";
import * as path from "path";


export const validFormats = [
    ".png", ".jpg", ".jpeg", ".svg"
]

export function isFormatValid(format: string) {
    if (!format)
        return false

    return validFormats.includes(format.toLowerCase())
}

export function writeFile(originalName: string, roomId: string, layerId: string, tempPath: string) {
    return new Promise((resolve,reject)=>{
        const targetFolder = path.join(__dirname, `../front/build/uploads/${roomId}`);

        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, {recursive: true});
        }

        //check format
        const fileExt = path.extname(originalName)

        if (!isFormatValid(fileExt)) {
            fs.unlink(tempPath, (err: any) => {
                if (err)
                    return reject(err)

                return reject(`Only ${validFormats.join(', ')} files are allowed!`);
            })
        }

        //move tmp file to public folder
        const targetPath = path.join(targetFolder, `${originalName}`);

        fs.rename(tempPath, targetPath, (err: any) => {
            if (err)
                return reject(err)

            /**
             * ACTION TO DO at the end of the upload
             */
        });
    })
}
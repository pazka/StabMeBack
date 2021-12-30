import * as fs from 'fs'
import * as path from "path";

let env = {}
let fullEnv

export function initConfig(filepath : string){
    // @ts-ignore
    let fullEnv : any = JSON.parse(fs.readFileSync(filepath) )

    console.log("Environment : " + ((process.argv[2].toLowerCase() == "dev") ? "DEV" : "PROD"))

    env = fullEnv[(process.argv[2].toLowerCase() == "dev") ? "DEV" : "PROD"]
    return env
}

export function getConfig(key : string = null){
    if (key.trim() != "" && key.match('(\w\.?)*').length == 0)
        throw "Key invalid, must in the format 'key1.key2...' or be null"
        
    let tmpEnv : any = env
    key.split('.').forEach(k=>{
        if(!Object.keys(tmpEnv).includes(k))
            throw `${k} not found in current env`
        
        tmpEnv = tmpEnv[k]
    })
    
    return tmpEnv
}
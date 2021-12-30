import * as fs from 'fs'

let env = {}
let fullEnv

export function initConfig(filepath: string) {
    // @ts-ignore
    let fullEnv: any = JSON.parse(fs.readFileSync(filepath))

    console.log("Environment : " + ((process.argv[2].toLowerCase() == "dev") ? "DEV" : "PROD"))

    env = fullEnv[(process.argv[2].toLowerCase() == "dev") ? "DEV" : "PROD"]
    env = parseEnvironmentVars(env)

    return env
}

function parseEnvironmentVars(env: any) {
    Object.keys(env).forEach(key => {
        if (typeof env[key] == "object" && !Array.isArray(env[key])) {
            env[key] = parseEnvironmentVars(env[key])
        }
        if (typeof env[key] == "string" && env[key].match(/^\${(.*)}$/)) {
            const envVarName = env[key].match(/^\${(.*)}$/)[0]
            if (!Object.keys(process.env).includes(envVarName)) {
                throw `${envVarName} not found in environment variables`
            } else {
                env[key] = process.env[envVarName]
            }
        }
    })

    return env
}

export function getConfig(key: string = '') {
    if (key.trim() != "" && !key.match(/(\w\.?)*/))
        throw "Key invalid, must in the format 'key1.key2...' or be null"

    let tmpEnv: any = env

    if(key.trim() == "")
        return tmpEnv
    
    key.split('.').forEach(k => {
        
        if (!Object.keys(tmpEnv).includes(k))
            throw `${k} not found in current env`

        tmpEnv = tmpEnv[k]
    })

    return tmpEnv
}
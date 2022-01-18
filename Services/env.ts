import * as fs from 'fs'

let env = {}
let fullEnv

export function initConfig(filepath: string) {
    // @ts-ignore
    let fullEnv: any = JSON.parse(fs.readFileSync(filepath))

    const isDevEnvDefault = process.argv.find(p => p.toLowerCase() == "dev") || fullEnv.currentConfig == "DEV"
    console.log("Environment : " + isDevEnvDefault ? "DEV" : "PROD")

    env = fullEnv[isDevEnvDefault ? "DEV" : "PROD"]
    env = parseEnvironmentVars(env)

    return env
}

function parseEnvironmentVar(envVarName : any) {
    if (!Object.keys(process.env).includes(envVarName)) {
        throw new Error(`${envVarName} not found in environment variables`)
    }

    return process.env[envVarName]
}

function parseEnvironmentVars(env: any) {
    Object.keys(env).forEach(key => {
        if (typeof env[key] == "object" && !Array.isArray(env[key])) {
            env[key] = parseEnvironmentVars(env[key])
        }
        if (typeof env[key] == "string" && env[key].match(/^\${(.*)}$/)) {
            const envVarName = env[key].match(/^\${(.*)}$/)[0]
            if (!Object.keys(process.env).includes(envVarName)) {
                throw new Error(`${envVarName} not found in environment variables`)
            }
            
            env[key] = parseEnvironmentVar(envVarName)
        }
    })

    return env
}

export function getConfig(key: string = '') {
    if (key.trim() != "" && !key.match(/(\w\.?)*/))
        throw new Error(`Key invalid, must in the format 'key1.key2...' or be null`)

    let tmpEnv: any = env

    if(key.trim() == "")
        return tmpEnv
    
    key.split('.').forEach(k => {
        
        if (!Object.keys(tmpEnv).includes(k))
            throw new Error(`${k} not found in current env`)

        tmpEnv = tmpEnv[k]
    })

    return tmpEnv
}
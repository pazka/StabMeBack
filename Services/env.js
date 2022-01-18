"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.initConfig = void 0;
var fs = require("fs");
var env = {};
var fullEnv;
function initConfig(filepath) {
    var fullEnv = JSON.parse(fs.readFileSync(filepath));
    var isDevEnvDefault = process.argv.find(function (p) { return p.toLowerCase() == "dev"; }) || fullEnv.currentConfig == "DEV";
    console.log("Environment : " + isDevEnvDefault ? "DEV" : "PROD");
    env = fullEnv[isDevEnvDefault ? "DEV" : "PROD"];
    env = parseEnvironmentVars(env);
    return env;
}
exports.initConfig = initConfig;
function parseEnvironmentVar(envVarName) {
    if (!Object.keys(process.env).includes(envVarName)) {
        throw new Error("".concat(envVarName, " not found in environment variables"));
    }
    return process.env[envVarName];
}
function parseEnvironmentVars(env) {
    Object.keys(env).forEach(function (key) {
        if (typeof env[key] == "object" && !Array.isArray(env[key])) {
            env[key] = parseEnvironmentVars(env[key]);
        }
        if (typeof env[key] == "string" && env[key].match(/^\${(.*)}$/)) {
            var envVarName = env[key].match(/^\${(.*)}$/)[0];
            if (!Object.keys(process.env).includes(envVarName)) {
                throw new Error("".concat(envVarName, " not found in environment variables"));
            }
            env[key] = parseEnvironmentVar(envVarName);
        }
    });
    return env;
}
function getConfig(key) {
    if (key === void 0) { key = ''; }
    if (key.trim() != "" && !key.match(/(\w\.?)*/))
        throw new Error("Key invalid, must in the format 'key1.key2...' or be null");
    var tmpEnv = env;
    if (key.trim() == "")
        return tmpEnv;
    key.split('.').forEach(function (k) {
        if (!Object.keys(tmpEnv).includes(k))
            throw new Error("".concat(k, " not found in current env"));
        tmpEnv = tmpEnv[k];
    });
    return tmpEnv;
}
exports.getConfig = getConfig;
//# sourceMappingURL=env.js.map
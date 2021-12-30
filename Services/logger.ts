import {getConfig} from "./env";
import * as SimpleNodeLogger from 'simple-node-logger'

let logger = console

if(!getConfig("debug")){
    // create a custom timestamp format for log statements
    const opts = {
        logDirectory:'.', // NOTE: folder must exist and be writable...
        fileNamePattern:'stabmebacklog-<DATE>.log',
        dateFormat:'YYYY.MM.DD.HH-mm-ss'
    };
    // @ts-ignore
    logger = SimpleNodeLogger.createSimpleLogger( opts );
}

export default logger
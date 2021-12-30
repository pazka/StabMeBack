import env from "./env";
const SimpleNodeLogger = require('simple-node-logger')

let logger = console

if(!env["debug"]){
    // create a custom timestamp format for log statements
    const opts = {
        logDirectory:'.', // NOTE: folder must exist and be writable...
        fileNamePattern:'stabmebacklog-<DATE>.log',
        dateFormat:'YYYY.MM.DD.HH-mm-ss'
    };
    logger = SimpleNodeLogger.createSimpleLogger( opts );
}

export default logger
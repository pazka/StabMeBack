"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = exports.sub = void 0;
var allSubscriptions = {};
function sub(name, cb) {
    if (!Object.keys(allSubscriptions).includes(name)) {
        allSubscriptions[name] = [];
    }
    allSubscriptions[name].push(cb);
}
exports.sub = sub;
function send(name, data) {
    if (name !== allSubscriptions.MOUSE_ACTION) {
        console.group("[".concat(name, "]"));
        console.log(data);
        console.groupEnd();
    }
    if (!Object.keys(allSubscriptions).includes(name)) {
        allSubscriptions[name] = [];
    }
    if (Object.keys(allSubscriptions).includes(name)) {
        allSubscriptions[name].forEach(function (cb) { return cb(data); });
    }
}
exports.send = send;
//# sourceMappingURL=events.js.map
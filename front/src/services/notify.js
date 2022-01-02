import {On, send} from "./events";

export function notifySuccess(message, options = {}) {
    send(On.ui_notify,{message: message, options: {variant: "success", ...options}})
}

export function notifyError(message, options = {}) {
    send(On.ui_notify,{message: message, options: {variant: "error", ...options}})
}

export function notify(message, options = {}) {
    send(On.ui_notify,{message: message, options: options})
}

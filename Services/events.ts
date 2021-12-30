import internal_events from "./Constants/allEvents";

export function sub(name: string, cb: Function) {
    if (!Object.keys(internal_events).includes(name)) {
        internal_events[name] = []
    }

    internal_events[name].push(cb)
}

export function send(name: string, data: any) {
    if (name !== internal_events.MOUSE_ACTION) {
        console.group(`[${name}]`)
        console.log(data)
        console.groupEnd()
    }

    if (!Object.keys(internal_events).includes(name)) {
        internal_events[name] = []
    }

    if (Object.keys(internal_events).includes(name)) {
        internal_events[name].forEach((cb: Function) => cb(data))
    }
}
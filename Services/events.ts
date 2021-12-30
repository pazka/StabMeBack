let allSubscriptions : any = {} 

export function sub(name: string, cb: Function) {
    if (!Object.keys(allSubscriptions).includes(name)) {
        allSubscriptions[name] = []
    }

    allSubscriptions[name].push(cb)
}

export function send(name: string, data: any) {
    if (name !== allSubscriptions.MOUSE_ACTION) {
        console.group(`[${name}]`)
        console.log(data)
        console.groupEnd()
    }

    if (!Object.keys(allSubscriptions).includes(name)) {
        allSubscriptions[name] = []
    }

    if (Object.keys(allSubscriptions).includes(name)) {
        allSubscriptions[name].forEach((cb: Function) => cb(data))
    }
}
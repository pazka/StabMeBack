import * as persist from 'node-persist'
import { send} from "./events";
import internal_events from "./Constants/allEvents";

let ready = false

let isDequeuingJobs = false
let jobQueue: Function[] = []

function recursivelyExecJobStack(nbFnToExec: number) {
    if (nbFnToExec == 0) {
        isDequeuingJobs = false
        return;
    }

    jobQueue.splice(0, 1)[0]().then(() => recursivelyExecJobStack(nbFnToExec - 1))
}

const operationWorker = setInterval(() => {
    if (jobQueue.length > 0 && !isDequeuingJobs) {
        isDequeuingJobs = true
        recursivelyExecJobStack(jobQueue.length)
    }
}, 1)

async function safeOperation(cb: Function) {
    if (!ready) {
        await persist.init({})
        ready = true
    }

    jobQueue.push(cb)
}

async function safeSet(id: string, data: any) {
    return new Promise(resolve => {
        safeOperation(() => persist.setItem(id, data).then(resolve))
    })
}

async function safeGet(id: string) {
    return new Promise(resolve => {
        safeOperation(() => persist.getItem(id).then(resolve))
    })
}


async function safeRemove(id: string) {
    return new Promise(resolve => {
        safeOperation(() => persist.removeItem(id).then(resolve))
    })
}


export async function saveItem(item: any) {
    try {
        return await safeSet('item-' + item.id, item)
    } catch (e) {
        send(internal_events.ERROR, e)
    }
}

export async function getItem(item: any) {
    return await safeGet('item-' + item.id)
}

export async function removeItem(id: string) {
    return await safeRemove(id)
}

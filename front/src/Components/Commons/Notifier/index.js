import Notifier from './Notifier'
import {store} from '../../../services/redux/';
import {popLoadingId, pushLoadingId} from "../../../services/redux/reducers/loadingsSlice";
import {On, send} from "../../../services/events";

export function notifySuccess(message, options = {}) {
    send(On.ui_notify,{message: message, options: {variant: "success", ...options}})
}

export function notifyError(message, options = {}) {
    send(On.ui_notify,{message: message, options: {variant: "error", ...options}})
}

export function notify(message, options = {}) {
    send(On.ui_notify,{message: message, options: options})
}

export function startLoading(loadingId) {
    return store.dispatch(pushLoadingId(loadingId))
}

export function stopLoading(loadingId) {
    return store.dispatch(popLoadingId(loadingId))
}

/**
 * @description this doesn't trigger an update in your component,
 * connect the loadings to its props manually like so :
 loadings : store.notifications.occuringLoadings,

 * @param loadingId id used to select when to start and stop the loading
 */
export function isLoading(loadingId) {
    return store.getState().notifications.loadings[loadingId]
}

export {Notifier}
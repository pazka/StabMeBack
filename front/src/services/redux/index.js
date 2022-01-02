import {configureStore} from '@reduxjs/toolkit'
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {triggerStartupEffects} from "../effects/startupEffect"; // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logger).concat(thunk)
})
//
// if (process.env.NODE_ENV !== 'production' && module.hot) {
//     module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
// }

store.dispatch(triggerStartupEffects())

const persistor = persistStore(store)

export {persistor,store}
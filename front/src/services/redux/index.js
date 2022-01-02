import {configureStore} from '@reduxjs/toolkit'
import thunk from "redux-thunk";
import logger from "redux-logger";
import {triggerStartupEffects} from "../effects/startupEffect";
import rootReducer from "./rootReducer";

import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from "redux-persist"; // defaults to localStorage for web

export const persistedReducer = persistReducer({
    key: 'root',
    storage,
}, rootReducer)

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

export const persistor = persistStore(store)

export default store

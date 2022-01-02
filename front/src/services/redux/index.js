import {configureStore} from '@reduxjs/toolkit'
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk).concat(logger)
})
//
// if (process.env.NODE_ENV !== 'production' && module.hot) {
//     module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
// }

export default store
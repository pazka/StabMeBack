import {combineReducers} from "redux";
import lobbySlice from "./reducers/lobbySlice";
import userPrefSlice from "./reducers/userPrefSlice";
import loadingsSlice from "./reducers/loadingsSlice";

const rootReducer = combineReducers({
    userPref : userPrefSlice,
    loadings : loadingsSlice,
    lobby : lobbySlice
})

export default rootReducer
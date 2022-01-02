import userPrefSlice from "./reducers/userPrefSlice";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    userPref : userPrefSlice
})

export default rootReducer
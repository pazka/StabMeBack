import {setTheme} from "../redux/reducers/userPrefSlice";

export function switchTheme(theme){
    return (dispatch,getState)=>{
        dispatch(setTheme(getState().userPref.theme ? 0 : 1))
    }
}
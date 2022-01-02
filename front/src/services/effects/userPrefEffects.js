import {setLang, setTheme} from "../redux/reducers/userPrefSlice";
import i18n from "i18next";

export function switchTheme(theme){
    return (dispatch,getState)=>{
        dispatch(setTheme(getState().userPref.theme ? 0 : 1))
    }
}

export function changeLang(lng){
    return async (dispatch,getState)=>{
        await i18n.changeLanguage(lng)
        dispatch(setLang(lng))
    }
}
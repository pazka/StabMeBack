import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import {config} from "../config";

import ENG from "./translations/en-en";
import FR from "./translations/fr-fr";

import validateTranslations from "./validateTraduction";
import store from "../redux";

/**
 * i18n Allow for a variety of traduction utilities : www.i18next.com
 */


validateTranslations({
    ENG: ENG,
    FR: FR
})

export function initTranslation(){
    i18n
        .use(initReactI18next) // bind react-i18next to the instance
        .init({
            fallbackLng: 'ENG',
            lng: store.getState().userPref.lang,
            debug: config.debug,
            resources: {
                ENG: {translation: {...ENG}},
                FR: {translation: {...FR}}
            }
        });

}

export const AvailableTranslations = ["FR","ENG"]
export default i18n;
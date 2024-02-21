import i18n from "i18next";
import {initReactI18next} from 'react-i18next';
import common_en from "./en/common.json";
import common_ru from "./ru/common.json";
import chat_en from "./en/chat.json";
import chat_ru from "./ru/chat.json";

const languageFromLocalStorage = localStorage.getItem("lang");

i18n
    .use(initReactI18next)
    .init({
        interpolation: {escapeValue: false},
        lng: languageFromLocalStorage || 'en',
        // language to use
        resources: {
            en: {
                common: common_en,
                chat: chat_en,
            },
            ru: {
                common: common_ru,
                chat: chat_ru,
            },
        },
    });

export default i18n;

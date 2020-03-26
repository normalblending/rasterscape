import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import common_en from "./en/common.json";
import common_ru from "./ru/common.json";

i18n
    .use(initReactI18next)
    .init({
    interpolation: {escapeValue: false},
    lng: 'ru',
    // language to use
    resources: {
        en: {
            common: common_en               // 'common' is our custom namespace
        },
        ru: {
            common: common_ru
        },
    },
});

export default i18n;
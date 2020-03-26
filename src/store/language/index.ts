import {handleActions} from "redux-actions";
import i18n from "./translations";

export enum ELanguageAction {
    SET = "language/set",
}

export type LanguageState = string;

export const languageReducer = handleActions<LanguageState>({
    [ELanguageAction.SET]: (s, a) => a.value,
}, i18n.language);

export const setLanguage = (value: string) => dispatch => {
    localStorage.setItem('lang', value);
    dispatch({type: ELanguageAction.SET, value})
};
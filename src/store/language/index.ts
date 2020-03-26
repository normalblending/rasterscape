import {handleActions} from "redux-actions";

export enum ELanguageAction {
    SET = "language/set",
}

export type LanguageState = string;

export const languageReducer = handleActions<LanguageState>({
    [ELanguageAction.SET]: (s, a) => a.value,
}, 'ru');

export const setLanguage = (value: string) => ({
    type: ELanguageAction.SET, value
});
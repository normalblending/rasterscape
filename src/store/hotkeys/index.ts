import {handleActions} from "redux-actions";
import {Action} from "redux";

export enum EHotkeysAction {
    ADD = "hotkeys/add",
    REMOVE = "hotkeys/remove",
    SET_SETTING = "hotkeys/setting-set",
    CLEAR = "hotkeys/clear",
}

export interface ButtonsHotkeys {
    [path: string]: string
}

export interface HotkeysState {
    keys: ButtonsHotkeys,
    setting: boolean
}

export const hotkeysReducer = handleActions<HotkeysState>({
    [EHotkeysAction.ADD]: (state, action: AddHotkeyAction) => {
        const {[action.path]: removed, ...keys} = state.keys;
        return !action.key ? {
            ...state,
            keys,
        } : {
            ...state,
            keys: {
                ...state.keys,
                [action.path]: action.key
            }
        }
    },
    [EHotkeysAction.REMOVE]: (state, action: RemoveHotkeyAction) => {
        const {[action.path]: removed, ...keys} = state.keys;
        return {
            ...state,
            keys,
        }
    },
    [EHotkeysAction.SET_SETTING]: (state, action: SettingModeAction) => {
        return {
            ...state,
            setting: action.state,
        }
    },
    [EHotkeysAction.CLEAR]: (state) => {
        return {
            ...state,
            keys: {},
        }
    },
}, {
    keys: {},
    setting: false,
});


export interface AddHotkeyAction extends Action {
    path: string
    key: string
}

export const addHotkey = (path: string, key: string): AddHotkeyAction => ({
    type: EHotkeysAction.ADD, path, key
});

export interface RemoveHotkeyAction extends Action {
    path: string
}

export const removeHotkey = (path: string): RemoveHotkeyAction => ({
    type: EHotkeysAction.REMOVE, path
});

export interface SettingModeAction extends Action {
    state: boolean
}

export const settingMode = (state: boolean): SettingModeAction => ({
    type: EHotkeysAction.SET_SETTING, state
});

export const clearHotkeys = (): Action => ({
    type: EHotkeysAction.CLEAR
});
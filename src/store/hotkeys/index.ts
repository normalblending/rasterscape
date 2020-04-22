import {handleActions} from "redux-actions";
import {Action} from "redux";

export enum EHotkeysAction {
    ADD = "hotkeys/add",
    REMOVE = "hotkeys/remove",
}

export interface ButtonsHotkeys {
    [path: string]: string
}

export interface HotkeysState {
    keys: ButtonsHotkeys
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
}, {
    keys: {}
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
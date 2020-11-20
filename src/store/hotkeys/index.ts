import {handleActions} from "redux-actions";
import {Action} from "redux";
import {LabelFormatter} from "./label-formatters";

export enum EHotkeysAction {
    ADD = "hotkeys/add",
    UPDATE = "hotkeys/update",
    REMOVE = "hotkeys/remove",
    SET_SETTING = "hotkeys/setting-set",
    CLEAR = "hotkeys/clear",
    HIGHLIGHT = "hotkeys/highlight",
    AUTOFOCUS = "hotkeys/autofocus",
    AUTOBLUR = "hotkeys/autoblur",
}

export enum HotkeyControlType {
    Button = 'button',
    Number = 'number',
    Cycled = 'cycled',
}

export interface HotkeyValue {
    path: string
    label: string
    labelFormatter?: LabelFormatter
    labelData: string
    key: string
    controlType: HotkeyControlType
    onRelease: boolean
}

export interface ButtonsHotkeys {
    [path: string]: HotkeyValue
}

export interface HotkeysState {
    keys: ButtonsHotkeys,
    setting: boolean
    highlightedPath: string
    autofocus: boolean
    autoblur: boolean
}

export const hotkeysReducer = handleActions<HotkeysState>({
    [EHotkeysAction.ADD]: (state, action: HotkeyAction) => {
        const {[action.path]: removed, ...keys} = state.keys;
        return !action.key ? {
            ...state,
            keys,
        } : {
            ...state,
            keys: {
                ...state.keys,
                [action.path]: {
                    key: action.key,
                    path: action.path,
                    controlType: action.controlType,
                    // onRelease: true,
                    label: action.label || state.keys[action.path]?.label,
                    labelData: action.labelData || state.keys[action.path]?.labelData,
                    labelFormatter: action.labelFormatter || state.keys[action.path]?.labelFormatter,
                }
            }
        }
    },
    [EHotkeysAction.UPDATE]: (state, action: HotkeyUpdateAction) => {
        return {
            ...state,
            keys: {
                ...state.keys,
                [action.path]: {
                    ...state.keys[action.path],
                    ...action.updateData,
                }
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
    [EHotkeysAction.HIGHLIGHT]: (state, action: HighlightHotkeyAction) => {
        return {
            ...state,
            highlightedPath: action.path,
        }
    },
    [EHotkeysAction.AUTOFOCUS]: (state, action: AutofocusAction) => {
        return {
            ...state,
            autofocus: action.value,
        }
    },
    [EHotkeysAction.AUTOBLUR]: (state, action: AutofocusAction) => {
        return {
            ...state,
            autoblur: action.value,
        }
    },
}, {
    keys: {},
    setting: false,
    highlightedPath: null,
    autofocus: false,
    autoblur: false,
});

export interface HotkeyAction extends Action {
    path: string
    key?: string
    label?: string
    labelFormatter?: LabelFormatter
    labelData?: any[]
    controlType?: HotkeyControlType
    onRelease?: boolean
}

export interface HotkeyUpdateData {
    key?: string
    name?: string
    onRelease?: boolean
}

export interface HotkeyUpdateAction extends Action {
    path: string
    updateData: HotkeyUpdateData
}

export interface AddHotkeyOptions {
    path: string,
    key: string,
    controlType?: HotkeyControlType,
    label?: string,
    labelFormatter?: LabelFormatter,
    labelData?: any[]
}

export const addHotkey = (options: AddHotkeyOptions): HotkeyAction => {
    const {
        path,
        key,
        controlType,
        label,
        labelFormatter,
        labelData,
    } = options;

    return {
        type: EHotkeysAction.ADD,
        path,
        key,
        label,
        labelFormatter,
        labelData,
        controlType
    }
};
export const updateHotkey = (path: string, updateData: HotkeyUpdateData): HotkeyUpdateAction => ({
    type: EHotkeysAction.UPDATE, path, updateData
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

export interface HighlightHotkeyAction extends Action {
    path: string
}

export const highlightHotkey = (path: string): HighlightHotkeyAction => ({
    type: EHotkeysAction.HIGHLIGHT, path
});

export interface AutofocusAction extends Action {
    value: boolean
}

export const setAutofocus = (value: boolean): AutofocusAction => ({
    type: EHotkeysAction.AUTOFOCUS, value
});
export const setAutoblur = (value: boolean): AutofocusAction => ({
    type: EHotkeysAction.AUTOBLUR, value
});
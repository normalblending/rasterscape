import {handleActions} from "redux-actions";
import {HotkeysState} from "./types";
import {EHotkeysAction} from "./consts";
import {immutableSplice} from "../../utils/array";
import {
    AutofocusAction,
    CreateHotkeyAction,
    HighlightHotkeyAction,
    HotkeyKeyAction,
    HotkeyPathAction,
    SetHotkeyKeyAction,
    SetHotkeyOnReleaseAction,
    SettingModeAction
} from "./actions";

export const hotkeysReducer = handleActions<HotkeysState>({
    [EHotkeysAction.CREATE]: (state: HotkeysState, action: CreateHotkeyAction): HotkeysState => {
        return {
            ...state,
            buttons: {
                ...state.buttons,
                [action.path]: {
                    maxKeysCount: action.options.maxKeysCount,
                    keys: [{
                        key: action.options.key,
                        code: action.options.code,
                        onRelease: false,
                    }],
                    path: action.path,
                    controlType: action.options.controlType,
                    label: action.options.label,
                    labelData: action.options.labelData,
                    labelFormatter: action.options.labelFormatter,
                }
            }
        }
    },

    [EHotkeysAction.SET_KEY]: (state: HotkeysState, action: SetHotkeyKeyAction) => {
        const {path, index, key, code} = action;
        const button = state.buttons[path];

        if (!button) return state;

        return {
            ...state,
            buttons: {
                ...state.buttons,
                [action.path]: {
                    ...button,
                    keys: immutableSplice(button.keys, index, 1, {
                        key,
                        code,
                        onRelease: button.keys[index]?.onRelease || false,
                    }),
                }
            }
        }
    },
    [EHotkeysAction.REMOVE_KEY]: (state: HotkeysState, action: HotkeyKeyAction) => {
        const {path, index} = action;
        const button = state.buttons[path];

        if (!button || !button.keys[index]) return state;

        return {
            ...state,
            buttons: {
                ...state.buttons,
                [action.path]: {
                    ...button,
                    keys: immutableSplice(button.keys, index, 1),
                }
            }
        }
    },
    [EHotkeysAction.SET_ON_RELEASE]: (state: HotkeysState, action: SetHotkeyOnReleaseAction) => {
        const {path, index, onRelease} = action;
        const button = state.buttons[path];

        if (!button) return state;

        return {
            ...state,
            buttons: {
                ...state.buttons,
                [action.path]: {
                    ...button,
                    keys: immutableSplice(button.keys, index, 1, {
                        key: button.keys[index].key,
                        code: button.keys[index].code,
                        onRelease,
                    }),
                }
            }
        }
    },
    [EHotkeysAction.REMOVE]: (state: HotkeysState, action: HotkeyPathAction) => {
        const {[action.path]: removed, ...buttons} = state.buttons;
        return {
            ...state,
            buttons,
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
            buttons: {},
        }
    },
    [EHotkeysAction.HIGHLIGHT]: (state, action: HighlightHotkeyAction) => {
        return {
            ...state,
            highlightedPath: action.path,
            highlightedIndex: action.index,
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
    buttons: {},
    setting: false,
    highlightedPath: null,
    highlightedIndex: null,
    autofocus: false,
    autoblur: false,
});
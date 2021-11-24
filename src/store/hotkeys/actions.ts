import {Action} from "redux";
import {LabelFormatter} from "./label-formatters";
import {EHotkeysAction} from "./consts";
import {HotkeyControlType} from "./types";

export interface HotkeyPathAction extends Action {
    path: string
}

export interface HotkeyKeyAction extends HotkeyPathAction {
    index: number
}

export interface CreateHotkeyOptions {
    key: string
    code: string
    label: string
    labelFormatter?: LabelFormatter
    labelData?: any[]
    controlType?: HotkeyControlType
    maxKeysCount: number
    //onRelease?: boolean // можно как то сделать чтобы этот параметр создавался при созданиии
}

export interface CreateHotkeyAction extends HotkeyPathAction {
    options: CreateHotkeyOptions
}

export interface SetHotkeyKeyAction extends HotkeyKeyAction {
    key: string
    code: string
}

export interface SetHotkeyOnReleaseAction extends HotkeyKeyAction {
    onRelease: boolean
}

export interface SettingModeAction extends Action {
    state: boolean
}

export interface HighlightHotkeyAction extends Action {
    path: string
    index: number
}

export interface AutofocusAction extends Action {
    value: boolean
}


export const createHotkey = (path: string, options: CreateHotkeyOptions): CreateHotkeyAction => ({
    type: EHotkeysAction.CREATE,
    path,
    options,
});

export const setHotkeyKey = (path: string, index: number, key: string, code: string): SetHotkeyKeyAction => ({
    type: EHotkeysAction.SET_KEY,
    path, index, key, code
});


export const setHotkeyOnRelease = (path: string, index: number, onRelease: boolean): SetHotkeyOnReleaseAction => ({
    type: EHotkeysAction.SET_ON_RELEASE,
    path, index, onRelease
});

export const removeHotkeyKey = (path: string, index: number): HotkeyKeyAction => ({
    type: EHotkeysAction.REMOVE_KEY,
    path,
    index
});


export const removeHotkey = (path: string): HotkeyPathAction => ({
    type: EHotkeysAction.REMOVE,
    path
});


export const settingMode = (state: boolean): SettingModeAction => ({
    type: EHotkeysAction.SET_SETTING, state
});

export const clearHotkeys = (): Action => ({
    type: EHotkeysAction.CLEAR
});

export const highlightHotkey = (path: string, index: number): HighlightHotkeyAction => ({
    type: EHotkeysAction.HIGHLIGHT,
    path, index
});

export const setAutofocus = (value: boolean): AutofocusAction => ({
    type: EHotkeysAction.AUTOFOCUS, value
});
export const setAutoblur = (value: boolean): AutofocusAction => ({
    type: EHotkeysAction.AUTOBLUR, value
});
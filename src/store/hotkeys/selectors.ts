import {createSelector} from "reselect";
import {AppState} from "../index";
import {ButtonHotkeyValue, HotkeyKeyValue} from "./types";

export const getHotkeysState = (state: AppState) => state.hotkeys;
export const getIsSettingMode = (state: AppState) => state.hotkeys.setting;
export const getHotkeysButtons = (state: AppState) => state.hotkeys.buttons;
export const getHotkeysHighlightedPath = (state: AppState) => state.hotkeys.highlightedPath;
export const getHotkeysHighlightedIndex = (state: AppState) => state.hotkeys.highlightedIndex;
export const getAutoFocus = (state: AppState) => state.hotkeys.autofocus;
export const getAutoBlur = (state: AppState) => state.hotkeys.autoblur;


export const getHotkeysHighlight = createSelector(
    [getHotkeysHighlightedPath, getHotkeysHighlightedIndex],
    (highlightedPath, highlightedIndex): [string, number] =>
        [highlightedPath, highlightedIndex]
);

export const getAutoFocusBlur = createSelector(
    [getAutoFocus, getAutoBlur],
    (autofocus, autoblur): [boolean, boolean] =>
        [autofocus, autoblur]
);

export const createHotkeysKeysByPathSelector = (path: string) => createSelector(
    [getHotkeysButtons],
    (buttons): HotkeyKeyValue[] =>
        buttons[path].keys
);

export const createButtonHotkeyValueByPathSelector = (path: string) => createSelector(
    [getHotkeysButtons],
    (buttons): ButtonHotkeyValue =>
        buttons[path]
);

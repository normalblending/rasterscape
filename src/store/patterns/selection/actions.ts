import {PatternAction, PatternState} from "../pattern/types";
import {Segments} from "./types";
import {AppState} from "../../index";
import {addPattern} from "../actions";
import {copyPatternToClipboard, updateImage} from "../pattern/actions";
import {getPatternConfig, getPatternParams} from "../pattern/helpers";
import {getMaskFromSegments, getSelectedImageData, getSelectedMask} from "./helpers";
import {updateMask} from "../mask/actions";
import {createCleanCanvasState} from "../../../utils/state";
import {EPathModeType, Path} from "../../../utils/path";
import {isMeDrawer} from "../room/helpers";
import {patternValues} from "../values";

export enum ESelectionAction {
    UPDATE_SELECTION = "pattern/update-selection",
}

export interface UpdatePatternSelectionAction extends PatternAction {
    value: Segments
    bBox: SVGRect
}

export interface CreatePatternFromSelection extends PatternAction {
}

export const updateSelection = (id: string, value: Segments, bBox: SVGRect) =>
    (dispatch) => {

        dispatch({type: ESelectionAction.UPDATE_SELECTION, value, bBox, id});

        dispatch(updateSelectionImage(id));
    };

export const updateSelectionImage = (id: string) =>
    (dispatch, getState: () => AppState) => {

        const pattern = getState().patterns[id];
        if (!pattern)
            return;

        const {selection, current} = pattern;

        if (selection.value.segments?.length) {
            const imageData = current.imageData;
            const mask = selection.value.mask;

            patternValues.setSelectedValue(id, imageData, mask);
        } else if (patternValues.values[id].selected) {
            patternValues.setSelectedValue(id);
        }

    };

export const selectAll = (id: string) => (dispatch, getState: () => AppState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    if (!pattern) return;

    const {width, height} = pattern.current.imageData

    const path = Path[EPathModeType.Rect]([], [0, 0, width, height]);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttributeNS(null, 'x', '0');
    rect.setAttributeNS(null, 'y', '0');
    rect.setAttributeNS(null, 'height', `${height}`);
    rect.setAttributeNS(null, 'width', `${width}`);

    const bBox = rect.getBBox();

    dispatch(updateSelection(id, [...path, ...pattern.selection?.value?.segments], bBox));
    // dispatch({type: ESelectionAction.UPDATE_SELECTION, value: [...path, ...pattern.selection?.value?.segments], bBox, id});
};

export const createPatternFromSelection = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    const config = {...getPatternConfig(pattern)};
    const params = getPatternParams(pattern);

    config.startImage = getSelectedImageData(pattern);
    config.startMask = getSelectedMask(pattern);

    dispatch(addPattern(config, params));
};
export const cutPatternBySelection = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    if (!pattern) return;

    if (!isMeDrawer(pattern.room?.value)) return;

    dispatch(updateImage({id, imageData: getSelectedImageData(pattern)}));
    dispatch(updateMask(id, getSelectedMask(pattern), true));
    dispatch(updateSelection(id, [], null));
};

export const clearSelectionIn = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    if (!pattern) return;

    if (!isMeDrawer(pattern.room?.value)) return;

    if (pattern.selection?.value.segments.length) {
        dispatch(updateImage({
            id,
            imageData: getSelectedImageData(pattern, false, true),
            noHistory: false
        }));
    } else {
        dispatch(updateImage({
            id,
            imageData: createCleanCanvasState(pattern.current.imageData.width, pattern.current.imageData.height).imageData,
            noHistory: false
        }));
    }
};

export const cutSelectionInToClipboard = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    if (!isMeDrawer(pattern.room.value)) return;

    dispatch(copyPatternToClipboard(id));
    dispatch(clearSelectionIn(id));
};

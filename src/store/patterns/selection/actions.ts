import {PatternAction} from "../pattern/types";
import {Segments} from "./types";
import {AppState} from "../../index";
import {addPattern} from "../actions";
import {updateImage} from "../pattern/actions";
import {getPatternConfig, getPatternParams} from "../pattern/helpers";
import {getSelectedImageData, getSelectedMask} from "./helpers";
import {updateMask} from "../mask/actions";

export enum ESelectionAction {
    UPDATE_SELECTION = "pattern/update-selection",
}

export interface UpdatePatternSelectionAction extends PatternAction {
    value: Segments
    bBox: SVGRect
}

export interface CreatePatternFromSelection extends PatternAction {
}

export const updateSelection = (id: string, value: Segments, bBox: SVGRect): UpdatePatternSelectionAction =>
    ({type: ESelectionAction.UPDATE_SELECTION, value, bBox, id});

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

    dispatch(updateMask(id, getSelectedMask(pattern)));
    dispatch(updateImage({id, imageData: getSelectedImageData(pattern), noHistory: true}));
    dispatch(updateSelection(id, [], null));
};
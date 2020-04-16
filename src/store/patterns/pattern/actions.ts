import {
    EditPatternConfigAction,
    PatternConfig,
    SetPatternHeightAction,
    SetPatternWidthAction,
    UpdatePatternImageAction
} from "./types";
import {AppState} from "../../index";
import {ThunkResult} from "../../../utils/actions/types";
import {imageDataToBase64} from "../../../utils/canvas/helpers/imageData";
import {addPattern} from "../actions";
import {getPatternConfig, getPatternParams} from "./helpers";

export enum EPatternAction {
    UPDATE_IMAGE = "pattern/update-image",

    EDIT_CONFIG = "pattern/edit-config",

    SET_WIDTH = "pattern/set-width",
    SET_HEIGHT = "pattern/set-height",
}

export const updateImage = (id: string, imageData: ImageData, emit: boolean = true): ThunkResult<UpdatePatternImageAction, AppState> =>
    (dispatch, getState) => {

        const socket = getState().patterns[id].room?.value?.socket;

        emit && socket && socket.emit("image", imageDataToBase64(imageData));

        return dispatch({type: EPatternAction.UPDATE_IMAGE, imageData, id});
    };
export const editConfig = (id: string, config: PatternConfig): EditPatternConfigAction =>
    ({type: EPatternAction.EDIT_CONFIG, id, config});
export const setWidth = (id: string, width: number): SetPatternWidthAction =>
    ({type: EPatternAction.SET_WIDTH, id, width});
export const setHeight = (id: string, height: number): SetPatternHeightAction =>
    ({type: EPatternAction.SET_HEIGHT, id, height});
export const doublePattern = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    const config = getPatternConfig(pattern);
    const params = getPatternParams(pattern);

    dispatch(addPattern(config, params));
};
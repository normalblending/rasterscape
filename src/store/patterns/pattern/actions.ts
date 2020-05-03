import {
    EditPatternConfigAction,
    PatternConfig,
    SetPatternHeightAction,
    SetPatternWidthAction,
    UpdatePatternImageAction
} from "./types";
import {AppState} from "../../index";
import {ThunkResult} from "../../../utils/actions/types";
import {copyImageData, imageDataToBase64} from "../../../utils/canvas/helpers/imageData";
import {addPattern} from "../actions";
import {getPatternConfig, getPatternParams} from "./helpers";
import * as StackBlur from 'stackblur-canvas';

export enum EPatternAction {
    UPDATE_IMAGE = "pattern/update-image",

    EDIT_CONFIG = "pattern/edit-config",

    SET_WIDTH = "pattern/set-width",
    SET_HEIGHT = "pattern/set-height",
}

export const updateImage = (id: string, imageData?: ImageData, emit: boolean = true, blur?: boolean): ThunkResult<UpdatePatternImageAction, AppState> =>
    (dispatch, getState) => {

        const pattern = getState().patterns[id];
        const socket = pattern.room?.value?.socket;


        let resultImageData;

        if (imageData) {
            resultImageData = imageData;
        } else {
            const oldImageData = pattern.current?.imageData;
            resultImageData = copyImageData(oldImageData);
        }

        const needBlur = pattern.config.blur && (pattern.blur?.value?.onUpdate || blur);
        if (needBlur && resultImageData) {
            const radius = pattern.blur?.value?.radius;
            if (radius > 0) {
                resultImageData = StackBlur.imageDataRGBA(resultImageData, 0, 0, resultImageData.width, resultImageData.height, radius);
            }
        }

        emit && socket && socket.emit("image", imageDataToBase64(resultImageData));

        return dispatch({type: EPatternAction.UPDATE_IMAGE, imageData: resultImageData, id});
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
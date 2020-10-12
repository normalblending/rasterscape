import {
    EditPatternConfigAction,
    PatternConfig,
    SetPatternHeightAction,
    SetPatternWidthAction, UpdateOptions,
    UpdatePatternImageAction
} from "./types";
import {AppState} from "../../index";
import {ThunkResult} from "../../../utils/actions/types";
import {copyImageData, imageDataToBase64, imageDataToCanvas} from "../../../utils/canvas/helpers/imageData";
import {addPattern} from "../actions";
import {getPatternConfig, getPatternParams} from "./helpers";
import * as StackBlur from 'stackblur-canvas';
import {sendImage} from "../room/actions";
import {ThunkAction} from 'redux-thunk'
import {setSize, setVideoHeight, setVideoWidth} from "../video/actions";
import {patternValues} from "../values";
import {copyToClipboard} from "../../../utils/clipboard";
import {getSelectedImageData} from "../selection/helpers";
import {coordHelper5} from "../../../components/Area/canvasPosition.servise";

export enum EPatternAction {
    UPDATE_IMAGE = "pattern/update-image",

    EDIT_CONFIG = "pattern/edit-config",

    SET_WIDTH = "pattern/set-width",
    SET_HEIGHT = "pattern/set-height",
}

export const updateImage = (options: UpdateOptions) => //: ThunkResult<UpdatePatternImageAction, AppState> =>
    (dispatch, getState) => {

        const {
            id,
            imageData,
            emit = true,
            blur,
            noHistory,
        } = options;

        const pattern = getState().patterns[id];

        if (!pattern)
            return;

        let resultImageData;

        if (imageData) {
            resultImageData = imageData;
        } else {
            const oldImageData = pattern.current?.imageData;
            resultImageData = copyImageData(oldImageData);
        }

        const needBlur = pattern.config.blur && (pattern.blur?.value?.onUpdate || blur);
        if (needBlur && resultImageData) {
            const radius = Math.round(pattern.blur?.value?.radius);
            if (radius > 0) {
                resultImageData = StackBlur.imageDataRGBA(resultImageData, 0, 0, resultImageData.width, resultImageData.height, radius);
            }
        }


        dispatch({type: EPatternAction.UPDATE_IMAGE, imageData: resultImageData, id, noHistory});

        return emit && dispatch(sendImage(id));
    };
export const editConfig = (id: string, config: PatternConfig): EditPatternConfigAction =>
    ({type: EPatternAction.EDIT_CONFIG, id, config});

export const setWidth = (id: string, width: number): ThunkAction<any, any, any, SetPatternWidthAction> => dispatch => {
    dispatch(setVideoWidth(id, width));
    dispatch({type: EPatternAction.SET_WIDTH, id, width});
}
export const setHeight = (id: string, height: number): ThunkAction<any, any, any, SetPatternHeightAction> => dispatch => {
    dispatch(setVideoHeight(id, height));
    dispatch({type: EPatternAction.SET_HEIGHT, id, height});
}
export const doublePattern = (id: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const pattern = state.patterns[id];

    const config = getPatternConfig(pattern);
    const params = getPatternParams(pattern);

    dispatch(addPattern(config, params));
};


export const copyPatternToClipboard = (id: string) => async (dispatch, getState: () => AppState) => {
    const pattern = getState().patterns[id];


    (pattern.selection.value.segments.length
            ? imageDataToCanvas(getSelectedImageData(pattern, pattern.config.mask))
            : patternValues.values[id]
    ).toBlob((blob) => {
        copyToClipboard(blob);
    });
};
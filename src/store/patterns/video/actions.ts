import {PatternAction} from "../pattern/types";
import {VideoParams} from "./types";
import {AppState} from "../../index";
import {Capture} from "./capture";
import {Formulas} from "./capture/formulas";
import {get, PixelsStack, set} from "./capture/pixels";
import 'p5/lib/addons/p5.dom';
import {EdgeMode} from "./capture/types";
import {updateImage} from "../pattern/actions";
import {Captures} from "./services";
import {videoChangeFunctionByType} from "../../changeFunctions/helpers";

export enum EVideoAction {
    SET_VIDEO_PARAMS = 'pattern/video/set-video-param'

}

export interface SetVideoParamsAction extends PatternAction {
    value: VideoParams
}

export const start = (patternId: string) => (dispatch, getState: () => AppState) => {

    Captures.start(patternId, (pixels) => dispatch(updateImage(patternId, new ImageData(pixels, 320), false)), (x, y, length) => {
        const state = getState();


        const cfId = state.patterns[patternId].video.params.changeFunctionId;

        if (cfId) {

            const width = state.patterns[patternId].current.width;
            const height = state.patterns[patternId].current.height;
            const cfParams = state.changeFunctions.functions[cfId].params;
            const cfType = state.changeFunctions.functions[cfId].type;
            return videoChangeFunctionByType[cfType](x, y, width, height, cfParams);
        } else {
            return x;
        }
    });
};
export const stop = (patternId: string) => (dispatch, getState: () => AppState) => {
    Captures.stop(patternId);
};
export const pause = (patternId: string) => (dispatch, getState: () => AppState) => {
    Captures.pause(patternId);

};
export const play = (patternId: string) => (dispatch, getState: () => AppState) => {
    Captures.play(patternId);

};

export const onNewFrame = (id: string, imageData: ImageData) => (dispatch, getState: () => AppState) => {

    dispatch(updateImage(id,imageData));

};

export const setVideoParams = (id: string, value: VideoParams) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_VIDEO_PARAMS,
        id,
        value
    })
};


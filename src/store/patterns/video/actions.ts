import {PatternAction} from "../pattern/types";
import {VideoParams} from "./types";
import {AppState} from "../../index";
import {Formulas} from "./capture/formulas";
import {get, PixelsStack, set} from "./capture/pixels";
import 'p5/lib/addons/p5.dom';
import {EdgeMode} from "./capture/types";
import {updateImage} from "../pattern/actions";
import {Captures} from "./services";
import {videoChangeFunctionByType} from "../../changeFunctions/helpers";
import {coordHelper, redHelper} from "../../../components/Area/canvasPosition.servise";

export enum EVideoAction {
    SET_VIDEO_PARAMS = 'pattern/video/set-video-param'

}

export interface SetVideoParamsAction extends PatternAction {
    value: VideoParams
}

export const start = (patternId: string) => (dispatch, getState: () => AppState) => {

    Captures.start(
        patternId,
        (pixels) => dispatch(updateImage(patternId, new ImageData(pixels, 320), false)),
        (x, y, length) => {
            const state = getState();


            const cfId = state.patterns[patternId].video.params.changeFunctionId;

            const cf = state.changeFunctions.functions[cfId];

            if (cf) {

                return videoChangeFunctionByType[cf.type](
                    x, y,
                    state.patterns[patternId].current.width,
                    state.patterns[patternId].current.height,
                    cf.params, state.patterns);
            } else {
                return state.patterns[patternId].current.width;
            }
        },
        () => {
            const state = getState();
            const edgeMode = state.patterns[patternId].video.params.edgeMode;
            return edgeMode;
        },
        () => {
            const state = getState();
            const slitMode = state.patterns[patternId].video.params.slitMode;
            return slitMode;
        },
        () => {
            const state = getState();
            const stackType = state.patterns[patternId].video.params.stackType;
            return stackType;
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
export const updateParams = (patternId: string) => (dispatch, getState: () => AppState) => {

    Captures.updateParams(patternId);

};

export const onNewFrame = (id: string, imageData: ImageData) => (dispatch, getState: () => AppState) => {

    dispatch(updateImage(id, imageData));

};

export const setVideoParams = (id: string, value: VideoParams) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_VIDEO_PARAMS,
        id,
        value
    });

    dispatch(updateParams(id));
};


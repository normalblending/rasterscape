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
        (pixels, emit) => {
            console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
            dispatch(updateImage({
                id: patternId,
                imageData: new ImageData(pixels, 320),
                emit: false,
                blur: false,
                noHistory: true,
            }))
        },
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
    console.log('HHHHHHHHHHHHHHHHHHH000000000HHHHHHHHHHHHHHHHHHHH');
    // dispatch(updateImage({id: patternId}));
};
export const pause = (patternId: string) => (dispatch, getState: () => AppState) => {
    Captures.pause(patternId);
    console.log('HHHHHHHHHHHHHHHHHHH-------------HHHHHHHHHHHHHHHHHHHH');
    // dispatch(updateImage({id: patternId}));

};
export const play = (patternId: string) => (dispatch, getState: () => AppState) => {
    Captures.play(patternId);
    console.log('HHHHHHHHHHHHHHHHHHH++++++++++++++HHHHHHHHHHHHHHHHHHHH');
    dispatch(updateImage({id: patternId}));
    // dispatch(updateImage({id: patternId}));

};
export const updateParams = (patternId: string, noHistory?: boolean) => (dispatch, getState: () => AppState) => {

    console.log('HHHHHHHHHHHHUUUUUUUUUUUUUUUUUUHHHHHHHHHH');
    Captures.updateParams(patternId);
    dispatch(updateImage({id: patternId, noHistory}));

};

export const setVideoParams = (id: string, value: VideoParams, noHistory?: boolean) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_VIDEO_PARAMS,
        id,
        value
    });

    dispatch(updateParams(id, noHistory));
};


import {PatternAction} from "../pattern/types";
import {VideoParams} from "./types";
import {AppState} from "../../index";
import {Formulas} from "./capture/formulas";
import {get, PixelsStack, set, StackType} from "./capture/pixels";
import 'p5/lib/addons/p5.dom';
import {updateImage} from "../pattern/actions";
import {Captures, MirrorMode, SlitMode} from "./services";
import {videoChangeFunctionByType} from "../../changeFunctions/helpers";
import {coordHelper, redHelper} from "../../../components/Area/canvasPosition.servise";
import {EdgeMode} from './services';
import {ThunkAction} from "redux-thunk";

export enum EVideoAction {
    SET_VIDEO_PARAMS = 'pattern/video/set-video-param',
    SET_EDGE_MODE = 'pattern/video/set-edge-mode',
    SET_MIRROR_MODE = 'pattern/video/set-mirror-mode',
    SET_SLIT_MODE = 'pattern/video/set-slit-mode',
    SET_STACK_TYPE = 'pattern/video/set-stack-type',
    SET_CHANGE_FUNCTION = 'pattern/video/set-change-function',
    SET_STACK_SIZE = 'pattern/video/set-stack-size',
    SET_CUT_OFFSET = 'pattern/video/set-cut-offset',
    START = 'pattern/video/start',
    STOP = 'pattern/video/stop',
    PAUSE = 'pattern/video/pause',
    PLAY = 'pattern/video/play',
}

export interface SetVideoParamsAction extends PatternAction {
    value: VideoParams
}
export type SetEdgeModeAction = PatternAction & { value: EdgeMode };
export type SetMirrorModeAction = PatternAction & { value: MirrorMode };
export type SetSlitModeAction = PatternAction & { value: SlitMode };
export type SetStackTypeAction = PatternAction & { value: StackType };
export type SetCFAction = PatternAction & { value: string };
export type SetStackSizeAction = PatternAction & { value: number };
export type SetCutOffsetAction = PatternAction & { value: number };

export const start = (patternId: string) => (dispatch, getState: () => AppState) => {

    const pattern = getState().patterns[patternId];

    if (pattern.room?.value?.connected && !pattern.room?.value?.meDrawer)
        return;

    const {
        edgeMode,
        slitMode,
        stackType,
        mirrorMode
    } = pattern?.video?.params || {};

    dispatch(updateImage({
        id: patternId,
        noHistory: false,
        emit: false,
    }));
    dispatch({type: EVideoAction.START, id: patternId});

    const width = pattern.current.imageData.width;
    const height = pattern.current.imageData.height;
    const depth = pattern.current.imageData.width * pattern.video.params.stackSize;

    Captures.start({
        patternId,
        width: width,
        height: height,
        depth: depth,
        onNewFrame: (pixels, width, height) => {
            // coordHelper.setText(pixels.length);
            dispatch(updateImage({
                id: patternId,
                imageData: new ImageData(new Uint8ClampedArray(pixels), width, pixels.length / 4 / width),
                emit: false,
                blur: false,
                noHistory: true,
            }));
        },
        cutFunction: (x, y) => {
            const state = getState();


            const cfId = state.patterns[patternId]?.video.params.changeFunctionId;
            const cutOffset = -state.patterns[patternId]?.video.params.cutOffset;

            const cf = state.changeFunctions.functions[cfId];

            if (cf) {

                return cutOffset + videoChangeFunctionByType[cf.type](
                    x, y,
                    state.patterns[patternId]?.current.imageData.width,
                    state.patterns[patternId]?.current.imageData.height,
                    cf.params, state.patterns) * (1 - cutOffset);
            } else {
                return cutOffset;//state.patterns[patternId]?.current.imageData.width;
            }
        },
        edgeMode,
        slitMode,
        stackType,
        mirrorMode,
    });

    const interval = setInterval(() => {
        const pattern = getState().patterns[patternId];
        const imageData = pattern.current.imageData;
        if (imageData.data[imageData.data.length - 1] === 0) {
            Captures.captures[patternId]?.setHeight(height)
            clearInterval(interval);
        }
    }, 50);

};
export const pause = (patternId: string) => (dispatch, getState: () => AppState) => {
    dispatch(updateImage({
        id: patternId,
        noHistory: true,
        emit: true,
    }));
    dispatch({type: EVideoAction.PAUSE, id: patternId});
    Captures.pause(patternId);
};
export const play = (patternId: string) => (dispatch, getState: () => AppState) => {
    dispatch(updateImage({
        id: patternId,
        noHistory: false,
        emit: false,
    }));
    dispatch({type: EVideoAction.PLAY, id: patternId});
    Captures.play(patternId);
};
export const stop = (patternId: string) => (dispatch, getState: () => AppState) => {
    dispatch(updateImage({
        id: patternId,
        noHistory: true,
        emit: true,
    }));
    dispatch({type: EVideoAction.STOP, id: patternId});
    Captures.stop(patternId);
};

export const setEdgeMode = (id: string, value: EdgeMode) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_EDGE_MODE,
        id,
        value
    });
    Captures.captures[id]?.setEdgeMode(value);
};

export const setMirrorMode = (id: string, value: MirrorMode) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_MIRROR_MODE,
        id,
        value
    });
    Captures.captures[id]?.setMirrorMode(value);
};

export const setSlitMode = (id: string, value: SlitMode) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_SLIT_MODE,
        id,
        value
    });
    Captures.captures[id]?.setSlitMode(value);
};

export const setStackType = (id: string, value: StackType) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_STACK_TYPE,
        id,
        value
    });
    Captures.captures[id]?.stack.setType(value);
};

export const setChangeFunction = (id: string, value: string) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_CHANGE_FUNCTION,
        id,
        value
    });
    Captures.captures[id]?.updateImage();
};

export const setStackSize = (id: string, value: number): ThunkAction<any, any, any, SetStackSizeAction> => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_STACK_SIZE,
        id,
        value
    });
    const pattern = getState().patterns[id];

    Captures.captures[id]?.setDepth(pattern.current.imageData.width * value);
};

export const setCutOffset = (id: string, value: number): ThunkAction<any, any, any, SetCutOffsetAction> => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_CUT_OFFSET,
        id,
        value
    });
    // const pattern = getState().patterns[id];

    Captures.captures[id]?.updateImage();
};

export const setSize = (id: string, width?: number, height?: number): ThunkAction<any, any, any, any> => dispatch => {
    Captures.captures[id]?.setSize(width, height);
};

export const setVideoWidth = (id: string, width?: number): ThunkAction<any, any, any, any> => dispatch => {
    Captures.captures[id]?.setWidth(width);
};

export const setVideoHeight = (id: string, height?: number): ThunkAction<any, any, any, any> => dispatch => {
    Captures.captures[id]?.setHeight(height);
};


export const updateVideo = (id: string) => (dispatch, getState: () => AppState) => {
    Captures.captures[id]?.updateImage();
};

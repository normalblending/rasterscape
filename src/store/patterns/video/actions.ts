import {PatternAction} from "../pattern/types";
import {VideoParams} from "./types";
import {AppState, patternsService} from "../../index";
import 'p5/lib/addons/p5.dom';
import {updateImage} from "../pattern/actions";
import {Captures, EdgeMode, MirrorMode, SlitMode} from "./services";
import {ThunkAction} from "redux-thunk";
import {EVideoAction} from "./consts";
import {StackType} from "../_service/patternServices/PatternVideoService";
import {addCfToPatternDependency, removeCfToPatternDependency} from "../../dependencies";

export interface SetVideoParamsAction extends PatternAction {
    value: VideoParams
}

export type SetDeviceAction = PatternAction & { device: MediaDeviceInfo };
export type SetEdgeModeAction = PatternAction & { value: EdgeMode };
export type SetMirrorModeAction = PatternAction & { value: MirrorMode };
export type SetSlitModeAction = PatternAction & { value: SlitMode };
export type SetStackTypeAction = PatternAction & { value: StackType };
export type SetCFAction = PatternAction & { value: string };
export type SetStackSizeAction = PatternAction & { value: number };
export type SetCutOffsetAction = PatternAction & { value: number };

export const setDevice = (id: string, device: MediaDeviceInfo) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_DEVICE,
        id,
        device
    });
    patternsService.pattern[id].videoService.setDevice(device);
};

export const startCamera = (id: string) => (dispatch, getState: () => AppState) => {

    dispatch({type: EVideoAction.START_CAMERA, id});

    const pattern = getState().patterns[id];

    patternsService.pattern[id].videoService
        .initCamera({
            width: pattern.width,
            height: pattern.height,
            device: pattern.video.params.device
        })
        .startCamera();
};

export const stopCamera = (id: string) => (dispatch, getState: () => AppState) => {

    dispatch({type: EVideoAction.STOP_CAMERA, id});
    patternsService.pattern[id].videoService.stopCamera();
};

export const start = (patternId: string) => async (dispatch, getState: () => AppState) => {

    const pattern = getState().patterns[patternId];
    const patternService = patternsService.pattern[patternId];

    if (pattern.room?.value?.connected && !pattern.room?.value?.meDrawer)
        return;

    const {
        edgeMode,
        slitMode,
        stackType,
        mirrorMode,
        stackSize,
        cutOffset,
    } = pattern?.video?.params || {};

    dispatch(updateImage({
        id: patternId,
        noHistory: false,
        emit: false,
    }));
    dispatch({type: EVideoAction.START_UPDATING, id: patternId});

    // const width = pattern.current.imageData.width;
    // const height = pattern.current.imageData.height;
    // const depth = pattern.current.imageData.width * pattern.video.params.stackSize;


    (await patternService.videoService
        .init({
            width: pattern.width,
            height: pattern.height,
            depth: stackSize,
            edgeMode,
            slitMode,
            stackType,
            mirrorMode,
            cutOffset,
        }))
        .start();

    //
    // Captures.start({
    //     patternId,
    //     width: width,
    //     height: height,
    //     depth: depth,
    //     onNewFrame: (pixels, width, height) => {
    //         // coordHelper.setText(pixels.length);
    //         dispatch(updateImage({
    //             id: patternId,
    //             imageData: new ImageData(pixels, width, height),
    //             emit: false,
    //             blur: false,
    //             noHistory: true,
    //         }));
    //     },
    //     cutFunction: (x, y) => {
    //         const state = getState();
    //
    //
    //         const cfId = state.patterns[patternId]?.video.params.changeFunctionId;
    //         const cutOffset = -state.patterns[patternId]?.video.params.cutOffset;
    //
    //         const cf = state.changeFunctions.functions[cfId];
    //
    //         if (cf) {
    //
    //             return cutOffset + videoChangeFunctionByType[cf.type](
    //                 x, y,
    //                 state.patterns[patternId]?.current.imageData.width,
    //                 state.patterns[patternId]?.current.imageData.height,
    //                 cf.params, state.patterns) * (1 - cutOffset);
    //         } else {
    //             return cutOffset;//state.patterns[patternId]?.current.imageData.width;
    //         }
    //     },
    //     edgeMode,
    //     slitMode,
    //     stackType,
    //     mirrorMode,
    // });
    //
    // const interval = setInterval(() => {
    //     const pattern = getState().patterns[patternId];
    //     const imageData = pattern.current.imageData;
    //     if (imageData.data[imageData.data.length - 1] === 0) {
    //         Captures.captures[patternId]?.setHeight(height)
    //         clearInterval(interval);
    //     }
    // }, 50);

};

export const stop = (id: string) => (dispatch, getState: () => AppState) => {
    dispatch(updateImage({
        id,
        noHistory: true,
        emit: true,
    }));
    dispatch({type: EVideoAction.STOP_UPDATING, id});
    patternsService.pattern[id].videoService.stop();
    // Captures.stop(patternId);
};

export const setEdgeMode = (id: string, value: EdgeMode) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_EDGE_MODE,
        id,
        value
    });
    // Captures.captures[id]?.setEdgeMode(value);
    patternsService.pattern[id].videoService.setEdgeMode(value);
};

export const setMirrorMode = (id: string, value: MirrorMode) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_MIRROR_MODE,
        id,
        value
    });
    // Captures.captures[id]?.setMirrorMode(value);
    patternsService.pattern[id].videoService.setMirrorMode(value);
};

export const setSlitMode = (id: string, value: SlitMode) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_SLIT_MODE,
        id,
        value
    });
    // Captures.captures[id]?.setSlitMode(value);
    patternsService.pattern[id].videoService.setSlitMode(value);
};
export const setStackType = (id: string, value: StackType) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_STACK_TYPE,
        id,
        value
    });
    // Captures.captures[id]?.stack.setType(value);
    patternsService.pattern[id].videoService.setStackType(value);
};

export const setChangeFunction = (id: string, changeFunctionId: string) => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_CHANGE_FUNCTION,
        id,
        value: changeFunctionId
    });

    dispatch(removeCfToPatternDependency(patternsService.pattern[id].videoService.changeFunctionId, id));

    patternsService.pattern[id].videoService.setChangeFunction(changeFunctionId);

    changeFunctionId && dispatch(addCfToPatternDependency(changeFunctionId, id));
};

export const setStackSize = (id: string, value: number): ThunkAction<any, any, any, SetStackSizeAction> => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_STACK_SIZE,
        id,
        value
    });
    const pattern = getState().patterns[id];

    // Captures.captures[id]?.setDepth(pattern.current.imageData.width * value);
    patternsService.pattern[id].videoService.setDepth(value);
};

export const setCutOffset = (id: string, value: number): ThunkAction<any, any, any, SetCutOffsetAction> => (dispatch, getState: () => AppState) => {
    dispatch({
        type: EVideoAction.SET_CUT_OFFSET,
        id,
        value
    });
    // const pattern = getState().patterns[id];

    // Captures.captures[id]?.update();
    patternsService.pattern[id].videoService.setCutOffset(value);
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
    patternsService.pattern[id].videoService.update();

    const state = getState();

    // state.dependencies.patternToChangeFunction[id]?.forEach(cfId => {
    //     state.dependencies.changeFunctionToPattern[cfId]?.forEach((patternId) => {
    //         if (patternId !== id)
    //             dispatch(updateVideo(patternId));
    //     });
    // }); // вот про это надо пдуать еще// это достигается за счет включенного обновления
};

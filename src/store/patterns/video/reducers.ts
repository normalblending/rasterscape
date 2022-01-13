import {reducePattern} from "../pattern/helpers";
import {PatternAction, PatternState} from "../pattern/types";
import {
    SetCFAction, SetCutOffsetAction, SetDeviceAction,
    SetEdgeModeAction, SetMirrorModeAction,
    SetSlitModeAction, SetStackSizeAction,
    SetStackTypeAction,
    SetVideoParamsAction
} from "./actions";
import {act} from "react-dom/test-utils";
import {EVideoAction} from "./consts";

export const videoReducers = {

    [EVideoAction.START_CAMERA]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    cameraOn: true,
                }
            }
        })),
    [EVideoAction.STOP_CAMERA]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    cameraOn: false,
                }
            }
        })),
    [EVideoAction.START_UPDATING]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    updatingOn: true,
                }
            }
        })),
    [EVideoAction.STOP_UPDATING]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    updatingOn: false,
                }
            }
        })),


    [EVideoAction.SET_VIDEO_PARAMS]: reducePattern<SetVideoParamsAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    ...action.value
                }
            }
        })),
    [EVideoAction.SET_DEVICE]: reducePattern<SetDeviceAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    device: action.device
                }
            }
        })),
    [EVideoAction.SET_EDGE_MODE]: reducePattern<SetEdgeModeAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    edgeMode: action.value
                }
            }
        })),
    [EVideoAction.SET_MIRROR_MODE]: reducePattern<SetMirrorModeAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    mirrorMode: action.value
                }
            }
        })),
    [EVideoAction.SET_SLIT_MODE]: reducePattern<SetSlitModeAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    slitMode: action.value
                }
            }
        })),
    [EVideoAction.SET_STACK_TYPE]: reducePattern<SetStackTypeAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    stackType: action.value
                }
            }
        })),
    [EVideoAction.SET_CHANGE_FUNCTION]: reducePattern<SetCFAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    changeFunctionId: action.value
                }
            }
        })),
    [EVideoAction.SET_STACK_SIZE]: reducePattern<SetStackSizeAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    stackSize: action.value
                }
            }
        })),
    [EVideoAction.SET_CUT_OFFSET]: reducePattern<SetCutOffsetAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    cutOffset: action.value
                }
            }
        })),
};

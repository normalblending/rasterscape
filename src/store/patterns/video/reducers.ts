import {reducePattern} from "../pattern/helpers";
import {PatternAction, PatternState} from "../pattern/types";
import {
    EVideoAction,
    SetCFAction, SetCutOffsetAction,
    SetEdgeModeAction, SetMirrorModeAction,
    SetSlitModeAction, SetStackSizeAction,
    SetStackTypeAction,
    SetVideoParamsAction
} from "./actions";
import {act} from "react-dom/test-utils";

export const videoReducers = {
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
    [EVideoAction.START]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    on: true,
                    pause: false,
                }
            }
        })),
    [EVideoAction.STOP]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    on: false,
                    pause: false,
                }
            }
        })),
    [EVideoAction.PAUSE]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    pause: true,
                }
            }
        })),
    [EVideoAction.PLAY]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            video: {
                ...pattern.video,
                params: {
                    ...pattern.video.params,
                    pause: false,
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
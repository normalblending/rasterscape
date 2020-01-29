import {reducePattern} from "../pattern/helpers";
import {PatternState} from "../pattern/types";
import {EVideoAction, SetVideoParamsAction} from "./actions";

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
};
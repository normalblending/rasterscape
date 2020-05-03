import {EBlurAction, SetBlurAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const blurReducers = {
    [EBlurAction.SET_BLUR]: reducePattern<SetBlurAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            blur: pattern.blur && {
                ...pattern.blur,
                value: {
                    ...pattern.blur.value,
                    ...action.blur
                }
            }
        })),
};
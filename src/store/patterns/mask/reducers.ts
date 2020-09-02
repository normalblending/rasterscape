import {EMaskAction, SetMaskParamsAction, UpdatePatternMaskAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {historyPush} from "../history/helpers";
import {patternValues} from "../values";

export const maskReducers = {
    [EMaskAction.SET_MASK_PARAMS]: reducePattern<SetMaskParamsAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            mask: pattern.mask && {
                ...pattern.mask,
                params: {
                    ...pattern.mask.params,
                    ...action.params
                }
            }
        })),





    [EMaskAction.UPDATE_MASK]: reducePattern<UpdatePatternMaskAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            mask: {
                ...pattern.mask,
                value: {
                    ...pattern.mask.value,
                    imageData: action.imageData
                }
            },
            resultImage: patternValues.setValue(action.id, pattern.current.imageData, pattern.config.mask && action.imageData),
            history: pattern.history && historyPush(pattern.history, {
                maskValue: pattern.mask.value
            })
        })),
};
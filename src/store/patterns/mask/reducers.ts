import {EMaskAction, SetMaskParamsAction, UpdatePatternMaskAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {historyPush} from "../history/helpers";
import {patternValues} from "../values";
import {MaskParams} from "./types";

export const maskReducers = {
    [EMaskAction.SET_MASK_PARAMS]: reducePattern<SetMaskParamsAction>(
        (pattern: PatternState, action) => {
            const maskParams: MaskParams = {
                ...pattern.mask.params,
                ...action.params
            };
            return ({
                ...pattern,
                resultImage: patternValues.setValue(action.id, pattern.current.imageData, pattern.mask?.value.imageData, maskParams?.inverse),
                mask: pattern.mask && {
                    ...pattern.mask,
                    params: maskParams
                }
            });
        }),


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
            resultImage: patternValues.setValue(action.id, pattern.current.imageData, pattern.config.mask && action.imageData, pattern.mask?.params.inverse),
            history: action.noHistory ? pattern.history : (
                pattern.history && historyPush(pattern.history, {
                    current: pattern.current,
                    maskValue: pattern.mask.value
                })
            )
        })),
};
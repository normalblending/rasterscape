import {EMaskAction, SetMaskParamsAction, UpdatePatternMaskAction} from "./actions";
import {PatternState} from "../pattern/types";
import {getMaskedImage} from "../../../utils/canvas/helpers/imageData";
import {reducePattern} from "../pattern/helpers";
import {historyPush} from "../history/helpers";

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
            resultImage: getMaskedImage(pattern.current.imageData, action.imageData),
            history: pattern.history && historyPush(pattern.history, {
                maskValue: pattern.mask.value
            })
        })),
};
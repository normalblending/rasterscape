import {ERepeatingAction, SetRepeatingAction, SetRepeatsParamsAction, SetRepeatsTypeAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const repeatingReducers = {
    [ERepeatingAction.SET_REPEATING]: reducePattern<SetRepeatingAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            repeating: pattern.repeating && {
                ...pattern.repeating,
                params: action.repeating
            }
        })),
    [ERepeatingAction.SET_TYPE]: reducePattern<SetRepeatsTypeAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            repeating: pattern.repeating && {
                ...pattern.repeating,
                params: {
                    ...pattern.repeating.params,
                    type: action.repeatsType
                }
            }
        })),
    [ERepeatingAction.SET_PARAMS]: reducePattern<SetRepeatsParamsAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            repeating: pattern.repeating && {
                ...pattern.repeating,
                params: {
                    ...pattern.repeating.params,
                    typeParams: {
                        ...pattern.repeating.params.typeParams,
                        [action.repeatsType]: action.params
                    }
                }
            }
        })),
};
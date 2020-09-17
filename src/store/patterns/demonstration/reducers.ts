import {EDemonstrationAction, SetDemonstrationEnabledAction, SetDemonstrationParamsAction} from "./actions";
import {PatternAction, PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const demonstrationReducers = {
    [EDemonstrationAction.TOGGLE_DEMONSTRATION]: reducePattern<PatternAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            demonstration: pattern.demonstration && {
                ...pattern.demonstration,
                value: {
                    ...pattern.demonstration.value,
                    enabled: !pattern.demonstration.value.enabled
                }
            }
        })),
    [EDemonstrationAction.SET_DEMONSTRATION_ENABLED]: reducePattern<SetDemonstrationEnabledAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            demonstration: pattern.demonstration && {
                ...pattern.demonstration,
                value: {
                    ...pattern.demonstration.value,
                    enabled: action.enabled
                }
            }
        })),
    [EDemonstrationAction.SET_DEMONSTRATION_PARAMS]: reducePattern<SetDemonstrationParamsAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            demonstration: pattern.demonstration && {
                ...pattern.demonstration,
                params: {
                    ...pattern.demonstration.params,
                    ...action.params,
                }
            }
        })),
};
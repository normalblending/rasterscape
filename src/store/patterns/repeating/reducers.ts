import {ERepeatingAction, SetRepeatingAction} from "./actions";
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
};
import {ERotationAction, SetRotationAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const rotatingReducers = {
    [ERotationAction.SET_ROTATION]: reducePattern<SetRotationAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            rotation: pattern.rotation && {
                ...pattern.rotation,
                value: action.rotation
            }
        })),
};
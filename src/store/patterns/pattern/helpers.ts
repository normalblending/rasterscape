import {PatternsState} from "../types";
import {PatternAction, PatternConfig, PatternParams, PatternState} from "./types";

export type PatternReducer<T extends PatternAction> =
    (pattern: PatternState, action: T, state: PatternsState) => PatternState

export const reducePattern = <T extends PatternAction>(reducer: PatternReducer<T>) =>
    (state: PatternsState, action: T) => ({
        ...state,
        [action.id]: reducer(state[action.id], action, state)
    });

export const getPatternConfig = (pattern: PatternState): PatternConfig => {
    return {
        startImage: pattern.current.imageData,
        startMask: pattern.mask.value.imageData,

        width: pattern.current.width,
        height: pattern.current.height,

        history: !!pattern.history,

        store: !!pattern.store,

        selection: !!pattern.selection,

        mask: !!pattern.mask,

        rotation: !!pattern.rotation,

        repeating: !!pattern.repeating,

        room: !!pattern.room
    }
};
export const getPatternParams = (pattern: PatternState): PatternParams => {
    return {
        history: pattern.history && pattern.history.params,

        store: pattern.store && pattern.store.params,

        rotation: pattern.rotation && pattern.rotation.params,

        repeating: pattern.repeating && pattern.repeating.params,

        selection: pattern.selection && pattern.selection.params,

        mask: pattern.mask && pattern.mask.params,

        import: pattern.import && pattern.import.params,

        room: pattern.room && pattern.room.params
    }
};
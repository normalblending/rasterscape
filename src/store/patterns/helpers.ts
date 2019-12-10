import {
    ERepeatingType,
    HistoryParams, HistoryState, HistoryValue,
    MaskParams, MaskValue,
    PatternAction,
    PatternConfig, PatternHistoryItem,
    PatternParams, PatternState, RepeatingParams, RepeatingValue, RotationParams, RotationValue,
    SelectionParams, SelectionValue,
    StoreParams
} from "./types";
import {createCleanCanvasState} from "../../utils/state";
import {PatternsState} from "./reducer";
import {omit} from "lodash";
import {CanvasState, FunctionState} from "../../utils/types";

export const patternId = (state: PatternsState) =>
    (Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1).toString();


export const createPatternInitialState = (id: string, config?: PatternConfig, params?: PatternParams): PatternState => {
    const {width = 300, height = 300, history, store, selection, mask, rotation, repeating} = config || {};
    return {
        id,
        config,
        resultImage: null,
        current: createCleanCanvasState(width, height),
        history: getHistoryState(history, undefined, (params || {}).history),
        store: getStoreState(store, undefined, (params || {}).store),
        selection: getSelectionState(selection, undefined, (params || {}).selection),
        mask: getMaskState(width, height)(mask, undefined, (params || {}).mask),
        rotation: getRotationState(rotation, undefined, (params || {}).rotation),
        repeating: getRepeatingState(repeating, undefined, (params || {}).repeating)
    }
};

export const updatePatternState = (state: PatternState, config: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating} = config || {};
    params = params || {};
    return {
        config,
        id: state.id,
        current: state.current,
        resultImage: state.resultImage,
        history: getHistoryState(history, state.history, params.history),
        store: getStoreState(store, state.store, params.store),
        selection: getSelectionState(selection, state.selection, params.selection),
        mask: getMaskState(state.current.width, state.current.height)(mask, state.mask, params.mask),
        rotation: getRotationState(rotation, state.rotation, params.rotation),
        repeating: getRepeatingState(repeating, state.repeating, params.repeating)
    }
};

const getFunctionState = <V, P>(initialValue: V, initialParams: P) =>
    (enabled?: boolean, state?: FunctionState<V, P>, params?: P): FunctionState<V, P> => {
        if (!enabled)
            return;

        return {
            value: state ? state.value : initialValue,
            params: params
                ? (state ? {
                    ...state.params,
                    ...params
                } : {
                    ...initialParams,
                    ...params
                })
                : (state ? state.params : initialParams)
        };
    };

export const getHistoryState = getFunctionState<HistoryValue, HistoryParams>({
    before: [],
    after: [],
}, {
    length: 4
});

export const getStoreState = getFunctionState<CanvasState, StoreParams>(null, {});

export const getSelectionState = getFunctionState<SelectionValue, SelectionParams>(null, {});

export const getMaskState = (width, height) => getFunctionState<MaskValue, MaskParams>(
    createCleanCanvasState(width, height), {
        opacity: 1,
        black: true
    });

export const getRotationState = getFunctionState<RotationValue, RotationParams>(
    {
        angle: 0,
        offset: {
            x: 0,
            y: 0
        }
    }, {});

export const getRepeatingState = getFunctionState<RepeatingValue, RepeatingParams>(
    {}, {
        type: ERepeatingType.Grid,
        gridParams: {
            x: 2,
            y: 2,
            integer: true
        }
    });


export const removePattern = (state: PatternsState, id: string) => omit(state, id);

export type PatternReducer<T extends PatternAction> =
    (pattern: PatternState, action: T, state: PatternsState) => PatternState

export const reducePattern = <T extends PatternAction>(reducer: PatternReducer<T>) =>
    (state: PatternsState, action: T) => ({
        ...state,
        [action.id]: reducer(state[action.id], action, state)
    });


export const historyPush = (history: HistoryState, current: PatternHistoryItem): HistoryState => {
    const {value: {before}, params: {length: historyLength}} = history;

    const beforeNext: PatternHistoryItem[] = [...before, current];
    const afterNext: PatternHistoryItem[] = [];

    if (beforeNext.length > historyLength)
        beforeNext.shift();

    return {
        ...history,
        value: {
            before: beforeNext,
            after: afterNext
        }
    }
};

export interface PatternUndoResult {
    history: HistoryState
    prev: PatternHistoryItem
}

export const historyUndo = (history: HistoryState, current: PatternHistoryItem): PatternUndoResult => {
    const {value: {before, after}} = history;

    if (before.length === 0) return null;

    const prev = before[before.length - 1];

    const beforeNext = before.slice(0, before.length - 1); // pop
    const afterNext = [current, ...after]; // unshift current

    return {
        history: {
            ...history,
            value: {
                before: beforeNext,
                after: afterNext
            }
        },
        prev
    }
};

export interface PatternRedoResult {
    history: HistoryState
    next: PatternHistoryItem
}

export const historyRedo = (history: HistoryState, current: PatternHistoryItem): PatternRedoResult => {
    const {value: {before, after}} = history;

    if (after.length === 0) return null;

    const next = after[0];

    const beforeNext = [...before, current]; // push current
    const afterNext = after.slice(1, after.length); // shift

    return {
        history: {
            ...history,
            value: {
                before: beforeNext,
                after: afterNext
            }
        },
        next
    }
};
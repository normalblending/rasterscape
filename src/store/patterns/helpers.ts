import {PatternAction} from "./types";
import {createCleanCanvasState} from "../../utils/canvas";
import {HistoryValue, PatternsState, PatternState} from "./reducer";
import {omit} from "lodash";
import {CanvasState, FunctionState, SelectionValue} from "../../utils/types";

export const patternId = (state: PatternsState) =>
    Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1;


export interface HistoryParams {
    length?: number
}

export interface StoreParams {

}

export interface SelectionParams {
    strokeColor?: string
    strokeOpacity?: number
    fillColor?: string
    fillOpacity?: number
}

export interface PatternParams {
    history?: HistoryParams

    store?: StoreParams

    selection?: SelectionParams
}

export interface PatternConfig {

    width?: number
    height?: number

    history?: boolean

    store?: boolean

    selection?: boolean

}

export const createPatternInitialState = (id: number, config?: PatternConfig, params?: PatternParams): PatternState => {
    const {width = 300, height = 300, history, store, selection} = config || {};
    return {
        id,
        config,
        current: createCleanCanvasState(width, height),
        history: getHistoryState(history, undefined, (params || {}).history),
        store: getStoreState(store, undefined, (params || {}).store),
        selection: getSelectionState(selection, undefined, (params || {}).selection),
    }
};

export const updatePatternState = (state: PatternState, config: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection} = config || {};
    return {
        config,
        id: state.id,
        current: state.current,
        history: getHistoryState(history, state.history, params.history),
        store: getStoreState(store, state.store, params.store),
        selection: getSelectionState(selection, state.selection, params.selection),
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



export const removePattern = (state: PatternsState, id: number) => omit(state, id);

export type PatternReducer<T extends PatternAction> =
    (pattern: PatternState, action: T, state: PatternsState) => PatternState

export const reducePattern = <T extends PatternAction>(reducer: PatternReducer<T>) =>
    (state: PatternsState, action: T) => ({
        ...state,
        [action.id]: reducer(state[action.id], action, state)
    });

export const updateCurrentImage = (state: PatternState, nextCurrent) => {
    if (state.history) {
        const {history: {value: {before}, params: {length: historyLength}}, current: currentPrev} = state;

        const beforeNext: CanvasState[] = [...before, currentPrev];
        const afterNext: CanvasState[] = [];

        if (beforeNext.length > historyLength)
            beforeNext.shift();

        return {
            ...state,
            current: {
                ...state.current,
                ...nextCurrent
            },
            history: {
                ...state.history,
                value: {
                    before: beforeNext,
                    after: afterNext
                }
            }
        }
    } else {
        return {
            ...state,
            current: {
                ...state.current,
                ...nextCurrent
            }
        }
    }
};

import {
    ERepeatingType,
    HistoryParams,
    HistoryState,
    HistoryValue,
    LoadingParams,
    LoadingValue,
    MaskParams,
    MaskValue,
    PatternAction,
    PatternConfig,
    PatternHistoryItem,
    PatternParams,
    PatternState,
    RepeatingParams,
    RepeatingValue,
    RotationParams,
    RotationValue,
    SelectionParams,
    SelectionValue,
    StoreParams
} from "./types";
import {createCanvasStateFromImageData, createCleanCanvasState} from "../../utils/state";
import {PatternsState} from "./reducer";
import {omit} from "lodash";
import {CanvasState, FunctionState} from "../../utils/types";
import {getMaskFromSegments} from "../../utils/path";
import {createCanvas} from "../../utils/canvas/canvas";
import {imageDataToCanvas} from "../../utils/canvas/imageData";

export const patternId = (state: PatternsState) =>
    (Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1).toString();


export const createPatternInitialState = (id: string, config?: PatternConfig, params?: PatternParams): PatternState => {
    const {history, store, selection, mask, rotation, repeating, startImage} = config || {};

    const width = startImage ? startImage.width : (config.width || 300);
    const height = startImage ? startImage.height : (config.height || 300);

    return {
        id,
        config,
        resultImage: null,
        current: startImage ? createCanvasStateFromImageData(startImage) : createCleanCanvasState(width, height),
        history: getHistoryState(history, undefined, (params || {}).history),
        store: getStoreState(store, undefined, (params || {}).store),
        selection: getSelectionState(selection, undefined, (params || {}).selection),
        mask: getMaskState(width, height)(mask, undefined, (params || {}).mask),
        rotation: getRotationState(rotation, undefined, (params || {}).rotation),
        repeating: getRepeatingState(repeating, undefined, (params || {}).repeating),
        loading: getLoadingState(true, undefined, (params || {}).loading)
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
        repeating: getRepeatingState(repeating, state.repeating, params.repeating),
        loading: getLoadingState(true, state.loading, params.loading)
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

export const getSelectionState = getFunctionState<SelectionValue, SelectionParams>({
    segments: [],
    bBox: null,
    mask: null
}, {});

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
            bezierPoints: [{x: 0, y: 0}, {x: 40, y: 40}, {x: 50, y: 50}, {x: 100, y: 100}],
            integer: true
        }
    });

export const getLoadingState = getFunctionState<LoadingValue, LoadingParams>(
    {}, {
        fit: false
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

export const getPatternConfig = (pattern: PatternState): PatternConfig => {
    return {
        startImage: pattern.current.imageData,

        width: pattern.current.width,
        height: pattern.current.height,

        history: !!pattern.history,

        store: !!pattern.store,

        selection: !!pattern.selection,

        mask: !!pattern.mask,

        rotation: !!pattern.rotation,

        repeating: !!pattern.repeating
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

        loading: pattern.loading && pattern.loading.params
    }
};

export const getSelectedImageData = (pattern: PatternState): ImageData => {
    const bbox = pattern.selection.value.bBox;
    const maskImageData = getMaskFromSegments(pattern.current.width, pattern.current.height, pattern.selection.value.segments);

    const {context} = createCanvas(pattern.current.width, pattern.current.height);

    if (maskImageData) {
        context.putImageData(maskImageData, 0, 0);
        context.globalCompositeOperation = "source-in";
    }
    context.drawImage(imageDataToCanvas(pattern.current.imageData), 0, 0, pattern.current.width, pattern.current.height);

    context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);


    return context.getImageData(bbox.x, bbox.y, bbox.width, bbox.height);

};
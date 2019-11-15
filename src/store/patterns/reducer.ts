import {handleActions} from "redux-actions";
import {EPatternAction, EPatternsAction} from "./actions";
import {
    createPatternInitialState, HistoryParams, PatternConfig,
    patternId,
    reducePattern,
    removePattern, SelectionParams, StoreParams,
    updateCurrentImage, updatePatternState
} from "./helpers";
import {
    AddPatternAction,
    EditPatternConfigAction,
    PatternUndoAction,
    RemovePatternAction, SetPatternHeightAction, SetPatternWidthAction,
    UpdatePatternImageAction, UpdatePatternSelectionAction
} from "./types";
import {CanvasState, FunctionState, SelectionValue} from "../../utils/types";
import {resizeImageData} from "../../utils/imageData";


export interface HistoryValue {
    before: CanvasState[],
    after: CanvasState[]
}

export type HistoryState = FunctionState<HistoryValue, HistoryParams>;

export type StoreState = FunctionState<CanvasState, StoreParams>;

export type SelectionState = FunctionState<SelectionValue, SelectionParams>;


export interface PatternState {
    id: number
    config: PatternConfig
    current: CanvasState
    history?: HistoryState,
    store?: StoreState,
    selection?: SelectionState
}

export interface PatternsState {
    [id: string]: PatternState
}

export const patternsReducer = handleActions<PatternsState>({
    [EPatternsAction.ADD_PATTERN]: (state: PatternsState, action: AddPatternAction) => {
        const id = patternId(state);
        return {
            ...state,
            [id]: createPatternInitialState(id, action.config)
        }
    },
    [EPatternsAction.REMOVE_PATTERN]: (state: PatternsState, action: RemovePatternAction) =>
        removePattern(state, action.id),
    [EPatternAction.UPDATE_IMAGE]: reducePattern<UpdatePatternImageAction>(
        (pattern: PatternState, action) =>
            updateCurrentImage(pattern, {imageData: action.imageData})),
    [EPatternAction.EDIT_CONFIG]: reducePattern<EditPatternConfigAction>(
        (pattern: PatternState, action) =>
            updatePatternState(pattern, action.config)),
    [EPatternAction.UNDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
        const {history: {value: {before, after}}, current} = pattern;

        if (before.length === 0) return pattern;

        const prevCanvasState = before[before.length - 1];

        const beforeNext = before.slice(0, before.length - 1); // pop
        const afterNext = [current, ...after]; // unshift current

        return {
            ...pattern,
            current: {...prevCanvasState},
            history: {
                ...pattern.history,
                value: {
                    before: beforeNext,
                    after: afterNext
                }
            }
        }
    }),
    [EPatternAction.REDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {

        const {history: {value: {before, after}}, current} = pattern;

        if (after.length === 0) return pattern;

        const nextCanvasState = after[0];

        const beforeNext = [...before, current]; // push current
        const afterNext = after.slice(1, after.length); // shift

        return {
            ...pattern,
            current: {...nextCanvasState},
            history: {
                ...pattern.history,
                value: {
                    before: beforeNext,
                    after: afterNext
                }
            }
        }
    }),
    [EPatternAction.UPDATE_SELECTION]: reducePattern<UpdatePatternSelectionAction>(
        (pattern: PatternState, action) => {
            return ({
                ...pattern,
                selection: {
                    ...pattern.selection,
                    value: action.value
                }
            })
        }),
    [EPatternAction.SET_WIDTH]: reducePattern<SetPatternWidthAction>(
        (pattern: PatternState, action) =>
            updateCurrentImage(pattern, {
                width: action.width,
                imageData: resizeImageData(pattern.current.imageData, action.width, pattern.current.height)
            })),
    [EPatternAction.SET_HEIGHT]: reducePattern<SetPatternHeightAction>(
        (pattern: PatternState, action) =>
            updateCurrentImage(pattern, {
                height: action.height,
                imageData: resizeImageData(pattern.current.imageData, pattern.current.width, action.height)
            })),

}, {});



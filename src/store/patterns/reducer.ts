import {handleActions} from "redux-actions";
import {EPatternAction, EPatternsAction} from "./actions";
import {
    createPatternInitialState,
    historyPush, historyRedo, historyUndo,
    patternId,
    reducePattern,
    removePattern,
    updatePatternState
} from "./helpers";
import {
    AddPatternAction,
    CreateRoomAction,
    EditPatternConfigAction,
    PatternState,
    PatternUndoAction,
    RemovePatternAction, SetMaskParamsAction,
    SetPatternHeightAction,
    SetPatternWidthAction,
    UpdatePatternImageAction,
    UpdatePatternMaskAction,
    UpdatePatternSelectionAction
} from "./types";
import {maskedImage, resizeImageData} from "../../utils/imageData";


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


    [EPatternAction.EDIT_CONFIG]: reducePattern<EditPatternConfigAction>(
        (pattern: PatternState, action) =>
            updatePatternState(pattern, action.config)),


    [EPatternAction.SET_WIDTH]: reducePattern<SetPatternWidthAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            current: {
                ...pattern.current,
                width: action.width,
                imageData: resizeImageData(pattern.current.imageData, action.width, pattern.current.height)
            },
            mask: pattern.mask && {
                ...pattern.mask,
                value: {
                    ...pattern.mask.value,
                    width: action.width,
                    imageData: resizeImageData(pattern.mask.value.imageData, action.width, pattern.mask.value.height)
                }
            },
            history: pattern.history && historyPush(pattern.history, {
                current: pattern.current,
                maskValue: pattern.mask && pattern.mask.value
            })
        })),
    [EPatternAction.SET_HEIGHT]: reducePattern<SetPatternHeightAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            current: {
                ...pattern.current,
                height: action.height,
                imageData: resizeImageData(pattern.current.imageData, pattern.current.width, action.height)
            },
            mask: pattern.mask && {
                ...pattern.mask,
                value: {
                    ...pattern.mask.value,
                    height: action.height,
                    imageData: resizeImageData(pattern.mask.value.imageData, pattern.mask.value.width, action.height)
                }
            },
            history: pattern.history && historyPush(pattern.history, {
                current: pattern.current,
                maskValue: pattern.mask && pattern.mask.value
            })
        })),

    [EPatternAction.SET_MASK_PARAMS]: reducePattern<SetMaskParamsAction>(
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

    [EPatternAction.UPDATE_IMAGE]: reducePattern<UpdatePatternImageAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            current: {
                ...pattern.current,
                imageData: action.imageData
            },
            resultImage: maskedImage(action.imageData, pattern.mask && pattern.mask.value.imageData),
            history: pattern.history && historyPush(pattern.history, {
                current: pattern.current
            })
        })),

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

    [EPatternAction.UPDATE_MASK]: reducePattern<UpdatePatternMaskAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            mask: {
                ...pattern.mask,
                value: {
                    ...pattern.mask.value,
                    imageData: action.imageData
                }
            },
            resultImage: maskedImage(pattern.current.imageData, action.imageData),
            history: pattern.history && historyPush(pattern.history, {
                maskValue: pattern.mask.value
            })
        })),

    [EPatternAction.UNDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
        const undoResult = historyUndo(pattern.history, {
            current: pattern.current,
            maskValue: pattern.mask && pattern.mask.value
        });
        if (!undoResult) return pattern;

        return {
            ...pattern,
            history: undoResult.history,
            current: undoResult.prev.current || pattern.current,
            mask: pattern.mask && {
                ...pattern.mask,
                value: undoResult.prev.maskValue || pattern.mask.value
            }
        }

    }),
    [EPatternAction.REDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
        const redoResult = historyRedo(pattern.history, {
            current: pattern.current,
            maskValue: pattern.mask && pattern.mask.value
        });
        if (!redoResult) return pattern;

        return {
            ...pattern,
            history: redoResult.history,
            current: redoResult.next.current || pattern.current,
            mask: pattern.mask && {
                ...pattern.mask,
                value: redoResult.next.maskValue || pattern.mask.value
            }
        }
    }),

    [EPatternAction.CREATE_ROOM]: reducePattern<CreateRoomAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            connected: action.roomName,
            socket: action.socket,
        }))
}, {});



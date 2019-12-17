import {handleActions} from "redux-actions";
import {EPatternAction, EPatternsAction} from "./actions";
import {
    createPatternInitialState, historyPush, historyRedo, historyUndo,
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
    RemovePatternAction, SetLoadingParamsAction, SetMaskParamsAction,
    SetPatternHeightAction,
    SetPatternWidthAction, SetRepeatingAction, SetRotationAction,
    UpdatePatternImageAction,
    UpdatePatternMaskAction,
    UpdatePatternSelectionAction
} from "./types";
import {maskedImage, resizeImageData} from "../../utils/canvas/imageData";
import {getMaskFromSegments} from "../../utils/path";


export interface PatternsState {
    [id: string]: PatternState
}

export const patternsReducer = handleActions<PatternsState>({

    [EPatternsAction.ADD_PATTERN]: (state: PatternsState, action: AddPatternAction) => {
        const id = patternId(state);
        return {
            ...state,
            [id]: createPatternInitialState(id, action.config, action.params)
        }
    },
    [EPatternsAction.REMOVE_PATTERN]: (state: PatternsState, action: RemovePatternAction) =>
        removePattern(state, action.id),


    [EPatternAction.EDIT_CONFIG]: reducePattern<EditPatternConfigAction>(
        (pattern: PatternState, action) =>
            updatePatternState(pattern, action.config)),


    [EPatternAction.SET_WIDTH]: reducePattern<SetPatternWidthAction>(
        (pattern: PatternState, action) => {
            const newCurrentImageData = resizeImageData(pattern.current.imageData, action.width, pattern.current.height);
            const newMaskImageData = pattern.mask && resizeImageData(pattern.mask.value.imageData, action.width, pattern.mask.value.height);
            return {
                ...pattern,
                current: {
                    ...pattern.current,
                    width: action.width,
                    imageData: newCurrentImageData
                },
                mask: pattern.mask && {
                    ...pattern.mask,
                    value: {
                        ...pattern.mask.value,
                        width: action.width,
                        imageData: newMaskImageData
                    }
                },
                history: pattern.history && historyPush(pattern.history, {
                    current: pattern.current,
                    maskValue: pattern.mask && pattern.mask.value
                }),
                resultImage: maskedImage(newCurrentImageData, newMaskImageData),
            }
        }),
    [EPatternAction.SET_HEIGHT]: reducePattern<SetPatternHeightAction>(
        (pattern: PatternState, action) => {
            const newCurrentImageData = resizeImageData(pattern.current.imageData, pattern.current.width, action.height);
            const newMaskImageData = pattern.mask && resizeImageData(pattern.mask.value.imageData, pattern.mask.value.width, action.height);
            return {
                ...pattern,
                current: {
                    ...pattern.current,
                    height: action.height,
                    imageData: newCurrentImageData
                },
                mask: pattern.mask && {
                    ...pattern.mask,
                    value: {
                        ...pattern.mask.value,
                        height: action.height,
                        imageData: newMaskImageData
                    }
                },
                history: pattern.history && historyPush(pattern.history, {
                    current: pattern.current,
                    maskValue: pattern.mask && pattern.mask.value
                }),
                resultImage: maskedImage(newCurrentImageData, newMaskImageData),
            }
        }),

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
                imageData: action.imageData,
                width: action.imageData.width,
                height: action.imageData.height,
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
                    value: {
                        segments: action.value,
                        mask: action.value.length
                            ? getMaskFromSegments(pattern.current.width, pattern.current.height, action.value)
                            : null,
                        bBox: action.bBox
                    }
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


    [EPatternAction.SET_ROTATION]: reducePattern<SetRotationAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            rotation: pattern.rotation && {
                ...pattern.rotation,
                value: action.rotation
            }
        })),


    [EPatternAction.SET_REPEATING]: reducePattern<SetRepeatingAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            repeating: pattern.repeating && {
                ...pattern.repeating,
                params: action.repeating
            }
        })),

    [EPatternAction.SET_LOADING_PARAMS]: reducePattern<SetLoadingParamsAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            loading: {
                ...pattern.loading,
                params: {
                    ...pattern.loading.params,
                    ...action.value
                }
            }
        })),

    [EPatternAction.CREATE_ROOM]: reducePattern<CreateRoomAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            connected: action.roomName,
            socket: action.socket,
        }))
}, {});



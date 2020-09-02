import {EHistoryAction, PatternUndoAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {historyRedo, historyUndo} from "./helpers";
import {patternValues} from "../values";

export const historyReducers = {
    [EHistoryAction.UNDO]: reducePattern<PatternUndoAction>((pattern: PatternState, action) => {
        const undoResult = historyUndo(pattern.history, {
            current: pattern.current,
            maskValue: pattern.mask && pattern.mask.value
        });
        if (!undoResult) return pattern;

        const current = undoResult.prev.current || pattern.current;
        const mask = pattern.mask && {
            ...pattern.mask,
            value: undoResult.prev.maskValue || pattern.mask.value
        };
        return {
            ...pattern,
            history: undoResult.history,
            current,
            resultImage: patternValues.setValue(action.id, current.imageData, pattern.config.mask && mask && mask.value.imageData),
            mask
        }

    }),
    [EHistoryAction.REDO]: reducePattern<PatternUndoAction>((pattern: PatternState, action) => {
        const redoResult = historyRedo(pattern.history, {
            current: pattern.current,
            maskValue: pattern.mask && pattern.mask.value
        });
        if (!redoResult) return pattern;
        const current = redoResult.next.current || pattern.current;
        const mask = pattern.mask && {
            ...pattern.mask,
            value: redoResult.next.maskValue || pattern.mask.value
        };
        return {
            ...pattern,
            history: redoResult.history,
            current,
            resultImage: patternValues.setValue(action.id, current.imageData, pattern.config.mask && mask && mask.value.imageData),
            mask: mask
        }
    }),
};
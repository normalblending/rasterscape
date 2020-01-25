import {EHistoryAction, PatternUndoAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {historyRedo, historyUndo} from "./helpers";

export const historyReducers = {
    [EHistoryAction.UNDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
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
    [EHistoryAction.REDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
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
};
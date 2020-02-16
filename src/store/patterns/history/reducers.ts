import {EHistoryAction, PatternUndoAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {historyRedo, historyUndo} from "./helpers";
import {getMaskedImage} from "../../../utils/canvas/helpers/imageData";

export const historyReducers = {
    [EHistoryAction.UNDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
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
            resultImage: getMaskedImage(current.imageData, mask && mask.value.imageData),
            mask
        }

    }),
    [EHistoryAction.REDO]: reducePattern<PatternUndoAction>((pattern: PatternState) => {
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
            resultImage: getMaskedImage(current.imageData, mask && mask.value.imageData),
            mask: mask
        }
    }),
};
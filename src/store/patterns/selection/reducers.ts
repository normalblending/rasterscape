import {ESelectionAction, UpdatePatternSelectionAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {getMaskFromSegments} from "./helpers";
import {patternValues} from "../values";

export const selectionReducers = {
    [ESelectionAction.UPDATE_SELECTION]: reducePattern<UpdatePatternSelectionAction>(
        (pattern: PatternState, action) => {
            const mask = action.value.length
                ? getMaskFromSegments(pattern.current.imageData.width, pattern.current.imageData.height, action.value)
                : null;
            return ({
                ...pattern,
                selection: {
                    ...pattern.selection,
                    value: {
                        segments: action.value,
                        mask,
                        bBox: action.bBox
                    }
                }
            })
        }),
};

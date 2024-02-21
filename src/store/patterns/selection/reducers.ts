import {ESelectionAction, UpdatePatternSelectionAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {getMaskFromSegments} from "./helpers";
import {patternValues} from "../values";

export const selectionReducers = {
    [ESelectionAction.UPDATE_SELECTION]: reducePattern<UpdatePatternSelectionAction>(
        (pattern: PatternState, action) => {
            return ({
                ...pattern,
                selection: {
                    ...pattern.selection,
                    value: {
                        segments: action.value,
                        bBox: action.bBox
                    }
                }
            })
        }),
};

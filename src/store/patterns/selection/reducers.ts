import {ESelectionAction, UpdatePatternSelectionAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";
import {getMaskFromSegments} from "./helpers";

export const selectionReducers = {
    [ESelectionAction.UPDATE_SELECTION]: reducePattern<UpdatePatternSelectionAction>(
        (pattern: PatternState, action) => {
            return ({
                ...pattern,
                selection: {
                    ...pattern.selection,
                    value: {
                        segments: action.value,
                        mask: action.value.length
                            ? getMaskFromSegments(pattern.current.imageData.width, pattern.current.imageData.height, action.value)
                            : null,
                        bBox: action.bBox
                    }
                }
            })
        }),
};
import {updatePatternState} from "../helpers";
import {
    EditPatternConfigAction,
    PatternState,
    SetPatternHeightAction,
    SetPatternWidthAction,
    UpdatePatternImageAction
} from "./types";
import {reducePattern} from "./helpers";
import {EPatternAction} from "./consts";

export const patternReducers = {
    [EPatternAction.EDIT_CONFIG]: reducePattern<EditPatternConfigAction>(
        (pattern: PatternState, action) =>
            updatePatternState(pattern, action.config)),

    [EPatternAction.UPDATE_IMAGE]: reducePattern<UpdatePatternImageAction>(
        (pattern: PatternState, action) => {

            return {
                ...pattern,
                width: action.imageData.width,
                height: action.imageData.height,
            }
        }),

    [EPatternAction.SET_WIDTH]: reducePattern<SetPatternWidthAction>(
        (pattern: PatternState, action) => {
            return {
                ...pattern,
                width: action.width,
            }
        }),

    [EPatternAction.SET_HEIGHT]: reducePattern<SetPatternHeightAction>(
        (pattern: PatternState, action) => {
            return {
                ...pattern,
                height: action.height,
            }
        }),

};

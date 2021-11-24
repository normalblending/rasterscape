import {updatePatternState} from "../helpers";
import {
    EditPatternConfigAction,
    PatternState,
    SetPatternHeightAction,
    SetPatternWidthAction,
    UpdatePatternImageAction
} from "./types";
import {resizeImageData} from "../../../utils/canvas/helpers/imageData";
import {reducePattern} from "./helpers";
import {historyPush} from "../history/helpers";
import {patternValues} from "../values";
import {EPatternAction} from "./consts";

export const patternReducers = {
    [EPatternAction.EDIT_CONFIG]: reducePattern<EditPatternConfigAction>(
        (pattern: PatternState, action) =>
            updatePatternState(pattern, action.config)),

    [EPatternAction.UPDATE_IMAGE]: reducePattern<UpdatePatternImageAction>(
        (pattern: PatternState, action) => {

            let resizedMask;
            if (pattern.current.imageData.width !== action.imageData.width
                || pattern.current.imageData.height !== action.imageData.height) {
                resizedMask = pattern.mask && resizeImageData(pattern.mask?.value?.imageData, action.imageData.width, action.imageData.height, !pattern.import.params.fit);

            }
            return {
                ...pattern,
                current: {
                    ...pattern.current,
                    imageData: action.imageData,
                    width: action.imageData.width,
                    height: action.imageData.height,
                },
                mask: resizedMask ? {
                    ...pattern.mask,
                    value: {
                        ...pattern.mask.value,
                        width: resizedMask.width,
                        height: resizedMask.height,
                        imageData: resizedMask
                    }
                } : pattern.mask,
                resultImage: patternValues.setValue(action.id, action.imageData, pattern.config.mask && pattern.mask?.value.imageData, pattern.mask?.params.inverse),
                history: action.noHistory ? pattern.history : (
                    pattern.history && historyPush(pattern.history, {
                        current: pattern.current
                    }))
            }
        }),

    [EPatternAction.SET_WIDTH]: reducePattern<SetPatternWidthAction>(
        (pattern: PatternState, action) => {
            const newCurrentImageData = resizeImageData(pattern.current.imageData, action.width, pattern.current.imageData.height, !pattern.import.params.fit);
            const newMaskImageData = pattern.mask && resizeImageData(pattern.mask.value.imageData, action.width, pattern.mask.value.imageData.height, !pattern.import.params.fit);
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
                resultImage: patternValues.setValue(action.id, newCurrentImageData, pattern.config.mask && newMaskImageData, pattern.mask?.params.inverse),
            }
        }),

    [EPatternAction.SET_HEIGHT]: reducePattern<SetPatternHeightAction>(
        (pattern: PatternState, action) => {
            const newCurrentImageData = resizeImageData(pattern.current.imageData, pattern.current.imageData.width, action.height, !pattern.import.params.fit);
            const newMaskImageData = pattern.mask && resizeImageData(pattern.mask.value.imageData, pattern.mask.value.imageData.width, action.height, !pattern.import.params.fit);
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
                resultImage: patternValues.setValue(action.id, newCurrentImageData, pattern.config.mask && newMaskImageData, pattern.mask?.params.inverse),
            }
        }),

};
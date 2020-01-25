import {EPatternAction} from "./actions";
import {updatePatternState} from "../helpers";
import {
    EditPatternConfigAction,
    PatternState,
    SetPatternHeightAction,
    SetPatternWidthAction,
    UpdatePatternImageAction
} from "./types";
import {getMaskedImage, resizeImageData} from "../../../utils/canvas/helpers/imageData";
import {reducePattern} from "./helpers";
import {historyPush} from "../history/helpers";

export const patternReducers = {
    [EPatternAction.EDIT_CONFIG]: reducePattern<EditPatternConfigAction>(
        (pattern: PatternState, action) =>
            updatePatternState(pattern, action.config)),

    [EPatternAction.UPDATE_IMAGE]: reducePattern<UpdatePatternImageAction>(
        (pattern: PatternState, action) => ({
            ...pattern,
            current: {
                ...pattern.current,
                imageData: action.imageData,
                width: action.imageData.width,
                height: action.imageData.height,
            },
            resultImage: getMaskedImage(action.imageData, pattern.mask && pattern.mask.value.imageData),
            history: pattern.history && historyPush(pattern.history, {
                current: pattern.current
            })
        })),

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
                resultImage: getMaskedImage(newCurrentImageData, newMaskImageData),
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
                resultImage: getMaskedImage(newCurrentImageData, newMaskImageData),
            }
        }),

};
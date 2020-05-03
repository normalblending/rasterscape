import {createSelector} from "reselect";
import {objectToSelectItems} from "../../utils/utils";
import {PatternState} from "./pattern/types";

const getPatternsState = state => state.patterns;


export const getPatternsSelectItems = createSelector(
    [getPatternsState],
    patterns => {
        return Object.values(patterns).map((pattern) => {
            const {current, id, resultImage} = pattern as PatternState;
            return {
                imageData: current.imageData,
                image: resultImage,
                id
            }
        })
    });

export const getPatternsImageData = createSelector(
    [getPatternsState],
    patterns => {
        return Object.values(patterns).map((pattern) => {
            const {current, id, resultImage} = pattern as PatternState;
            return {
                imageData: current.imageData,
                image: resultImage,
                id
            }
        })
    });
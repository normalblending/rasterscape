import {createSelector} from "reselect";
import {objectToSelectItems} from "../../utils/utils";
import {PatternState} from "./pattern/types";

const getPatternsState = state => state.patterns;


export const getPatternsSelectItems = createSelector(
    [getPatternsState],
    patterns => {
        return Object.values(patterns).map((pattern) => {
            const {id, width, height} = pattern as PatternState;
            return {
                width, height,
                // imageData: current.imageData,
                // image: resultImage,
                id
            }
        })
    });

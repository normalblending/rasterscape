import {createSelector} from "reselect";
import {objectToSelectItems} from "../../utils/utils";

const getPatternsState = state => state.patterns;


export const getPatternsSelectItems = createSelector(
    [getPatternsState],
    patterns => objectToSelectItems(patterns, (value, key) => +key));
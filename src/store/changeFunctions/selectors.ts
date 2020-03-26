import {createSelector} from "reselect";
import {arrayToSelectItems, SelectItem} from "../../utils/utils";
import {ChangeFunction} from "./types";

export const getCFs = state => state.changeFunctions.functions || {};
export const getCFList = state => state.changeFunctions.namesList || [];


export const getChangeFunctionsSelectItems = createSelector(
    [getCFList],
    (list: string[]): SelectItem[] => arrayToSelectItems(list)
);
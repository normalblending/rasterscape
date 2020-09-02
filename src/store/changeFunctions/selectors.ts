import {createSelector} from "reselect";
import {arrayToSelectItems, SelectItem} from "../../utils/utils";
import {ChangeFunction, ECFType} from "./types";
import {ChangeFunctions, ChangeFunctionsState} from "./reducer";

export const getCFs = state => state.changeFunctions.functions || {};
export const getCFList = state => state.changeFunctions.namesList || [];


export const getChangeFunctionsSelectItemsNumber = createSelector(
    [getCFs],
    (cfs: ChangeFunctions): SelectItem[] => arrayToSelectItems(Object.values(cfs)
        .filter((value) => [ECFType.FXY, ECFType.WAVE].indexOf(value.type) !== -1).map(({id}) => id))
);

export const getChangeFunctionsSelectItemsVideo = createSelector(
    [getCFs],
    (cfs: ChangeFunctions): SelectItem[] => arrayToSelectItems(Object.values(cfs)
        .filter((value) => [ECFType.FXY, ECFType.DEPTH].indexOf(value.type) !== -1).map(({id}) => id))
);
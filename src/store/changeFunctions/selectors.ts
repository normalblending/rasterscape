import {createSelector} from "reselect";
import {ChangeFunction, ECFType} from "./types";
import {ChangeFunctions} from "./reducer";

export const getCFs = state => state.changeFunctions.functions || {};
export const getCFsConsts = state => state.changeFunctions.functionsConstants || {};
export const getCFList = state => state.changeFunctions.namesList || [];


export const getChangeFunctionsSelectItemsNumber = createSelector(
    [getCFsConsts],
    (cfs: ChangeFunctions): ChangeFunction[] => Object.values(cfs)
        .filter(cf => [ECFType.FXY, ECFType.WAVE].indexOf(cf.type) !== -1)
);

export const getChangeFunctionsSelectItemsVideo = createSelector(
    [getCFsConsts],
    (cfs: ChangeFunctions): ChangeFunction[] => Object.values(cfs)
        .filter(cf => [ECFType.FXY, ECFType.DEPTH].indexOf(cf.type) !== -1)
);
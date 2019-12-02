import {SetValueInChangeingListAction} from "./types";

export enum EChangingValuesAction {
    SET_VALUE_IN_CHANGING_LIST = "changing-values/set-value"
}

export const setValueInChangingList =
    (path: string, changeFunctionId: string, range: [number, number], startValue: number): SetValueInChangeingListAction => ({
        type: EChangingValuesAction.SET_VALUE_IN_CHANGING_LIST,
        path, changeFunctionId, range, startValue
    });
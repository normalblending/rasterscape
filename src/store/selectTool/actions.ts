import {SelectToolParams, SetSelectToolParamsAction} from "./types";

export enum ESelectToolAction {
    SET_PARAMS = "select/set-params",
}

export const setSelectToolParams = (params: SelectToolParams): SetSelectToolParamsAction =>
    ({type: ESelectToolAction.SET_PARAMS, params});
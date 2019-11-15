import {LineParams, SetLineParamsAction} from "./types";

export enum ELineAction {
    SET_PARAMS = "line/set-params",
}

export const setLineParams = (params: LineParams): SetLineParamsAction =>
    ({type: ELineAction.SET_PARAMS, params});
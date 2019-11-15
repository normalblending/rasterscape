import {BrushParams, SetBrushParamsAction} from "./types";

export enum EBrushAction {
    SET_PARAMS = "brush/set-params",
}

export const setBrushParams = (params: BrushParams): SetBrushParamsAction =>
    ({type: EBrushAction.SET_PARAMS, params});
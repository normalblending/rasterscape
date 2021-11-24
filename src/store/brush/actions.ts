import {BrushShapeParams, BrushPatternParams, BrushSelectParams, EBrushType} from "./types";
import {Action} from "redux";

export enum EBrushAction {
    SET_TYPE = "brush/set-type",
    SET_PATTERN_PARAMS = "brush/pattern/set-params",
    SET_FORM_PARAMS = "brush/form/set-params",
    SET_SELECT_PARAMS = "brush/select/set-params",
}

export interface SetBrushParamsAction<TParams> extends Action {
    params: Partial<TParams>
}

export type SetBrushPatternParamsAction = SetBrushParamsAction<BrushPatternParams>;
export type SetBrushShapeParamsAction = SetBrushParamsAction<BrushShapeParams>;
export type SetBrushSelectParamsAction = SetBrushParamsAction<BrushSelectParams>;

export const setPatternBrushParams = (params: Partial<BrushPatternParams>): SetBrushPatternParamsAction =>
    ({type: EBrushAction.SET_PATTERN_PARAMS, params});

export const setShapeBrushParams = (params: Partial<BrushShapeParams>): SetBrushShapeParamsAction =>
    ({type: EBrushAction.SET_FORM_PARAMS, params});

export const setSelectBrushParams = (params: Partial<BrushSelectParams>): SetBrushSelectParamsAction =>
    ({type: EBrushAction.SET_SELECT_PARAMS, params});

export interface SetBrushTypeAction extends Action {
    brushType: EBrushType
}

export const setBrushType = (brushType: EBrushType): SetBrushTypeAction =>
    ({type: EBrushAction.SET_TYPE, brushType});
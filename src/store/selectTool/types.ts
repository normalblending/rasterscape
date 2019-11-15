import {Action} from "redux";


export enum ECurveType {
    CurveBasis = "curveBasis",
    CurveBundle = "curveBundle",
    CurveCardinal = "curveCardinal",
    CurveCatmullRom = "curveCatmullRom",
    CurveLinear = "curveLinear",
    CurveMonotoneX = "curveMonotoneX",
    CurveMonotoneY = "curveMonotoneY",
    CurveNatural = "curveNatural",
    CurveStep = "curveStep",
    CurveStepBefore = "curveStepBefore",
    CurveStepAfter = "curveStepAfter",
}

export const CurveValueName = {
    [ECurveType.CurveBundle]: "beta",
    [ECurveType.CurveCardinal]: "tension",
    [ECurveType.CurveCatmullRom]: "alpha"
};

export enum ESelectionMode {
    Line = "Line",
    Rect = "Rect",
    SimplePoints = "SimplePoints",
    Points = "Points"
}

export interface SelectToolParams {
    mode: ESelectionMode
    curveType?: ECurveType
    curveValue?: number
}

export interface SetSelectToolParamsAction extends Action {
    params: SelectToolParams
}
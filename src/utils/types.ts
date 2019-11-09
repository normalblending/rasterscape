import {Segment} from "./path";
import {ECurveType, ESelectionMode} from "../components/_shared/CanvasSelection";
import {Param} from "../components/_shared/Params";

export interface CanvasState {
    imageData: ImageData
    width: number
    height: number
}

export interface SelectionState {
    value: SelectionValue
    paramsConfig: Param[]
    params: SelectionParams
}

export type SelectionValue = Segment[];

export type SelectionParams = {
    mode: ESelectionMode
    curveType?: ECurveType
    curveValue?: number
};

export interface Size {
    width: number
    height: number
}
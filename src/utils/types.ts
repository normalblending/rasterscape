import {Segment} from "./path";
import {ECurveType, ESelectionMode} from "../store/selectTool/types";

export interface CanvasState {
    imageData: ImageData
    width: number
    height: number
}

export type SelectionValue = Segment[];

export type SelectToolParams = {
    mode: ESelectionMode
    curveType?: ECurveType
    curveValue?: number
};

export interface Size {
    width: number
    height: number
}

export interface FunctionState<V, P> {
    value: V
    params: P
}

export interface EventData {
    value: any,
    name?: string,
    e?: any
}
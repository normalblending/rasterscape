import {Segment} from "./path";
import {Action} from "redux";

export interface CanvasState {
    imageData: ImageData
    width: number
    height: number
}

export type SelectionValue = Segment[];

export interface FunctionState<V, P> {
    value: V
    params: P
}

export interface EventData {
    value: any,
    name?: string,
    e?: any
}

export interface ImageAction extends Action {
    imageData: ImageData
}

export interface WidthAction extends Action {
    width: number
}

export interface HeightAction extends Action {
    height: number
}


import {Action} from "redux";

export enum EBrushType {
    Square = "Square",
    Circle = "Circle",
    Pattren = "Pattren",
}

export interface BrushParams {
    size: number
    opacity: number
    type: EBrushType
    compositeOperation: EBrushCompositeOperation
}

export interface SetBrushParamsAction extends Action {
    params: BrushParams
}


export interface SetSizeAction extends Action {
    size: number
}

export interface SetOpacityAction extends Action {
    opacity: number
}

export interface SetTypeAction extends Action {
    brushType: EBrushType
}


export enum EBrushCompositeOperation {
    SourceOver = "source-over",
    SourceAtop = "source-atop",
    // SourceIn = "source-in",
    // SourceOut = "source-out",
    DestinationOver = "destination-over",
    // DestinationAtop = "destination-atop",
    // DestinationIn = "destination-in",
    DestinationOut = "destination-out",
    Lighter = "lighter",
    // Copy = "copy",
    Xor = "xor",
}
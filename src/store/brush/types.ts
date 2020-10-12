import {Action} from "redux";
import {ECompositeOperation} from "../compositeOperations";

export enum EBrushType {
    Square = "Square",
    Circle = "Circle",
    Pattern = "Pattern",
}

export interface BrushParams {
    size: number
    patternSize: number
    opacity: number
    type: EBrushType
    pattern: string
    compositeOperation: ECompositeOperation
}

export interface SetBrushParamsAction extends Action {
    params: Partial<BrushParams>
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

export interface SetPatternSizeAction extends Action {
    patternSize: number
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
    multiply = "multiply",
    screen = "screen",
    overlay = "overlay",
    darken = "darken",
    lighten = "lighten",
    colorDodge = "color-dodge",
    colorBurn = "color-burn",
    hardLight = "hard-light",
    softLight = "soft-light",
    difference = "difference",
    exclusion = "exclusion",
    hue = "hue",
    saturation = "saturation",
    color = "color",
    luminosity = "luminosity",
}
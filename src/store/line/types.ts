import {Action} from "redux";
import {EBrushType} from "../brush/types";

export enum ELineType {
    Default = "Default",
    Interrupted = "Interrupted",
    InterruptedOneStroke = "InterruptedOneStroke",
    Pattern = "Pattern",
}

export enum ELineCompositeOperation {
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

export interface LineParams {
    size: number
    opacity: number
    type: ELineType
    compositeOperation: ELineCompositeOperation
    pattern: number
}

export interface SetLineParamsAction extends Action {
    params: LineParams
}
import {ECompositeOperation} from "../compositeOperations";

export enum EBrushType {
    Shape = "Shape",
    Select = "Select",
    Pattern = "Pattern",
}
export enum EBrushShapeType {
    Square = "Square",
    Circle = "Circle",
}

export interface BrushPatternParams {
    compositeOperation: ECompositeOperation
    size: number
    opacity: number

    patternId: string
}

export interface BrushShapeParams {
    compositeOperation: ECompositeOperation
    size: number
    opacity: number
    shapeType: EBrushShapeType
}

export interface BrushSelectParams {
    compositeOperation: ECompositeOperation
    size: number
    opacity: number
}

export interface BrushParams {
    brushType: EBrushType
    paramsByType: {
        [EBrushType.Pattern]: BrushPatternParams
        [EBrushType.Shape]: BrushShapeParams
        [EBrushType.Select]: BrushSelectParams
    }
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

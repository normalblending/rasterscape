import {Action} from "redux";

export enum ELineType {
    Default = "Default",
    Interrupted = "Interrupted",
    InterruptedOneStroke = "InterruptedOneStroke",
    Pattren = "Pattren",
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
}

export interface LineParams {
    size: number
    opacity: number
    type: ELineType
    compositeOperation: ELineCompositeOperation
}

export interface SetLineParamsAction extends Action {
    params: LineParams
}
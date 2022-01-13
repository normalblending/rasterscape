// HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY

import {CanvasState} from "../../../utils/canvas/types";
import {FunctionState} from "../../../utils/patterns/function";

export interface PatternHistoryItem {
    canvasImageData?: ImageData //ImageData и берется теперь из серввиса
    maskImageData?: ImageData
}

export interface HistoryParams {
    length?: number
}

export interface HistoryValue {
    before: PatternHistoryItem[]
    after: PatternHistoryItem[]
    current: PatternHistoryItem
}

export type HistoryState = FunctionState<HistoryValue, HistoryParams>;

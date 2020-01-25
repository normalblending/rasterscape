// HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY

import {CanvasState} from "../../../utils/canvas/types";
import {FunctionState} from "../../../utils/patterns/function";

export interface PatternHistoryItem {
    current?: CanvasState
    maskValue?: CanvasState
}

export interface HistoryParams {
    length?: number
}

export interface HistoryValue {
    before: PatternHistoryItem[],
    after: PatternHistoryItem[]
}

export type HistoryState = FunctionState<HistoryValue, HistoryParams>;
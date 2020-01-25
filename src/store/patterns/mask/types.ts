// MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK

import {CanvasState} from "../../../utils/canvas/types";
import {FunctionState} from "../../../utils/patterns/function";

export interface MaskParams {
    black?: boolean
    opacity?: number
}

export type MaskValue = CanvasState;

export type MaskState = FunctionState<MaskValue, MaskParams>;
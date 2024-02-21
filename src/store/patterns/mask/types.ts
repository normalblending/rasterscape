// MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK

import {CanvasState} from "../../../utils/canvas/types";
import {FunctionState} from "../../../utils/patterns/function";

export interface MaskParams {
    inverse?: boolean
}

export type MaskValue = { };

export type MaskState = FunctionState<MaskValue, MaskParams>;

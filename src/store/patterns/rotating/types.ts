// ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION

import {FunctionState} from "../../../utils/patterns/function";

export interface RotationParams {
}

export interface RotationValue {
    angle: number
    offset: {
        xc: number
        yc: number
        xd: number
        yd: number
    }
    changing: boolean
    rotateDrawAreaElement: boolean
}

export type RotationState = FunctionState<RotationValue, RotationParams>;
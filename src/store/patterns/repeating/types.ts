// REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING

import {BezierPoints} from "../../../components/_shared/canvases/BezierCurveRepeating";
import {FunctionState} from "../../../utils/patterns/function";

export enum ERepeatingType {
    Grid = "Grid",
    Center = "Center",
    Dart = "Dart",
}

export interface RepeatingGridParams {
    xd: number
    yd: number
    xn0: number
    yn0: number
    xn1: number
    yn1: number
    float: boolean
    bezierPoints?: BezierPoints
    flat: boolean
    // x = (1−t)2x1 + 2(1−t)tx2 + t2x3
}

export interface RepeatingParams {
    type: ERepeatingType
    gridParams: RepeatingGridParams
}

export interface RepeatingValue {
}

export type RepeatingState = FunctionState<RepeatingValue, RepeatingParams>;
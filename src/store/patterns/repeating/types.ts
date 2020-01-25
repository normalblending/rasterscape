// REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING

import {BezierPoints} from "../../../components/_shared/BezierCurve";
import {FunctionState} from "../../../utils/patterns/function";

export enum ERepeatingType {
    Grid = "Grid",
    Center = "Center",
    Dart = "Dart",
}

export interface RepeatingGridParams {
    x: number
    y: number
    xOut: number
    yOut: number
    integer: boolean
    bezierPoints?: BezierPoints
    // x = (1−t)2x1 + 2(1−t)tx2 + t2x3
}

export interface RepeatingParams {
    type: ERepeatingType
    gridParams: RepeatingGridParams
}

export interface RepeatingValue {
}

export type RepeatingState = FunctionState<RepeatingValue, RepeatingParams>;
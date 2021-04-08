// REPEATS REPEATS REPEATS REPEATS REPEATS REPEATS REPEATS REPEATS REPEATS REPEATS

import {FunctionState} from "../../../utils/patterns/function";
import {BezierPoints} from "../../../components/_shared/SVG/_utils";

export enum ERepeatsType {
    BezierGrid = "bezier",
    FlatGrid = "flat",
    Center = "Center",
    Dart = "Dart",
}

export interface RepeatsBezierGridParams {
    xd: number
    yd: number
    xn0: number
    yn0: number
    xn1: number
    yn1: number
    float: boolean
    bezierPoints?: BezierPoints
}

export interface RepeatsFlatGridParams {
    xd: number
    yd: number
    xOut: number
    yOut: number
    float: boolean
}

export interface RepeatsParams {
    type: ERepeatsType
    typeParams: {
        [ERepeatsType.BezierGrid]: RepeatsBezierGridParams
        [ERepeatsType.FlatGrid]: RepeatsFlatGridParams
    }
}

export interface RepeatsValue {
}

export type RepeatsState = FunctionState<RepeatsValue, RepeatsParams>;
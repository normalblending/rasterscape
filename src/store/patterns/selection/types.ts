// SELECTION SELECTION SELECTION SELECTION SELECTION SELECTION SELECTION SELECTION

import {Segment} from "../../../utils/path";
import {FunctionState} from "../../../utils/patterns/function";

export interface SelectionParams {
    mask?: any
    strokeColor?: string
    strokeOpacity?: number
    fillColor?: string
    fillOpacity?: number
}

export type Segments = Segment[];

export interface SelectionValue {
    segments: Segments
    bBox?: SVGRect
    mask?: any
}

export type SelectionState = FunctionState<SelectionValue, SelectionParams>;
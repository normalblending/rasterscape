import {PatternState} from "./pattern/types";

export enum EPatternType {
    Canvas = "Canvas",
    Simple = "Simple"
}

export interface PatternsState {
    [id: string]: PatternState
}
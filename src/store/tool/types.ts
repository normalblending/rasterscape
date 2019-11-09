import {Action} from "redux";

export enum EToolType {
    Brush = "Brush",
    Line = "Line",
}

export interface SetCurrentToolAction extends Action {
    tool: EToolType
}
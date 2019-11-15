import {Action} from "redux";

export enum EToolType {
    Brush = "Brush",
    Select = "Select",
    Line = "Line",
}

export interface SetCurrentToolAction extends Action {
    tool: EToolType
}

export const selectionTools = [EToolType.Select];
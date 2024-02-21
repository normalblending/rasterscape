import {Action} from "redux";
import {BrushParams, BrushPatternParams, BrushSelectParams, BrushShapeParams, EBrushType} from "../brush/types";
import {ELineType, LineParams} from "../line/types";

export enum EToolType {
    Brush = "Brush",
    Select = "Select",
    Line = "Line",
}

export interface SetCurrentToolAction extends Action {
    tool: EToolType
}

export const selectionTools = [EToolType.Select];

export type DrawToolType = EBrushType | ELineType;

export type DrawToolParams = BrushShapeParams | BrushSelectParams | BrushPatternParams | LineParams;
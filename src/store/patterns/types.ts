import {
    SetHeightAction,
    SetSelectionAction,
    SetSelectionParamsAction,
    SetWidthAction,
    UpdateImageAction
} from "../_shared/window/types";
import {Action} from "redux";
import {PatternConfig} from "./helpers";
import {SelectionValue} from "../../utils/types";

export enum EPatternType {
    Canvas = "Canvas",
    Simple = "Simple"
}

export interface AddPatternAction extends Action {
    config?: PatternConfig
}

export interface PatternAction extends Action {
    id: number
}

export interface RemovePatternAction extends PatternAction {
}

export interface UpdatePatternImageAction extends UpdateImageAction, PatternAction {
}

export interface UpdatePatternSelectionAction extends PatternAction {
    value: SelectionValue
}

export interface EditPatternConfigAction extends PatternAction {
    config?: PatternConfig
}

export interface PatternUndoAction extends PatternAction {
}

export interface PatternRedoAction extends PatternAction {
}





export interface SetPatternWidthAction extends SetWidthAction {
    id: number
}

export interface SetPatternHeightAction extends SetHeightAction {
    id: number
}



export interface PatternStoreAction extends Action {
    id: number
}

export interface PatternUnstoreAction extends Action {
    id: number
}

export interface SetPatternSelectionAction extends SetSelectionAction {
    id: number
}

export interface SetPatternSelectionParamsAction extends SetSelectionParamsAction {
    id: number
}
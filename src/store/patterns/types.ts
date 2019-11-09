import {
    SetHeightAction,
    SetSelectionAction,
    SetSelectionParamsAction,
    SetWidthAction,
    UpdateImageAction
} from "../_shared/window/types";
import {Action} from "redux";

export enum EPatternType {
    Canvas = "Canvas",
    Simple = "Simple"
}

export interface AddPatternAction extends Action {
    patternType: EPatternType
}

export interface RemovePatternAction extends Action {
    id: number
}

export interface UpdatePatternImageAction extends UpdateImageAction {
    id: number
}






export interface SetPatternWidthAction extends SetWidthAction {
    id: number
}

export interface SetPatternHeightAction extends SetHeightAction {
    id: number
}

export interface PatternUndoAction extends Action {
    id: number
}

export interface PatternRedoAction extends Action {
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
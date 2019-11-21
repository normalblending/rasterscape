import {
    WidthAction,
} from "../../utils/types";
import {Action} from "redux";
import {PatternConfig} from "./helpers";
import {ImageAction, SelectionValue, HeightAction} from "../../utils/types";

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

export interface UpdatePatternImageAction extends ImageAction, PatternAction {
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

export interface SetPatternWidthAction extends WidthAction, PatternAction {
}

export interface SetPatternHeightAction extends HeightAction, PatternAction {
}

export interface CreateRoomAction extends PatternAction {
    roomName: string
    socket: any
}

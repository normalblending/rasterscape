import {PatternAction} from "../pattern/types";


export enum EHistoryAction {
    UNDO = "pattern/undo",
    REDO = "pattern/redo",
}

export interface PatternUndoAction extends PatternAction {
}

export interface PatternRedoAction extends PatternAction {
}

export const undo = (id: string): PatternUndoAction =>
    ({type: EHistoryAction.UNDO, id});
export const redo = (id: string): PatternRedoAction =>
    ({type: EHistoryAction.REDO, id});
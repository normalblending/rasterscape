import {
    CanvasState,
    FunctionState,
    HeightAction,
    ImageAction,
    MaskValue,
    SelectionValue,
    WidthAction,
} from "../../utils/types";
import {Action} from "redux";

export interface PatternHistoryItem {
    current?: CanvasState
    maskValue?: CanvasState
}

export interface HistoryValue {
    before: PatternHistoryItem[],
    after: PatternHistoryItem[]
}

export type HistoryState = FunctionState<HistoryValue, HistoryParams>;
export type StoreState = FunctionState<CanvasState, StoreParams>;
export type SelectionState = FunctionState<SelectionValue, SelectionParams>;
export type MaskState = FunctionState<MaskValue, MaskParams>;

export enum EPatternType {
    Canvas = "Canvas",
    Simple = "Simple"
}

export interface HistoryParams {
    length?: number
}

export interface StoreParams {

}

export interface SelectionParams {
    strokeColor?: string
    strokeOpacity?: number
    fillColor?: string
    fillOpacity?: number
}

export interface MaskParams {
    black?: boolean
    opacity?: number
}

export interface PatternParams {
    history?: HistoryParams

    store?: StoreParams

    selection?: SelectionParams

    mask?: MaskParams
}

export interface PatternConfig {

    width?: number
    height?: number

    history?: boolean

    store?: boolean

    selection?: boolean

    mask?: boolean

}



export interface PatternState {
    id: number
    resultImage: HTMLCanvasElement
    config: PatternConfig
    current: CanvasState
    history?: HistoryState,
    store?: StoreState,
    selection?: SelectionState
    mask?: MaskState

    connected?: string
    socket?: any
}

// ACTIONS

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

export interface UpdatePatternMaskAction extends ImageAction, PatternAction {
}

export interface SetMaskParamsAction extends PatternAction {
    params: MaskParams
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
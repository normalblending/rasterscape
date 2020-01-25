import {CanvasState, FunctionState, HeightAction, ImageAction, WidthAction,} from "../../utils/types";
import {Action} from "redux";
import {Segment} from "../../utils/path";
import {BezierPoints} from "../../components/_shared/BezierCurve";
import {VideoParams} from "./functions/video";


export enum EPatternType {
    Canvas = "Canvas",
    Simple = "Simple"
}


// HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY HISTORY

export interface PatternHistoryItem {
    current?: CanvasState
    maskValue?: CanvasState
}

export interface HistoryParams {
    length?: number
}

export interface HistoryValue {
    before: PatternHistoryItem[],
    after: PatternHistoryItem[]
}


// STORE STORE STORE STORE STORE STORE STORE STORE STORE STORE STORE STORE

export interface StoreParams {

}


// SELECTION SELECTION SELECTION SELECTION SELECTION SELECTION SELECTION SELECTION

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


// MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK MASK

export interface MaskParams {
    black?: boolean
    opacity?: number
}

export type MaskValue = CanvasState;


// ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION ROTATION

export interface RotationParams {
}

export interface RotationValue {
    angle: number
    offset: {
        x: number
        y: number
    }
}


// REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING REPEATING

export enum ERepeatingType {
    Grid = "Grid",
    Center = "Center",
    Dart = "Dart",
}

export interface RepeatingGridParams {
    x: number
    y: number
    xOut: number
    yOut: number
    integer: boolean
    bezierPoints?: BezierPoints
    // x = (1−t)2x1 + 2(1−t)tx2 + t2x3
}

export interface RepeatingParams {
    type: ERepeatingType
    gridParams: RepeatingGridParams
}

export interface RepeatingValue {
}

// LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING

export interface LoadingParams {
    fit: boolean
}

export interface LoadingValue {

}


// PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN PATTERN

export interface PatternParams {
    history?: HistoryParams

    store?: StoreParams

    rotation?: RotationParams

    repeating?: RepeatingParams

    selection?: SelectionParams

    mask?: MaskParams

    loading?: LoadingParams

    video?: VideoParams
}

export interface PatternConfig {

    startImage?: ImageData

    width?: number
    height?: number

    history?: boolean

    store?: boolean

    selection?: boolean

    mask?: boolean

    rotation?: boolean

    repeating?: boolean

    video?: boolean
}


// STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES STATES

export type HistoryState = FunctionState<HistoryValue, HistoryParams>;
export type StoreState = FunctionState<CanvasState, StoreParams>;
export type SelectionState = FunctionState<SelectionValue, SelectionParams>;
export type MaskState = FunctionState<MaskValue, MaskParams>;
export type RotationState = FunctionState<RotationValue, RotationParams>;
export type RepeatingState = FunctionState<RepeatingValue, RepeatingParams>;
export type LoadingState = FunctionState<LoadingValue, LoadingParams>;
export type VideoState = FunctionState<VideoValue, VideoParams>;

export interface PatternState {
    id: string
    resultImage: HTMLCanvasElement
    config: PatternConfig
    current: CanvasState
    history?: HistoryState,
    store?: StoreState,
    selection?: SelectionState
    mask?: MaskState
    rotation?: RotationState
    repeating?: RepeatingState
    loading?: LoadingState
    video?: VideoState

    connected?: string
    socket?: any
}

// ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS ACTIONS

export interface AddPatternAction extends Action {
    config?: PatternConfig
    params?: PatternParams
}

export interface PatternAction extends Action {
    id: string
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
    value: Segments
    bBox: SVGRect
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

export interface SetRotationAction extends PatternAction {
    rotation: RotationValue
}

export interface SetRepeatingAction extends PatternAction {
    repeating: RepeatingParams
}

export interface CreatePatternFromSelection extends PatternAction {
}

export interface SetLoadingParamsAction extends PatternAction {
    value: LoadingParams
}

export interface LoadAction extends PatternAction {
}

export interface SaveAction extends PatternAction {
}

export interface VideoOnChangeAction extends PatternAction {
    value: boolean
}

export interface CreateRoomAction extends PatternAction {
    roomName: string
    socket: any
}
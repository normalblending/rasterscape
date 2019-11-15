import {Action} from "redux";

export enum EBrushType {
    Square = "Square",
    Circle = "Circle",
    Pattren = "Pattren",
}

export interface BrushParams {
    size: number
    opacity: number
    type: EBrushType
}

export interface SetBrushParamsAction extends Action {
    params: BrushParams
}


export interface SetSizeAction extends Action {
    size: number
}

export interface SetOpacityAction extends Action {
    opacity: number
}

export interface SetTypeAction extends Action {
    brushType: EBrushType
}
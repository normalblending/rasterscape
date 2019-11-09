import {Action} from "redux";

export enum EBrushType {
    Square = "Square",
    Circle = "Circle",
    Pattren = "Pattren",
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
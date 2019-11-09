import {Action} from "redux";

export enum ELineType {
    Default = "Default",
    Pattren = "Pattren",
}

export interface SetSizeAction extends Action {
    size: number
}

export interface SetOpacityAction extends Action {
    opacity: number
}

export interface SetTypeAction extends Action {
    lineType: ELineType
}
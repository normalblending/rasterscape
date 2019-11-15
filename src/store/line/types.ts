import {Action} from "redux";

export enum ELineType {
    Default = "Default",
    Pattren = "Pattren",
}

export interface LineParams {
    size: number
    opacity: number
    type: ELineType
}

export interface SetLineParamsAction extends Action {
    params: LineParams
}
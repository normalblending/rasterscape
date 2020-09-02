import {Action} from "redux";
import {ECompositeOperation} from "../compositeOperations";

export enum ELineType {
    Solid = "solid",
    Broken = "broken",
    BrokenTransparent = "transp",
    Pattern = "Pattern",
    SolidPattern = "SolidPattern",
    TrailingPattern = "trailingPattern",
}

export enum ELineCapType {
   Butt = "butt",
   Round = "round",
   Square = "square",
}

export enum ELineJoinType {
   Bevel = "bevel",
   Round = "round",
   Miter = "miter",
}

export enum ELineRandomType {
   OnLine = "online",
   OnFrame = "onframe",
}

export interface LineParams {
    size: number
    patternSize: number
    opacity: number
    type: ELineType
    compositeOperation: ECompositeOperation
    pattern: string

    cap: ELineCapType
    join: ELineJoinType
    random: ELineRandomType

    patternDirection: boolean
    patternMouseCentered: boolean
}

export interface SetLineParamsAction extends Action {
    params: LineParams
}
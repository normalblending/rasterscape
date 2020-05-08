import {Action} from "redux";
import {ECompositeOperation} from "../compositeOperations";

export enum ELineType {
    Solid = "solid",
    Broken = "broken",
    BrokenTransparent = "transp",
    // Pattern = "Pattern",
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
    opacity: number
    type: ELineType
    compositeOperation: ECompositeOperation
    pattern: number

    cap: ELineCapType
    join: ELineJoinType
    random: ELineRandomType
}

export interface SetLineParamsAction extends Action {
    params: LineParams
}
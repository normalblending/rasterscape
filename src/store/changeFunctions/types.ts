import {Action} from "redux";
import {ParamConfig} from "../../components/_shared/Params.types";
import {FxyParams} from "./functions/fxy";
import {CfDepthParams} from "./functions/depth";
import {DrawParams} from "./functions/wave";


export enum ECFType {
    WAVE = "time",
    FXY = 'xy',
    DEPTH = 'rgba',
}

export interface ChangeFunctionState {
    id: string
    number: number
    type: ECFType
    params: FxyParams | CfDepthParams | DrawParams
    paramsConfig: ParamConfig[]
}

export interface ChangeFunctionConstants {
    number: number
    type: ECFType
}

export interface AddCFAction extends Action {
    cfType: ECFType
}

export interface RemoveCFAction extends Action {
    name: string
}

export interface ChangeCFParamsAction extends Action {
    id: string
    params: any
}

export type CfDepthAddPatternAction = Action & { id: string, patternId: string };
export type CfDepthRemovePatternAction = Action & { id: string, index: number };

export interface ChangeFunctionResult {
    value
}

// export type ChangeFunction = () =>

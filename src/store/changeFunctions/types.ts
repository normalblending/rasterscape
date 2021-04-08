import {Action} from "redux";
import {ParamConfig} from "../../components/_shared/Params";


export enum ECFType {
    WAVE = "time",
    FXY = 'xy',
    DEPTH = 'rgba',
}

export interface ChangeFunctionState {
    id: string
    number: number
    type: ECFType
    params: any
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

export interface ChangeFunctionResult {
    value
}

// export type ChangeFunction = () =>
import {Action} from "redux";
import {ParamConfig} from "../../components/_shared/Params";


export enum ECFType {
    WAVE = "time",
    FXY = 'pos',
    DEPTH = 'rgba',
}

export interface ChangeFunction {
    id: string
    type: ECFType
    params: any
    paramsConfig: ParamConfig[]
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

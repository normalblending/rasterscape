import {Action} from "redux";
import {ParamConfig} from "../../components/_shared/Params";


export enum ECFType {
    SIN = "sin"
}

export interface ChangeFunction {
    id: string
    type: ECFType
    params: any
    // paramsConfig: any
    paramsConfig: ParamConfig[]
}

export interface AddCFAction extends Action {
    cfType: ECFType
}

export interface ChangeCFParamsAction extends Action {
    id: string
    params: any
}

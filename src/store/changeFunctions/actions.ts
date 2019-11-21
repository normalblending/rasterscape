import {Action} from "redux";
import {AddCFAction, ChangeCFParamsAction, ECFType} from "./types";


export enum EChangeFunctionsAction {
    ADD_CF = "change-functions/add",
    CHANGE_PARAMS = "change-functions/change-params",
    START_CHANGE = "change-functions/change-start",
    STOP_CHANGE = "change-functions/change-stop",
}

export const addCF = (cfType: ECFType): AddCFAction =>
    ({type: EChangeFunctionsAction.ADD_CF, cfType});

export const changeCFParams = (id: string, params: any): ChangeCFParamsAction =>
    ({type: EChangeFunctionsAction.CHANGE_PARAMS, params, id});


export const startChanging = (): Action =>
    ({type: EChangeFunctionsAction.START_CHANGE});
export const stopChanging = (): Action =>
    ({type: EChangeFunctionsAction.STOP_CHANGE});
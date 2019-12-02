import {AddCFAction, ChangeCFParamsAction, ECFType} from "./types";

export enum EChangeFunctionsAction {
    ADD_CF = "change-functions/add",
    CHANGE_PARAMS = "change-functions/change-params",
}

export const addCF = (cfType: ECFType): AddCFAction =>
    ({type: EChangeFunctionsAction.ADD_CF, cfType});

export const changeCFParams = (id: string, params: any): ChangeCFParamsAction =>
    ({type: EChangeFunctionsAction.CHANGE_PARAMS, params, id});

import {AddCFAction, ChangeCFParamsAction, ECFType, RemoveCFAction} from "./types";

export enum EChangeFunctionsAction {
    ADD_CF = "change-functions/add",
   REMOVE_CF = "change-functions/remove",
    CHANGE_PARAMS = "change-functions/change-params",
}

export const addCF = (cfType: ECFType): AddCFAction =>
    ({type: EChangeFunctionsAction.ADD_CF, cfType});

export const removeCF = (name: string): RemoveCFAction =>
    ({type: EChangeFunctionsAction.REMOVE_CF, name});

export const changeCFParams = (id: string, params: any): ChangeCFParamsAction =>
    ({type: EChangeFunctionsAction.CHANGE_PARAMS, params, id});

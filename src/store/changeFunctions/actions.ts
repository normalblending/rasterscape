import {AddCFAction, ChangeCFParamsAction, ECFType, RemoveCFAction} from "./types";
import {AppState} from "../index";
import {setChangingMode} from "../changing/actions";
import {ChangingMode} from "../changing/types";

export enum EChangeFunctionsAction {
    ADD_CF = "change-functions/add",
   REMOVE_CF = "change-functions/remove",
    CHANGE_PARAMS = "change-functions/change-params",
}

export const addCF = (cfType: ECFType): AddCFAction =>
    ({type: EChangeFunctionsAction.ADD_CF, cfType});

export const removeCF = (name: string) => (dispatch, getState: () => AppState) => {
    dispatch({type: EChangeFunctionsAction.REMOVE_CF, name});

    const cfs = getState().changeFunctions.functions;
    const cfLength = Object.values(cfs).length;

    if (!cfLength) {
        dispatch(setChangingMode(ChangingMode.Auto))
    }
}

export const changeCFParams = (id: string, params: any): ChangeCFParamsAction =>
    ({type: EChangeFunctionsAction.CHANGE_PARAMS, params, id});

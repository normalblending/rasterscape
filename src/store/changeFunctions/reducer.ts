import {handleActions} from "redux-actions";
import {AddCFAction, ChangeCFParamsAction, ChangeFunction, ECFType} from "./types";
import {EChangeFunctionsAction} from "./actions";
import {cfId, createCFInitialState} from "./helpers";


export interface ChangeFunctionsState {
    [key: string]: ChangeFunction
}

export const changeFunctionsReducer = handleActions<ChangeFunctionsState>({
    [EChangeFunctionsAction.ADD_CF]: (state: ChangeFunctionsState, action: AddCFAction) => {
        const id = cfId(action.cfType, state);
        console.log(id, action.cfType, state);
        return {
            ...state,
            [id]: createCFInitialState(id, action.cfType)
        }
    },
    [EChangeFunctionsAction.CHANGE_PARAMS]: (state: ChangeFunctionsState, action: ChangeCFParamsAction) => {
        return {
            ...state,
            [action.id]: {
                ...state[action.id],
                params: action.params
            }
        }
    }
}, {});
import {handleActions} from "redux-actions";
import {AddCFAction, ChangeCFParamsAction, ChangeFunction, RemoveCFAction} from "./types";
import {EChangeFunctionsAction} from "./actions";
import {cfId, createCFInitialState} from "./helpers";
import {omit} from "lodash";

export interface ChangeFunctionsState {
    functions: ChangeFunctions
    namesList: string[]
}
export interface ChangeFunctions {
    [key: string]: ChangeFunction
}

export const changeFunctionsReducer = handleActions<ChangeFunctionsState>({
    [EChangeFunctionsAction.ADD_CF]: (state: ChangeFunctionsState, action: AddCFAction) => {
        const id = cfId(action.cfType, state.functions);

        return {
            functions: {
                ...state.functions,
                [id]: createCFInitialState(id, action.cfType),
            },
            namesList: [...Object.keys(state.functions), id]
        }
    },
    [EChangeFunctionsAction.REMOVE_CF]: (state: ChangeFunctionsState, action: RemoveCFAction) => {
        const newFunctions = omit(state.functions, action.name);
        return {
            functions: newFunctions,
            namesList: Object.keys(newFunctions)
        }
    },
    [EChangeFunctionsAction.CHANGE_PARAMS]: (state: ChangeFunctionsState, action: ChangeCFParamsAction) => {
        return {
            ...state,
            functions: {
                ...state.functions,
                [action.id]: {
                    ...state.functions[action.id],
                    params: action.params
                }
            }
        }
    }
}, {
    functions: {},
    namesList: [],
});
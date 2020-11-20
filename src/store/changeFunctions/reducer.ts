import {handleActions} from "redux-actions";
import {
    AddCFAction,
    ChangeCFParamsAction,
    ChangeFunction,
    ChangeFunctionConstants,
    RemoveCFAction
} from "./types";
import {EChangeFunctionsAction} from "./actions";
import {cfId, createCFInitialState} from "./helpers";
import {omit} from "lodash";

export interface ChangeFunctions {
    [id: string]: ChangeFunction
}

export interface ChangeFunctionsConstants {
    [id: string]: ChangeFunctionConstants
}

export interface ChangeFunctionsState {
    functions: ChangeFunctions
    functionsConstants: ChangeFunctionsConstants
    namesList: string[]
}

export const changeFunctionsReducer = handleActions<ChangeFunctionsState>({
    [EChangeFunctionsAction.ADD_CF]: (state: ChangeFunctionsState, action: AddCFAction) => {
        const {id, number} = cfId(action.cfType, state.functions);

        return {
            functions: {
                ...state.functions,
                [id]: createCFInitialState(id, action.cfType, number),
            },
            namesList: [...Object.keys(state.functions), id],
            functionsConstants: {
                ...state.functionsConstants,
                [id]: {
                    id,
                    type: action.cfType,
                    number,
                },
            }
        }
    },
    [EChangeFunctionsAction.REMOVE_CF]: (state: ChangeFunctionsState, action: RemoveCFAction) => {
        const newFunctions = omit(state.functions, action.name);
        const newFunctionsConstants = omit(state.functionsConstants, action.name);
        return {
            functions: newFunctions,
            functionsConstants: newFunctionsConstants,
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
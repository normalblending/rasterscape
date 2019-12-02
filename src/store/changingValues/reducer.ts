import {handleActions} from "redux-actions";
import {ChangingValue, SetValueInChangeingListAction} from "./types";
import {EChangingValuesAction} from "./actions";
import omit from "lodash/omit";

export interface ChangingValuesState {
    [path: string]: ChangingValue
}

export const changingValuesReducer = handleActions<ChangingValuesState>({
    [EChangingValuesAction.SET_VALUE_IN_CHANGING_LIST]: (state: ChangingValuesState, action: SetValueInChangeingListAction) => {
        return action.changeFunctionId ? {
            ...state,
            [action.path]: {
                path: action.path,
                changeFunctionId: action.changeFunctionId,
                range: action.range,
                startValue: action.startValue
            }
        } : omit(state, action.path)
    }
}, {});
import {handleActions} from "redux-actions";
import {
    ActivateValueChangingAction,
    ChangingValue,
    DeactivateValueChangingAction, SetStartValueAction,
    SetValueInChangingListAction
} from "./types";
import {EChangingValuesAction} from "./actions";
import omit from "lodash/omit";

export interface ChangingValuesState {
    [path: string]: ChangingValue
}

export const changingValuesReducer = handleActions<ChangingValuesState>({
    [EChangingValuesAction.SET_VALUE_IN_CHANGING_LIST]: (state: ChangingValuesState, action: SetValueInChangingListAction) => {
        if (!state[action.path]) {
            if (action.changeFunctionId) {
                return {
                    ...state,
                    [action.path]: {
                        active: true,
                        path: action.path,
                        changeFunctionId: action.changeFunctionId,
                        range: action.range,
                        startValue: action.startValue,
                    }
                }
            } else {
                return state;
            }
        } else {
            if (action.changeFunctionId) {
                return {
                    ...state,
                    [action.path]: {
                        ...state[action.path],
                        path: action.path,
                        changeFunctionId: action.changeFunctionId,
                        range: action.range,
                    }
                }
            } else {
                return omit(state, action.path);
            }
        }
    },
    [EChangingValuesAction.SET_START_VALUE]: (state: ChangingValuesState, action: SetStartValueAction) => {
        return state[action.path] ? {
            ...state,
            [action.path]: {
                ...state[action.path],
                startValue: action.startValue,
            }
        } : state
    },
    [EChangingValuesAction.ACTIVATE_VALUE_CHANGING]: (state: ChangingValuesState, action: ActivateValueChangingAction) => ({
        ...state,
        [action.path]: {
            ...state[action.path],
            active: true
        }
    }),
    [EChangingValuesAction.DEACTIVATE_VALUE_CHANGING]: (state: ChangingValuesState, action: DeactivateValueChangingAction) => ({
        ...state,
        [action.path]: {
            ...state[action.path],
            active: false
        }
    }),
}, {});
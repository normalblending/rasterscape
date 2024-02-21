import {ActivateValueChangingAction, DeactivateValueChangingAction, SetValueInChangingListAction} from "./types";
import {toStartValue} from "../change/actions";
import {AppState} from "../index";


// todo typescript
export enum EChangingValuesAction {
    SET_VALUE_IN_CHANGING_LIST = "changing-values/set-value",
    SET_START_VALUE = "changing-values/set-start-value",

    ACTIVATE_VALUE_CHANGING = "changing-values/activate",
    DEACTIVATE_VALUE_CHANGING = "changing-values/deactivate",
}

export const setValueInChangingList =
    (path: string, changeFunctionId: string, range: [number, number], startValue: number) => (dispatch) => {
        dispatch(toStartValue(path));
        dispatch({
            type: EChangingValuesAction.SET_VALUE_IN_CHANGING_LIST,
            path, changeFunctionId, range, startValue
        })
    };

export const setStartValue =
    (path: string, startValue: number) => (dispatch) => {
        dispatch({
            type: EChangingValuesAction.SET_START_VALUE,
            path, startValue
        })
    };

export const activateValueChanging = (path: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const {changingValues} = state;

    if (changingValues[path]) {
        dispatch({type: EChangingValuesAction.ACTIVATE_VALUE_CHANGING, path});
    }
};

export const deactivateValueChanging = (path: string) => (dispatch, getState) => {
    const state: AppState = getState();

    const {changingValues} = state;

    if (changingValues[path]) {
        dispatch(toStartValue(path));
        dispatch({type: EChangingValuesAction.DEACTIVATE_VALUE_CHANGING, path});
    }
};
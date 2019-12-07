import {allToStartValue, change} from "../change/actions";
import {ChangingMode} from "./types";
import {AppState} from "../index";

// todo прикрутить сюда тайпскрипт

export enum EChangingAction {
    START = "changing/start",
    STOP = "changing/stop",
    SET_MODE = "changing/set-mode"
}

let requestID = null;

export const startChanging = () => (dispatch, getState) => {

    if (!requestID) {
        requestID && cancelAnimationFrame(requestID);

        const startTime = performance.now();

        requestID = requestAnimationFrame(function changing(time) {

            dispatch(change(time - startTime));

            requestID = requestAnimationFrame(changing);
        });

        return dispatch({type: EChangingAction.START})
    }
};

export const stopChanging = () => (dispatch, getState) => {

    requestID && cancelAnimationFrame(requestID);

    requestID = null;

    return dispatch({type: EChangingAction.STOP})
};

export const startDrawChanging = () => (dispatch, getState) => {
    const state: AppState = getState();
    const mode = state.changing.mode;

    if (mode === ChangingMode.OnDraw)
        return dispatch(startChanging())

};
export const stopDrawChanging = () => (dispatch, getState) => {
    const state: AppState = getState();
    const mode = state.changing.mode;

    if (mode === ChangingMode.OnDraw) {
        dispatch(allToStartValue());
        return dispatch(stopChanging())
    }
};

export const setChangingMode = (mode: ChangingMode) => (dispatch, getState) => {

    const state: AppState = getState();
    const prevMode = state.changing.mode;

    if (prevMode === mode) return;

    if (mode === ChangingMode.OnDraw) {
        if (prevMode === ChangingMode.On) {
            dispatch(allToStartValue());
            dispatch(stopChanging());
        }
    } else if (mode === ChangingMode.On) {
        dispatch(startChanging());
    } else if (mode === ChangingMode.Off) {
        if (prevMode === ChangingMode.On) {
            dispatch(allToStartValue());
            dispatch(stopChanging());
        }
    }

    return dispatch({type: EChangingAction.SET_MODE, mode})
};

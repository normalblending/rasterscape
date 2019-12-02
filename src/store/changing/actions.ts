import {change} from "../change/actions";

export enum EChangingAction {
    START = "changing/start",
    STOP = "changing/stop",
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

        return {type: EChangingAction.START}
    }
};

export const stopChanging = () => (dispatch, getState) => {

    requestID && cancelAnimationFrame(requestID);

    requestID = null;

    return {type: EChangingAction.STOP}
};
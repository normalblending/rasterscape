import {handleActions} from "redux-actions";
import {EChangingAction} from "./actions";
import {ChangingMode} from "./types";

export interface ChangingState {
    isChanging: boolean
    mode: ChangingMode
}

export const changingReducer = handleActions<ChangingState>({
    [EChangingAction.START]: (state: ChangingState) => ({
        ...state,
        isChanging: true
    }),
    [EChangingAction.STOP]: (state: ChangingState) => ({
        ...state,
        isChanging: false
    }),
    [EChangingAction.SET_MODE]: (state: ChangingState, action) => ({
        ...state,
        mode: action.mode
    }),
}, {
    isChanging: false,
    mode: ChangingMode.Auto
});

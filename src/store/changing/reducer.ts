import {handleActions} from "redux-actions";
import {EChangingAction} from "./actions";

export interface ChangingState {
    isChanging: boolean
    changeOnDraw: boolean
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
}, {
    isChanging: false,
    changeOnDraw: true
});

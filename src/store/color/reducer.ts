import {handleActions} from "redux-actions";
import {ChangeColorAction} from "./types";
import {EColorAction} from "./actions";


export interface ColorState {
    value: string
}

export const colorReducer = handleActions<ColorState>({
    [EColorAction.CHANGE]: (state: ColorState, action: ChangeColorAction) => {

        return {
            ...state,
            value: action.color
        }
    },
}, {
    value: "#000000"
});
import {handleActions} from "redux-actions";
import {EToolType, SetCurrentToolAction} from "./types";
import {EToolAction} from "./actions";

export interface ToolState {
    current: EToolType
}

export const toolReducer = handleActions<ToolState>({
    [EToolAction.SET_CURRENT]: (state: ToolState, action: SetCurrentToolAction) => ({
        ...state,
        current: action.tool
    })
}, {
    current: EToolType.Brush
});



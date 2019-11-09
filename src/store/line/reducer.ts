import {handleActions} from "redux-actions";
import {BrushState} from "../brush/reducer";
import {ELineType, SetOpacityAction, SetSizeAction, SetTypeAction} from "./types";
import {ELineAction} from "./actions";

export interface LineState {
    size: number
    opacity: number
    type: ELineType
}

export const lineReducer = handleActions<LineState>({
    [ELineAction.SET_SIZE]: (state: BrushState, action: SetSizeAction) => ({
        ...state,
        size: action.size
    }),
    [ELineAction.SET_OPACITY]: (state: BrushState, action: SetOpacityAction) => ({
        ...state,
        opacity: action.opacity
    }),
    [ELineAction.SET_TYPE]: (state: BrushState, action: SetTypeAction) => ({
        ...state,
        type: action.lineType
    }),
}, {});



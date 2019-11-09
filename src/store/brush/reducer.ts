import {handleActions} from "redux-actions";
import {EBrushType, SetOpacityAction, SetSizeAction, SetTypeAction} from "./types";
import {EBrushAction} from "./actions";

export interface BrushState {
    size: number
    opacity: number
    type: EBrushType
}

export const brushReducer = handleActions<BrushState>({
    [EBrushAction.SET_SIZE]: (state: BrushState, action: SetSizeAction) => ({
        ...state,
        size: action.size
    }),
    [EBrushAction.SET_OPACITY]: (state: BrushState, action: SetOpacityAction) => ({
        ...state,
        opacity: action.opacity
    }),
    [EBrushAction.SET_TYPE]: (state: BrushState, action: SetTypeAction) => ({
        ...state,
        type: action.brushType
    }),
}, {
    size: 0.4,
    opacity: 0,
    type: EBrushType.Square
});



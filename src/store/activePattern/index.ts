import {handleActions} from "redux-actions";
import {Action} from "redux";
import {act} from "react-dom/test-utils";

export enum EActivePatternAction {
    SET = "active-pattern/set",
    RESET = "active-pattern/reset",
}

export interface ActivePatternState {
    patternId: string
}

export const activePatternReducer = handleActions<ActivePatternState>({
    [EActivePatternAction.SET]: (state, action: SetActivePatternAction) => {
        return {
            ...state,
            patternId: action.patternId,
        }
    },
}, {
    patternId: null
});


export interface SetActivePatternAction extends Action {
    patternId: string
}

export const setActivePattern = (patternId: string): SetActivePatternAction => ({
    type: EActivePatternAction.SET, patternId
});
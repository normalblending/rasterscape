import {handleActions} from "redux-actions";
import {WindowState} from "../mainWindow/reducer";
import {EPatternsAction} from "./actions";
import {createPatternInitialState, patternId, removePattern, updateCurrentImageAndHistory} from "./helpers";
import {AddPatternAction, RemovePatternAction, UpdatePatternImageAction} from "./types";

export interface PatternsState {
    [id: string]: WindowState
}



export const patternsReducer = handleActions<PatternsState>({
    [EPatternsAction.ADD_PATTERN]: (state: PatternsState, action: AddPatternAction) => {
        const id = patternId(state);
        return {
            ...state,
            [id]: createPatternInitialState(action.patternType, {id})
        }
    },
    [EPatternsAction.REMOVE_PATTERN]: (state: PatternsState, action: RemovePatternAction) =>
        removePattern(state, action.id),
    [EPatternsAction.UPDATE_IMAGE]: (state: PatternsState, action: UpdatePatternImageAction) => ({
        ...state,
        [action.id]: updateCurrentImageAndHistory(state[action.id], action.imageData)
    })
}, {});



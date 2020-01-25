import {handleActions} from "redux-actions";
import {EPatternsAction} from "./actions";
import {createPatternInitialState, patternId, removePattern} from "./helpers";
import {AddPatternAction, RemovePatternAction,} from "./pattern/types";
import {PatternsState} from "./types";
import {patternReducers} from "./pattern/reducers";
import {historyReducers} from "./history/reducers";
import {maskReducers} from "./mask/reducers";
import {importReducers} from "./import/reducers";
import {repeatingReducers} from "./repeating/reducers";
import {rotatingReducers} from "./rotating/reducers";
import {selectionReducers} from "./selection/reducers";
import {storeReducers} from "./store/reducers";
import {videoReducers} from "./video/reducers";

export const patternsReducer = handleActions<PatternsState>({
    [EPatternsAction.ADD_PATTERN]: (state: PatternsState, action: AddPatternAction) => {
        const id = patternId(state);
        return {
            ...state,
            [id]: createPatternInitialState(id, action.config, action.params)
        }
    },
    [EPatternsAction.REMOVE_PATTERN]: (state: PatternsState, action: RemovePatternAction) =>
        removePattern(state, action.id),

    ...patternReducers,
    ...historyReducers,
    ...maskReducers,
    ...selectionReducers,
    ...importReducers,
    ...repeatingReducers,
    ...rotatingReducers,
    ...videoReducers,
    ...storeReducers,
}, {});



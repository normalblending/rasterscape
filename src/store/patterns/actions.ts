import {AddPatternAction, PatternConfig, PatternParams} from "./pattern/types";
import {leaveRoom} from "./room/actions";
import {EPatternsAction} from "./consts";

// TODO типы


export const addPattern = (config?: PatternConfig, params?: PatternParams): AddPatternAction =>
    ({type: EPatternsAction.ADD_PATTERN, config, params});

export const removePattern = (id: string) => (dispatch, getState) => {
    dispatch(leaveRoom(id));

    dispatch({type: EPatternsAction.REMOVE_PATTERN, id});
}


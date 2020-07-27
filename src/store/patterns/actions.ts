import {AddPatternAction, PatternConfig, PatternParams, RemovePatternAction} from "./pattern/types";
import {leaveRoom} from "./room/actions";

// TODO типы


export enum EPatternsAction {
    ADD_PATTERN = "patterns/add",
    REMOVE_PATTERN = "patterns/remove",
}

export const addPattern = (config?: PatternConfig, params?: PatternParams): AddPatternAction =>
    ({type: EPatternsAction.ADD_PATTERN, config, params});

export const removePattern = (id: string) => (dispatch, getState) => {
    dispatch(leaveRoom(id));

    dispatch({type: EPatternsAction.REMOVE_PATTERN, id});
}


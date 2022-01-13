import {EHistoryAction, PatternSetHistoryAction} from "./actions";
import {PatternState} from "../pattern/types";
import {reducePattern} from "../pattern/helpers";

export const historyReducers = {
    [EHistoryAction.SET_HISTORY]: reducePattern<PatternSetHistoryAction>((pattern: PatternState, action) => {
        return {
            ...pattern,
            history: action.history,
            width: action.history.value.current.canvasImageData.width,
            height: action.history.value.current.canvasImageData.height,
        }
    }),
};

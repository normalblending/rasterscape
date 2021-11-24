import {handleActions} from "redux-actions";
import {Action} from "redux";
import {getRepeatingCoords, RepeatingCoordinatesItem} from "../patterns/repeating/helpers";
import {AppState} from "../index";
import {ThunkResult} from "../../utils/actions/types";

export enum EPositionAction {
    SET = "position/set",
    RESET = "position/reset",
}

export interface PositionState {
    patternId: string
    x: number
    y: number
    coordinates: RepeatingCoordinatesItem[]
}

export const positionReducer = handleActions<PositionState>({
    [EPositionAction.SET]: (state, action: SetPositionAction) => {
        return {
            ...state,
            patternId: action.patternId,
            x: action.x,
            y: action.y,
            coordinates: action.coordinates,
        }
    },
}, {
    patternId: null,
    x: 0,
    y: 0,
    coordinates: [],
});


export interface SetPositionAction extends Action {
    patternId: string
    x: number
    y: number
    coordinates: RepeatingCoordinatesItem[]
}

export const setPosition = (patternId: string, x: number, y: number): ThunkResult<SetPositionAction, AppState> =>
    (dispatch, getState) => {

        const {patterns, tool} = getState();
        const pattern = patterns[patternId];

        if (!pattern) return;

        const coordinates = getRepeatingCoords({
            repeatsParams: pattern.config.repeating ? pattern.repeating.params : null,
            width: pattern.current.imageData.width,
            height: pattern.current.imageData.height,
            x,
            y,
            tool: tool.current
        });

        return dispatch({
            type: EPositionAction.SET,
            patternId,
            x,
            y,
            coordinates
        })
    };
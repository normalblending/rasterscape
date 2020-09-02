import {handleActions} from "redux-actions";
import {Action} from "redux";
import {ECFType} from "../changeFunctions/types";

export enum ECFHighlightsAction {
    SET = "CFHighlights/set",
    SET_TYPE = "CFHighlights/set-type",
}

export interface ChangeFunctionHighlightsState {
    highlighted: string
    typeHighlighted: ECFType[]
}

export const changeFunctionHighlightsReducer = handleActions<ChangeFunctionHighlightsState>({
    [ECFHighlightsAction.SET]: (state: ChangeFunctionHighlightsState, action: CFHighlightSetAction) => {
        return {
            ...state,
            highlighted: action.cfName
        }
    },
    [ECFHighlightsAction.SET_TYPE]: (state: ChangeFunctionHighlightsState, action: CFTypeHighlightSetAction) => {
        return {
            ...state,
            typeHighlighted: action.cfType || []
        }
    },
}, {
    highlighted: null,
    typeHighlighted: [],
});

export interface CFHighlightSetAction extends Action {
    cfName?: string
}
export const setCFHighlights = (cfName?: string): CFHighlightSetAction => ({
    type: ECFHighlightsAction.SET,
    cfName
})


export interface CFTypeHighlightSetAction extends Action {
    cfType?: ECFType[]
}
export const setCFTypeHighlights = (cfType?: ECFType[]): CFTypeHighlightSetAction => ({
    type: ECFHighlightsAction.SET_TYPE,
    cfType
})
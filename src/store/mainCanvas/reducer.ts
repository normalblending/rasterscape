import {handleActions} from "redux-actions";
import {EMainCanvasAction} from "./actions";
import {CanvasState, SelectionState} from '../../utils/types';
import {createCleanCanvasState, resizeImageData} from "../../utils/canvas";
import {
    SetHeightAction,
    SetSelectionAction,
    SetSelectionModeAction,
    SetSelectionParamsAction,
    SetWidthAction,
    UpdateMainImageAction
} from "./types";
import {
    ESelectionMode,
    getParamsConfig,
    ECurveType
} from "../../components/_shared/CanvasSelector";

const HISTORY_L = 23;

export interface WindowState {
    current: CanvasState
    history?: {
        before: CanvasState[],
        after: CanvasState[]
    },
    stored?: CanvasState,
    selection?: SelectionState
}

export interface MainCanvasState extends WindowState {
}

const updateCurrent = (state: MainCanvasState, nextCurrent) => {
    const {history: {before}, current: currentPrev} = state;

    const beforeNext = [...before, currentPrev];
    const afterNext = [];

    if (beforeNext.length > HISTORY_L)
        beforeNext.shift();

    return {
        ...state,
        current: {
            ...state.current,
            ...nextCurrent
        },
        history: {
            before: beforeNext,
            after: afterNext
        }
    }
};

export const mainCanvasReducer = handleActions<MainCanvasState>({
    [EMainCanvasAction.UPDATE_IMAGE]: (state: MainCanvasState, action: UpdateMainImageAction) =>
        updateCurrent(state, {imageData: action.imageData}),
    [EMainCanvasAction.UNSTORE_IMAGE]: (state: MainCanvasState) => ({
        ...updateCurrent(state, state.stored),
        stored: null
    }),
    [EMainCanvasAction.SET_WIDTH]: (state: MainCanvasState, action: SetWidthAction) =>
        updateCurrent(state, {
            width: action.width,
            imageData: resizeImageData(state.current.imageData, action.width, state.current.height)
        }),
    [EMainCanvasAction.SET_HEIGHT]: (state: MainCanvasState, action: SetHeightAction) =>
        updateCurrent(state, {
            height: action.height,
            imageData: resizeImageData(state.current.imageData, state.current.width, action.height)
        }),
    [EMainCanvasAction.UNDO]: (state) => {
        const {history: {before, after}, current} = state;

        if (before.length === 0) return state;

        const prevCanvasState = before[before.length - 1];

        const beforeNext = before.slice(0, before.length - 1); // pop
        const afterNext = [current, ...after]; // unshift current

        return {
            ...state,
            current: {...prevCanvasState},
            history: {
                before: beforeNext,
                after: afterNext
            }
        }
    },
    [EMainCanvasAction.REDO]: (state) => {

        const {history: {before, after}, current} = state;

        if (after.length === 0) return state;

        const nextCanvasState = after[0];

        const beforeNext = [...before, current]; // push current
        const afterNext = after.slice(1, after.length); // shift

        return {
            ...state,
            current: {...nextCanvasState},
            history: {
                before: beforeNext,
                after: afterNext
            }
        }
    },
    [EMainCanvasAction.STORE_IMAGE]: (state) => ({
        ...state,
        stored: state.current ? {...state.current} : null
    }),
    [EMainCanvasAction.SET_SELECTION]: (state, action: SetSelectionAction) => {
        localStorage.setItem("sel", JSON.stringify(action.selection));
        return ({
            ...state,
            selection: {
                ...state.selection,
                value: action.selection
            }
        })
    },
    [EMainCanvasAction.SET_SELECTION_PARAMS]: (state: MainCanvasState, action: SetSelectionParamsAction) => {
        const params = {
            ...state.selection.params,
            ...action.params
        };
        const paramsConfig = getParamsConfig(params);
        return {
            ...state,
            selection: {
                ...state.selection,
                paramsConfig,
                params
            }
        }
    }
}, {
    current: createCleanCanvasState(300, 300),
    history: {
        before: [],
        after: []
    },
    stored: null,
    selection: {
        params: {
            mode: ESelectionMode.Rect,
            curveType: ECurveType.Default
        },
        paramsConfig: getParamsConfig(),
        value: null// JSON.parse(localStorage.getItem("sel") || null)//null//[[1,1], [1, 100], [100, 100], [100, 1]]
    },
});
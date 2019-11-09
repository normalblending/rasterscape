import {handleActions} from "redux-actions";
import {EMainWindowAction} from "./actions";
import {CanvasState, SelectionState} from '../../utils/types';
import {createCleanCanvasState, resizeImageData} from "../../utils/canvas";
import {
    SetMainWindowHeightAction,
    SetMainWindowSelectionAction,
    SetMainWindowSelectionParamsAction,
    SetMainWindowWidthAction,
    UpdateMainImageAction
} from "./types";
import {
    ESelectionMode,
    getParamsConfig,
    ECurveType
} from "../../components/_shared/CanvasSelection";

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

export interface MainWindowState extends WindowState {
}

const updateCurrent = (state: MainWindowState, nextCurrent) => {
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

export const mainWindowReducer = handleActions<MainWindowState>({
    [EMainWindowAction.UPDATE_IMAGE]: (state: MainWindowState, action: UpdateMainImageAction) =>
        updateCurrent(state, {imageData: action.imageData}),
    [EMainWindowAction.UNSTORE_IMAGE]: (state: MainWindowState) => ({
        ...updateCurrent(state, state.stored),
        stored: null
    }),
    [EMainWindowAction.SET_WIDTH]: (state: MainWindowState, action: SetMainWindowWidthAction) =>
        updateCurrent(state, {
            width: action.width,
            imageData: resizeImageData(state.current.imageData, action.width, state.current.height)
        }),
    [EMainWindowAction.SET_HEIGHT]: (state: MainWindowState, action: SetMainWindowHeightAction) =>
        updateCurrent(state, {
            height: action.height,
            imageData: resizeImageData(state.current.imageData, state.current.width, action.height)
        }),
    [EMainWindowAction.UNDO]: (state) => {
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
    [EMainWindowAction.REDO]: (state) => {

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
    [EMainWindowAction.STORE_IMAGE]: (state) => ({
        ...state,
        stored: state.current ? {...state.current} : null
    }),
    [EMainWindowAction.SET_SELECTION]: (state, action: SetMainWindowSelectionAction) => {
        localStorage.setItem("sel", JSON.stringify(action.selection));
        return ({
            ...state,
            selection: {
                ...state.selection,
                value: action.selection
            }
        })
    },
    [EMainWindowAction.SET_SELECTION_PARAMS]: (state: MainWindowState, action: SetMainWindowSelectionParamsAction) => {
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
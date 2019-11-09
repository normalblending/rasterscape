import {EPatternType} from "./types";
import {WindowState} from "../mainWindow/reducer";
import {createCleanCanvasState} from "../../utils/canvas";
import {ECurveType, ESelectionMode, getParamsConfig} from "../../components/_shared/CanvasSelection";
import {PatternsState} from "./reducer";
import {omit} from "lodash";

export const PATTERN_HISTORY_L = 5;

export const patternId = (state: PatternsState) =>
    Object.keys(state).length
        ? (Math.max(...Object.keys(state).map(key => +key))) + 1
        : 1;

export const createPatternInitialState = (type: EPatternType, params?: any): WindowState => {
    return {
        [EPatternType.Simple]: ({id}) => ({
            id,
            type,
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
        })
    }[type](params);
};

export const removePattern = (state: PatternsState, id: number) => omit(state, id);


export const updateCurrentImageAndHistory =  (state: WindowState, nextCurrent) => {
    const {history: {before}, current: currentPrev} = state;

    const beforeNext = [...before, currentPrev];
    const afterNext = [];

    if (beforeNext.length > PATTERN_HISTORY_L)
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

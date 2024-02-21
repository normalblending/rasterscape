import {handleActions} from "redux-actions";
import {Action} from "redux";

export enum EOptimizationAction {
    ON = "Optimization/on",
    OFF = "Optimization/off",
}

export interface OptimizationState {
    on: boolean
}

export const optimizationReducer = handleActions<OptimizationState>({
    [EOptimizationAction.ON]: (state: OptimizationState) => {
        return {
            ...state,
            on: true
        }
    },
    [EOptimizationAction.OFF]: (state: OptimizationState) => {
        return {
            ...state,
            on: false
        }
    },
}, {
    on: false,
});

export const onOptimization = (): Action => ({
    type: EOptimizationAction.ON,
});

export const offOptimization = (): Action => ({
    type: EOptimizationAction.OFF,
});
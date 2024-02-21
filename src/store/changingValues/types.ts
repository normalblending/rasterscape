import {Action} from "redux";

export interface ChangingValue {
    path: string
    changeFunctionId: string
    range: [number, number]
    startValue: number
    active: boolean
}


// ACTIONS

export interface SetValueInChangingListAction extends Action {
    path: string
    changeFunctionId: string
    range: [number, number]
    startValue: number
}

export interface SetStartValueAction extends Action {
    path: string
    startValue: number
}

export interface ActivateValueChangingAction extends Action {
    path: string
}

export interface DeactivateValueChangingAction extends Action {
    path: string
}
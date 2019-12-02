import {Action} from "redux";

export interface ChangingValue {
    path: string
    changeFunctionId: string
    range: [number, number]
    startValue: number
}


// ACTIONS

export interface SetValueInChangeingListAction extends Action {
    path: string
    changeFunctionId: string
    range: [number, number]
    startValue: number
}
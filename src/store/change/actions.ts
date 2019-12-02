import {Action} from "redux";

export enum EChangeAction {
    CHANGE = "change"
}

export interface ChangeAction extends Action {
    time: number
}

export const change = (time: number): ChangeAction =>
    ({type: EChangeAction.CHANGE, time});
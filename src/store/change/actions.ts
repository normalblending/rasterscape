import {Action} from "redux";
import {CanvasPosition} from "../../components/Area/canvasPosition.servise";

export enum EChangeAction {
    CHANGE = "change",
    TO_START_VALUE = "change/to-start-value",
    ALL_TO_START_VALUE = "change/all-to-start-value"
}

export interface ChangeAction extends Action {
    time: number
    position: CanvasPosition
}

export interface ChangeToStartValueAction extends Action {
    path: string
}

export const change = (time: number, position: CanvasPosition): ChangeAction =>
    ({type: EChangeAction.CHANGE, time, position});

export const toStartValue = (path: string): ChangeToStartValueAction =>
    ({type: EChangeAction.TO_START_VALUE, path});

export const allToStartValue = (): Action =>
    ({type: EChangeAction.ALL_TO_START_VALUE});
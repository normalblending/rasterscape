import {ChangeColorAction} from "./types";


export enum EColorAction {
    CHANGE = "color/change",
}

export const changeColor = (color: string): ChangeColorAction =>
    ({type: EColorAction.CHANGE, color});
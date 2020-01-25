import {PatternAction} from "../pattern/types";
import {RepeatingParams} from "./types";

export enum ERepeatingAction {
    SET_REPEATING = "pattern/set-repeating",
}

export interface SetRepeatingAction extends PatternAction {
    repeating: RepeatingParams
}

export const setRepeating = (id: string, repeating: RepeatingParams): SetRepeatingAction =>
    ({type: ERepeatingAction.SET_REPEATING, id, repeating});
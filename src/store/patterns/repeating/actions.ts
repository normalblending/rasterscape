import {PatternAction} from "../pattern/types";
import {ERepeatsType, RepeatsBezierGridParams, RepeatsFlatGridParams, RepeatsParams} from "./types";

export enum ERepeatingAction {
    SET_REPEATING = "pattern/set-repeating",
    SET_PARAMS = "pattern/set-params",
    SET_TYPE = "pattern/set-type",
}

export interface SetRepeatingAction extends PatternAction {
    repeating: RepeatsParams
}

export const setRepeating = (id: string, repeating: RepeatsParams): SetRepeatingAction =>
    ({type: ERepeatingAction.SET_REPEATING, id, repeating});


export type AnyRepeatsTypeParams = RepeatsBezierGridParams | RepeatsFlatGridParams;

export interface SetRepeatsParamsAction extends PatternAction {
    repeatsType: ERepeatsType
    params: AnyRepeatsTypeParams
}

export const setRepeatsParams = (
    id: string,
    repeatsType: ERepeatsType,
    params: AnyRepeatsTypeParams): SetRepeatsParamsAction =>
    ({type: ERepeatingAction.SET_PARAMS, id, repeatsType, params});


export interface SetRepeatsTypeAction extends PatternAction {
    repeatsType: ERepeatsType
}

export const setType = (
    id: string,
    repeatsType: ERepeatsType
): SetRepeatsTypeAction =>
    ({type: ERepeatingAction.SET_TYPE, id, repeatsType});
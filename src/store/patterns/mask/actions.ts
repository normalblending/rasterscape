import {ImageAction} from "../../../utils/types";
import {PatternAction} from "../pattern/types";
import {MaskParams} from "./types";

export enum EMaskAction {
    UPDATE_MASK = "pattern/update-mask",
    SET_MASK_PARAMS = "pattern/set-mask-params",
}

export interface UpdatePatternMaskAction extends ImageAction, PatternAction {
}

export interface SetMaskParamsAction extends PatternAction {
    params: MaskParams
}

export const updateMask = (id: string, imageData: ImageData): UpdatePatternMaskAction =>
    ({type: EMaskAction.UPDATE_MASK, imageData, id});
export const setMaskParams = (id: string, params: MaskParams): SetMaskParamsAction =>
    ({type: EMaskAction.SET_MASK_PARAMS, id, params});
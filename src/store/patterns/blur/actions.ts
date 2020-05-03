import {PatternAction} from "../pattern/types";
import {BlurValue} from "./types";
import {updateImage} from "../pattern/actions";

export enum EBlurAction {
    SET_BLUR = "pattern/set-blur",
}

export interface SetBlurAction extends PatternAction {
    blur: BlurValue
}

export const setBlur = (id: string, blur: BlurValue): SetBlurAction =>
    ({type: EBlurAction.SET_BLUR, id, blur});

export const blurOnce = (id: string) => (dispatch) => {
    dispatch(updateImage(id, null, true, true));
};
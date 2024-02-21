import {PatternAction} from "../pattern/types";
import {BlurValue} from "./types";
import {updateImage} from "../pattern/actions";
import {AppState, patternsService} from "../../index";
import * as StackBlur from 'stackblur-canvas';

export enum EBlurAction {
    SET_BLUR = "pattern/set-blur",
}

export interface SetBlurAction extends PatternAction {
    blur: BlurValue
}

export const setBlur = (id: string, blur: BlurValue): SetBlurAction =>
    ({type: EBlurAction.SET_BLUR, id, blur});

export const blurOnce = (id: string) => (dispatch, getState: () => AppState) => {
    const pattern = getState().patterns[id];
    const patternService = patternsService.pattern[id];
    
    const radius = Math.round(pattern.blur?.value?.radius);
    
    if (radius > 0) {
        patternService.canvasService.setImageData(
            StackBlur.imageDataRGBA(
                patternService.canvasService.getImageData(),
                0, 0, 
                pattern.width, pattern.height, radius
            )
        );
    
        dispatch(updateImage({
            id,
            // imageData: null,
            emit: true,
            // blur: true
        }));
    }


    
};
import {createCanvasStateFromImageData, createCleanCanvasState} from "../../../utils/state";
import {MaskParams, MaskValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getMaskState = (width, height, mask?) => getFunctionState<MaskValue, MaskParams>(
    mask ? createCanvasStateFromImageData(mask) : createCleanCanvasState(width, height), {
        opacity: 1,
        black: true
    });
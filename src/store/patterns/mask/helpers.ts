import {createCanvasStateFromImageData, createCleanCanvasState} from "../../../utils/state";
import {MaskParams, MaskValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getMaskState = getFunctionState<MaskValue, MaskParams>(
    // mask ? createCanvasStateFromImageData(mask) : createCleanCanvasState(width, height), {
    {}, {
        inverse: false
    });

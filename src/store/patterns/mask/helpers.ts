import {createCleanCanvasState} from "../../../utils/state";
import {MaskParams, MaskValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getMaskState = (width, height) => getFunctionState<MaskValue, MaskParams>(
    createCleanCanvasState(width, height), {
        opacity: 1,
        black: true
    });
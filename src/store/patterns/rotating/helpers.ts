import {RotationParams, RotationValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getRotationState = getFunctionState<RotationValue, RotationParams>(
    {
        angle: 0,
        offset: {
            x: 0,
            y: 0
        }
    }, {});
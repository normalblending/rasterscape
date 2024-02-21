import {RotationParams, RotationValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getRotationState = getFunctionState<RotationValue, RotationParams>(
    {
        angle: 0,
        offset: {
            xc: 0,
            yc: 0,
            xd: 0,
            yd: 0,
        },
        changing: false,
        rotateDrawAreaElement: true,
    }, {});
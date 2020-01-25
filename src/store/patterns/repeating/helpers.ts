import {ERepeatingType, RepeatingParams, RepeatingValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getRepeatingState = getFunctionState<RepeatingValue, RepeatingParams>(
    {}, {
        type: ERepeatingType.Grid,
        gridParams: {
            x: 2,
            y: 2,
            xOut: 1,
            yOut: 1,
            bezierPoints: [{x: 0, y: 0}, {x: 50, y: 50}, {x: 50, y: 50}, {x: 100, y: 100}],
            integer: true
        }
    });
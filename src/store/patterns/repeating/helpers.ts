import {ERepeatingType, RepeatingParams, RepeatingValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getRepeatingState = getFunctionState<RepeatingValue, RepeatingParams>(
    {}, {
        type: ERepeatingType.Grid,
        gridParams: {
            xd: 2,
            yd: 2,
            xn0: 0,
            yn0: 0,
            xn1: 0,
            yn1: 0,
            bezierPoints: [{x: 0, y: 0}, {x: 25, y: 25}, {x: 75, y: 75}, {x: 100, y: 100}],
            float: false,
            flat: false,
        }
    });
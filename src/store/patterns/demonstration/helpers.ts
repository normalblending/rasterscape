import {DemonstrationMode, DemonstrationParams, DemonstrationValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getDemonstrationState = getFunctionState<DemonstrationValue, DemonstrationParams>(
    {
        enabled: false
    }, {
        mode: DemonstrationMode.fill
    });
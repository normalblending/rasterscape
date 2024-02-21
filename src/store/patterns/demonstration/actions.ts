import {PatternAction} from "../pattern/types";
import {DemonstrationParams, DemonstrationValue} from "./types";
import {updateImage} from "../pattern/actions";

export enum EDemonstrationAction {
    TOGGLE_DEMONSTRATION = "pattern/toggle-demonstration",
    SET_DEMONSTRATION_ENABLED = "pattern/set-demonstration-enabled",
    SET_DEMONSTRATION_PARAMS = "pattern/set-demonstration-params",
}

export interface SetDemonstrationEnabledAction extends PatternAction {
    enabled: boolean
}

export interface SetDemonstrationParamsAction extends PatternAction {
    params: DemonstrationParams
}

export const toggleDemonstration = (id: string): PatternAction =>
    ({type: EDemonstrationAction.TOGGLE_DEMONSTRATION, id});

export const setDemonstrationEnabled = (id: string, enabled: boolean): SetDemonstrationEnabledAction =>
    ({type: EDemonstrationAction.SET_DEMONSTRATION_ENABLED, id, enabled});

export const setDemonstrationParams = (id: string, params: any): SetDemonstrationParamsAction =>
    ({type: EDemonstrationAction.SET_DEMONSTRATION_PARAMS, id, params});

import {handleActions} from "redux-actions";
import {BrushParams, EBrushType, SetBrushParamsAction} from "./types";
import {EBrushAction} from "./actions";
import {ParamConfig} from "../../components/_shared/Params";
import {getBrushParamsConfig} from "./helpers";

export interface BrushState {
    params: BrushParams
    paramsConfig: ParamConfig[]
}

export const brushReducer = handleActions<BrushState>({
    [EBrushAction.SET_PARAMS]: (state: BrushState, action: SetBrushParamsAction) => {
        const params = {
            ...state.params,
            ...action.params
        };
        const paramsConfig = getBrushParamsConfig(params);
        return {
            paramsConfig,
            params
        }
    }
}, {
    params: {
        size: 5,
        opacity: 1,
        type: EBrushType.Square
    },
    paramsConfig: getBrushParamsConfig()
});



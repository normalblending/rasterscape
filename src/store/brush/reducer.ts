import {handleActions} from "redux-actions";
import {BrushParams, EBrushType, SetBrushParamsAction} from "./types";
import {EBrushAction} from "./actions";
import {ParamConfig} from "../../components/_shared/Params";
import {getBrushParamsConfig} from "./helpers";
import {ECompositeOperation} from "../compositeOperations";

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
        return {
            ...state,
            params
        }
    }
}, {
    params: {
        patternSize: 1,
        size: 43,
        opacity: 1,
        type: EBrushType.Circle,
        compositeOperation: ECompositeOperation.SourceOver
    },
    paramsConfig: getBrushParamsConfig()
});



import {handleActions} from "redux-actions";
import {ELineCapType, ELineJoinType, ELineRandomType, ELineType, LineParams, SetLineParamsAction} from "./types";
import {ELineAction} from "./actions";
import {ParamConfig} from "../../components/_shared/Params";
import {getLineParamsConfig} from "./helpers";
import {ECompositeOperation} from "../compositeOperations";

export interface LineState {
    params: LineParams
    paramsConfig: ParamConfig[]
}

export const lineReducer = handleActions<LineState>({
    [ELineAction.SET_PARAMS]: (state: LineState, action: SetLineParamsAction) => {
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
        size: 5,
        patternSize: 1,
        opacity: 1,
        type: ELineType.Solid,
        cap: ELineCapType.Butt,
        join: ELineJoinType.Bevel,
        random: ELineRandomType.OnLine,
        patternMouseCentered: false,
        patternDirection: false,
        compositeOperation: ECompositeOperation.SourceOver
    },
    paramsConfig: getLineParamsConfig()
});



import {handleActions} from "redux-actions";
import {ELineType, LineParams, SetLineParamsAction} from "./types";
import {ELineAction} from "./actions";
import {ParamConfig} from "../../components/_shared/Params";
import {getLineParamsConfig} from "./helpers";

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
        const paramsConfig = getLineParamsConfig(params);
        return {
            paramsConfig,
            params
        }
    }
}, {
    params: {
        size: 5,
        opacity: 1,
        type: ELineType.Default
    },
    paramsConfig: getLineParamsConfig()
});



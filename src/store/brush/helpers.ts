import {BrushParams,EBrushType} from "./types";
import {ValueD} from "../../components/_shared/buttons/complex/ButtonNumber";
import {arrayToSelectItems} from "../../utils/utils";
import {compositeOperationSelectItems} from '../compositeOperations';
import {BrushState} from "./reducer";
import {EParamType, ParamConfig} from "../../components/_shared/Params.types";

export const brushTypeSelectItems = arrayToSelectItems(Object.values(EBrushType));

export const setParamsByType = (type: EBrushType) => (state: BrushState, action) => {
    const params = {
        ...state.params,
        paramsByType: {
            ...state.params.paramsByType,
            [EBrushType.Pattern]: {
                ...state.params.paramsByType[EBrushType.Pattern],
                ...action.params
            }
        },
    };
    return {
        ...state,
        params,
    }
};
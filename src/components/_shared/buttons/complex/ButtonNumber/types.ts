import {ChangeFunctionState} from "../../../../../store/changeFunctions/types";

export interface AmplitudeComponentProps {
    range,
    params,
    changingStartValue,
    changeFunctionId,
    changeFunction: ChangeFunctionState
    type?
    number?
    changing,
    buttonWidth
}
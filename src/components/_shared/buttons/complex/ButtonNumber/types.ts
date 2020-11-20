import {ChangeFunction} from "../../../../../store/changeFunctions/types";

export interface AmplitudeComponentProps {
    range,
    params,
    changingStartValue,
    changeFunctionId,
    changeFunction: ChangeFunction
    type?
    number?
    changing,
    buttonWidth
}
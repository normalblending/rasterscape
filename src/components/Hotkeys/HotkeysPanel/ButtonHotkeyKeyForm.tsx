import * as React from "react";
import {setHotkeyOnRelease} from "../../../store/hotkeys/actions";
import {ButtonSelect} from "../../_shared/buttons/simple/ButtonSelect";
import {ButtonHotkeyKeyInput} from "./ButtonHotkeyKeyInput";
import {useDispatch, useSelector} from "react-redux";
import {getAutoFocusBlur} from "../../../store/hotkeys/selectors";
import {HotkeyControlType, HotkeyKeyValue} from "../../../store/hotkeys/types";

export interface ButtonHotkeyKeyFormProps {
    path: string
    index: number
    value: HotkeyKeyValue
    controlType: HotkeyControlType
}

export const ButtonHotkeyKeyForm: React.FC<ButtonHotkeyKeyFormProps> = (props) => {

    const {value, path, index, controlType} = props;

    const [autofocus, autoblur] = useSelector(getAutoFocusBlur);

    return (
        <ButtonHotkeyKeyInput
            controlType={controlType}
            path={path}
            value={value}
            index={index}
            autofocus={autofocus}
            autoblur={autoblur}
        />
    );
};

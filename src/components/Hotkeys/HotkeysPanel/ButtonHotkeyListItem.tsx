import * as React from "react";
import {HKLabelProps} from "../../_shared/buttons/hotkeyed/types";
import {labelFormatters} from "../../../store/hotkeys/label-formatters";

import {WithTranslation, withTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {getAutoFocusBlur} from "../../../store/hotkeys/selectors";
import {ButtonHotkeyKeyForm} from "./ButtonHotkeyKeyForm";
import {ButtonHotkeyValue} from "../../../store/hotkeys/types";
import './ButtonHotkeyListItem.scss'
export interface ButtonHotkeyListItemProps extends WithTranslation {
    value: ButtonHotkeyValue
}

export const ButtonHotkeyListItem = withTranslation("common")((props: ButtonHotkeyListItemProps) => {

    const {value, t} = props;

    const [autofocus, autoblur] = useSelector(getAutoFocusBlur);

    const {
        keys,
        maxKeysCount,
        label,
        labelData,
        labelFormatter,
        path,
        controlType
    } = value;

    const hkLabelProps: HKLabelProps = {
        hkLabel: label,
        hkLabelFormatter: labelFormatter,
        hkData0: labelData[0],
        hkData1: labelData[1],
        hkData2: labelData[2],
        hkData3: labelData[3],
    };// as HKLabelProps;


    const data = {
        data0: labelData?.[0],
        data1: labelData?.[1],
        data2: labelData?.[2],
        data3: labelData?.[3],
    };

    const text = (labelFormatter && labelFormatters[labelFormatter])
        ? labelFormatters[labelFormatter](t, label, data)
        : t(label, data);

    return (
        <div className={'hotkeys-list-item'} key={path}>
            <div className={'hotkey-list-form'}>
                {keys.map((key, index) => {
                    return <ButtonHotkeyKeyForm
                        path={path}
                        value={key}
                        index={index}
                        controlType={controlType}
                    />
                })}
                <div className={'hotkeys-list-item-filler'}></div>
            </div>
            <div className={'hotkey-name'}>
                {text}
            </div>
        </div>
    );
});

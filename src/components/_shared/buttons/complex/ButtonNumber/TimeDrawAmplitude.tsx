import * as React from "react";
import {AmplitudeComponentProps} from "./types";
import {WithTranslation, withTranslation} from "react-i18next";
import {Translations} from "../../../../../store/language/helpers";
import {
    DrawCenterParams,
    DrawParams,
    DrawStretchParams,
    DrawType
} from "../../../../../store/changeFunctions/functions/wave";

export interface TimeDrawAmplitudeProps extends AmplitudeComponentProps, WithTranslation {

}


const getWidthAndLengthByType = {
    [DrawType.Center]: (params: DrawCenterParams, changingStartValue, range) => {
        const startVPerc = ((changingStartValue - range[0]) / (range[1] - range[0]));

        const ampWidth = params.amplitude
            - Math.max(params.offset * params.amplitude - startVPerc, 0)
            - Math.max(params.amplitude - params.offset * params.amplitude - (1 - startVPerc), 0);
        return {
            width: ampWidth,
            left: startVPerc - params.offset * params.amplitude
        }
    },
    [DrawType.Stretch]: (params: DrawStretchParams) => {

        return {
            width: Math.abs(params.to - params.from),
            left: Math.min(params.from, params.to),
        }
    },
};
export const TimeDrawAmplitudeComponent: React.FC<TimeDrawAmplitudeProps> = (props) => {
    const {
        t,
        range,
        params: drawParams,
        changingStartValue,
        changeFunction,
        changing,
        buttonWidth
    } = props;

    const {width, left} = getWidthAndLengthByType[drawParams.type]?.(
        drawParams.typeParams[drawParams.type],
        changingStartValue,
        range
    );

    return (
        <div
            className={"button-number-amplitude"}
            style={{
                width: `${Math.max(width, 0) * 100}%`,
                left: `${Math.max(left, 0) * 100}%`
            }}>
            <span>{Translations.cf(t)(changeFunction)}</span>
        </div>
    );
};

export const TimeDrawAmplitude = withTranslation('common')(TimeDrawAmplitudeComponent);

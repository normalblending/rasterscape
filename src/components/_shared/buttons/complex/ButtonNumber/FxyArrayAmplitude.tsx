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
import {FxyArrayCoordinateParams, FxyArrayType} from "../../../../../store/changeFunctions/functions/fxy";

export interface FxyArrayAmplitudeProps extends AmplitudeComponentProps, WithTranslation {

}


const getWidthAndLengthByType = {
    [FxyArrayType.X]: (params: FxyArrayCoordinateParams) => {

        return {
            width: Math.abs(params.to - params.from),
            left: Math.min(params.from, params.to),
        }
    },
    [FxyArrayType.Y]: (params: FxyArrayCoordinateParams) => {

        return {
            width: Math.abs(params.to - params.from),
            left: Math.min(params.from, params.to),
        }
    },
};
export const FxyArrayAmplitudeComponent: React.FC<FxyArrayAmplitudeProps> = (props) => {
    const {
        t,
        range,
        params: arrayParams,
        changingStartValue,
        changeFunction,
        changing,
        buttonWidth
    } = props;

    const {width, left} = getWidthAndLengthByType[arrayParams.type]?.(
        arrayParams.typeParams[arrayParams.type],
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

export const FxyArrayAmplitude = withTranslation('common')(FxyArrayAmplitudeComponent);

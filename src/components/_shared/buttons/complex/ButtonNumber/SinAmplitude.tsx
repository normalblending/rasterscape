import * as React from "react";
import {AmplitudeComponentProps} from "./types";
import {withTranslation, WithTranslation} from "react-i18next";
import {Translations} from "../../../../../store/language/helpers";

export interface SinAmplitudeProps extends AmplitudeComponentProps, WithTranslation {

}

export const SinAmplitudeComponent: React.FC<SinAmplitudeProps> = ({t, changeFunction, range, params, changingStartValue, changeFunctionId, changing, buttonWidth}) => {
    const startVPerc = ((changingStartValue - range[0]) / (range[1] - range[0]));

    const ampWidth = (Math.min(startVPerc, params.a) + Math.min(1 - startVPerc, params.a));

    return (
        <div
            className={"button-number-amplitude"}
            style={{
                width: ampWidth * 100 + "%",
                left: `${(Math.max(startVPerc - params.a, 0)) * 100}%`
            }}>
                    <span>
                    {Translations.cf(t)(changeFunction)}
                    </span>
        </div>
    );
};

export const SinAmplitude = withTranslation('common')(SinAmplitudeComponent);

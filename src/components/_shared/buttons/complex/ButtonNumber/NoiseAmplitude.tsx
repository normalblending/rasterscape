import * as React from "react";
import {AmplitudeComponentProps} from "./types";
import {withTranslation, WithTranslation} from "react-i18next";
import {Translations} from "../../../../../store/language/helpers";

export interface NoiseAmplitudeProps extends AmplitudeComponentProps, WithTranslation {

}

export const NoiseAmplitudeComponent: React.FC<NoiseAmplitudeProps> = (props) => {

    const {range, params, changingStartValue, changeFunction, changing, buttonWidth, t} = props;

    const startVPerc = ((changingStartValue - range[0]) / (range[1] - range[0]));

    const ampWidth = (Math.min(startVPerc, params.start) + Math.min(1 - startVPerc, params.start));

    return (
        <div
            className={"button-number-amplitude"}
            style={{
                width: ampWidth * 100 + "%",
                left: `calc(${(Math.max(startVPerc - params.start, 0)) * 100}%)`
            }}>
                    <span>
                    {Translations.cf(t)(changeFunction)}
                    </span>
        </div>
    );
};

export const NoiseAmplitude = withTranslation('common')(NoiseAmplitudeComponent);
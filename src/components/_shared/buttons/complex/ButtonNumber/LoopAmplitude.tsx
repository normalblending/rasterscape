import * as React from "react";
import {AmplitudeComponentProps} from "./types";
import {WithTranslation, withTranslation} from "react-i18next";
import {Translations} from "../../../../../store/language/helpers";

export interface LoopAmplitudeProps extends AmplitudeComponentProps, WithTranslation {

}

export const LoopAmplitudeComponent: React.FC<LoopAmplitudeProps> = ({t, params, changingStartValue, changeFunction, changing, buttonWidth}) => {

    return (
        <div
            className={"button-number-amplitude"}
            style={{
                width: Math.abs(params.end - params.start) * 100 + "%",
                left: `${Math.min(params.start, params.end) * 100}%`
            }}>
                <span>{Translations.cf(t)(changeFunction)}</span>
        </div>
    );
};

export const LoopAmplitude = withTranslation('common')(LoopAmplitudeComponent);
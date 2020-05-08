import * as React from "react";
import {AmplitudeComponentProps} from "./types";

export interface SinAmplitudeProps extends AmplitudeComponentProps {

}

export const SinAmplitude: React.FC<SinAmplitudeProps> = ({range, params, changingStartValue, changeFunctionId, changing, buttonWidth}) => {
    const startVPerc = ((changingStartValue - range[0]) / (range[1] - range[0]));

    const ampWidth = (Math.min(startVPerc, params.a) + Math.min(1 - startVPerc, params.a));

    return (
        <div
            className={"button-number-amplitude"}
            style={{
                width: ampWidth * 100 + "%",
                left: `calc(${(Math.max(startVPerc - params.a, 0)) * 100}%)`
            }}>
                    <span>
                    {changeFunctionId}sin
                    </span>
        </div>
    );
};
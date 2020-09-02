import * as React from "react";
import {AmplitudeComponentProps} from "./types";

export interface NoiseAmplitudeProps extends AmplitudeComponentProps {

}

export const NoiseAmplitude: React.FC<NoiseAmplitudeProps> = ({range, params, changingStartValue, changeFunctionId, changing, buttonWidth}) => {

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
                    {changeFunctionId}noise
                    </span>
        </div>
    );
};
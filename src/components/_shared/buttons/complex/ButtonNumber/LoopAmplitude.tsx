import * as React from "react";
import {AmplitudeComponentProps} from "./types";

export interface LoopAmplitudeProps extends AmplitudeComponentProps {

}

export const LoopAmplitude: React.FC<LoopAmplitudeProps> = ({range, params, changingStartValue, changeFunctionId, changing, buttonWidth}) => {

    return (
        <div
            className={"button-number-amplitude"}
            style={{
                width: Math.abs(params.end - params.start) * 100 + "%",
                left: `${Math.min(params.start, params.end) * 100}%`
            }}>
                    <span>
                    {changeFunctionId}saw
                    </span>
        </div>
    );
};
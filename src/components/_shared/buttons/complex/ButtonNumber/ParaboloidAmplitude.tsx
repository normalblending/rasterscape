import * as React from "react";
import {createCanvas} from "../../../../../utils/canvas/helpers/base";
import {Canvas} from "../../../Canvas";
import {AmplitudeComponentProps} from "./types";
import * as classNames from "classnames";
import * as Color from "color";
import xyamplitude from './xyamplitude.png';

export interface ParaboloidAmplitudeProps extends AmplitudeComponentProps {

}

export const xyAmplitude = (type): React.FC<ParaboloidAmplitudeProps> => (props) => {
    const {range, params, changingStartValue, changeFunctionId, changing, buttonWidth} = props;


    const ampWidth = params.end * (1 - (changingStartValue - range[0]) / (range[1] - range[0]));

    const startVPerc = (changingStartValue  - range[0])/ (range[1] - range[0]);

    return (
        <div
            style={{
                width: ampWidth * 100 + "%",
                left: `${(startVPerc) * 100}%`
            }}
            className={classNames("button-number-xy-amplitude", {["button-number-xy-amplitude-changing"]: changing})}
            >
            <img src={xyamplitude} />
            <span>{changeFunctionId}{type}</span>
        </div>
    );
};

export const ParaboloidAmplitude = xyAmplitude('parab');
export const Sis2Amplitude = xyAmplitude('sis2');
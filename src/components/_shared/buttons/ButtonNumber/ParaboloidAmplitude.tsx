import * as React from "react";
import {createCanvas} from "../../../../utils/canvas/helpers/base";
import {Canvas} from "../../Canvas";
import {AmplitudeComponentProps} from "./types";
import * as classNames from "classnames";
import * as Color from "color";

export interface ParaboloidAmplitudeProps extends AmplitudeComponentProps {

}

export const xyAmplitude = (type): React.FC<ParaboloidAmplitudeProps> => (props) => {
    const {range, params, changingStartValue, changeFunctionId, changing, buttonWidth} = props;


    const ampWidth = params.end * (1 - (changingStartValue - range[0]) / (range[1] - range[0]));

    const startVPerc = (changingStartValue  - range[0])/ (range[1] - range[0]);

    // console.log(props);
    const width = Math.round(buttonWidth * ampWidth);

    if (width <= 1) {
        return (
            <div
                style={{
                    width: ampWidth * 100 + "%",
                    left: `${startVPerc * 100}%`
                }}
                className={classNames("button-number-xy-amplitude", {["button-number-xy-amplitude-changing"]: changing})}>
                <span>{changeFunctionId}</span>
            </div>);
    }

    const height = 6;
    const {canvas, context} = createCanvas(width, height);
    const imageData = context.getImageData(0, 0, width, height);



    for (let i = 0; i < imageData.data.length; i += 4) {

        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);

        const colorTo = 350;
        const colorFrom = colorTo - 100;

        const color = Color.hsl(Math.max(Math.min(colorTo - x/width * (colorTo - colorFrom), colorTo), colorFrom), 50, 50);

// console.log(a);

        const rgb = color.rgb().array();


        imageData.data[i] = rgb[0];
        imageData.data[i + 1] = rgb[1];
        imageData.data[i + 2] = rgb[2];
        imageData.data[i + 3] = 200;
    }


    return (
        <Canvas
            style={{
                width: ampWidth * 100 + "%",
                left: `${(startVPerc) * 100}%`
            }}
            className={classNames("button-number-xy-amplitude", {["button-number-xy-amplitude-changing"]: changing})}
            width={width}
            height={height}
            value={imageData}>
            <span>{changeFunctionId}{type}</span>
        </Canvas>
    );
};

export const ParaboloidAmplitude = xyAmplitude('parab');
export const Sis2Amplitude = xyAmplitude('sis2');
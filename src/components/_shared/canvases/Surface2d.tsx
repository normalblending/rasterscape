import * as React from "react";
import {ECFType} from "../../../store/changeFunctions/types";
import {xyParaboloid} from "../../../store/changeFunctions/functions/helpers";
import {CanvasByDrawFunction} from "./CanvasByDrawFunction";
import * as Color from "color";

export interface Surface2dProps {
    type: ECFType
    params: any
    width: number
    height: number
}

export interface Surface2dState {

}

export class Surface2d extends React.PureComponent<Surface2dProps, Surface2dState> {

    draw = ({context}) => {
        const {width, height} = this.props;
        const {zd, end, x, y, xa, ya} = this.props.params;

        const WW = 1;
        const HH = 1;


        const imageData = context.getImageData(0, 0, width, height);

        const f = xyParaboloid(WW/2, HH/2, x, y);

        for (let i = 0; i < imageData.data.length; i += 4) {

            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);

            const xnorm = x / width * WW;
            const ynorm = y / height * HH;
            const znorm = f(xnorm, ynorm) + zd;

            const colorFrom = 200;
            const colorTo = colorFrom + 150;

            const color = Color.hsl(Math.max(Math.min(colorTo- znorm * (colorTo - colorFrom), colorTo), colorFrom), 50, 50);

// console.log(a);

            const rgb = color.rgb().array();


            imageData.data[i] = rgb[0];
            imageData.data[i + 1] = rgb[1];
            imageData.data[i + 2] = rgb[2];
            imageData.data[i + 3] = 255;
        }

        context.putImageData(imageData, 0, 0);
    };


    render() {
        const {width, height} = this.props;
        return (
            <CanvasByDrawFunction
                width={width}
                height={height}>
                {this.draw}
            </CanvasByDrawFunction>
        );
    }
}
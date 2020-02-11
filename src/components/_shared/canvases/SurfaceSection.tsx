import * as React from "react";
import {Canvas} from "../Canvas";
import * as Bezier from "bezier-js";
import {bindDrawFunctions, handleInteraction} from "../../../utils/bezier";
import {ChangeF} from "../../ChangeF";
import {ECFType} from "../../../store/changeFunctions/types";
import {xyParaboloid} from "../../../store/changeFunctions/functions/helpers";
import {CanvasByDrawFunction} from "./CanvasByDrawFunction";

export interface SurfaceSectionProps {
    type: ECFType
    params: any
    W: number
    H: number
}

export interface SurfaceSectionState {

}

export class SurfaceSection extends React.PureComponent<SurfaceSectionProps, SurfaceSectionState> {

    draw = ({context, drawFunctions}) => {
        const {W, H} = this.props;
        const {start, end, x, y, xa, ya} = this.props.params;



        const imageData = context.getImageData(0, 0, W, H);

        const f = xyParaboloid(W/2, H/2, xa/x, ya/y);

        const N = 20;

        context.strokeStyle = "black";

        context.font = "28px";
        context.textBaseline = "hanging";
        context.fillStyle = 'black';
        // context.fillText(Math.sqrt(Tmax / T) * 2, 120, Math.sqrt(Amax / A)*A / Amax * H / 2);
        // context.fillText(A, 20, -(Math.sqrt(Amax / A)*A / Amax * H / 2)+ H / 2);

        for (let p = 0; p <= N; p++) {

            const pn = p / N;
            const x = (pn) * W;

            for (let b = 0; b <= N; b++) {
                const y = f(x, b / N * W);

                if (!b)
                context.moveTo(x, y)
                else
                    context.lineTo(x, y)
            }

        }
        context.stroke();
    };


    render() {
        const {W = 120, H = 100} = this.props;
        return (
            <CanvasByDrawFunction
                width={W}
                height={H}>
                {this.draw}
            </CanvasByDrawFunction>
        );
    }
}
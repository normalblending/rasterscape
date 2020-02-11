import * as React from "react";
import {Canvas} from "../Canvas";
import * as Bezier from "bezier-js";
import {bindDrawFunctions, handleInteraction} from "../../../utils/bezier";

export interface WaveProps {
    A: number
    T: number
    Tmax: number
    Amax: number
    W: number
    H: number
    O: number
}

export interface WaveState {

}

export class Wave extends React.PureComponent<WaveProps, WaveState> {

    canvasRef;
    drawFunctions;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    draw = () => {
        const {A, T, W, H, Tmax, Amax, O} = this.props;
        const ctx = this.canvasRef.current.getContext("2d");


        const N = 150;

        ctx.strokeStyle = "black";

        ctx.font = "28px";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = 'black';
        ctx.fillText(Math.sqrt(Tmax / T) * 2, 120, Math.sqrt(Amax / A)*A / Amax * H / 2);
        ctx.fillText(A, 20, -(Math.sqrt(Amax / A)*A / Amax * H / 2)+ H / 2);

        for (let p = 0; p <= N; p++) {

            const pn = p / N;
            const deg = (pn) * (2 * Math.PI) * Tmax / T;
            const x = (pn) * W;
            const y = Math.sin(deg + O *2* Math.PI) *A / Amax * H / 2 * (-1) + H / 2;

            ctx.lineTo(x, y)

        }
        ctx.stroke();


    };

    componentDidMount(): void {
        if (this.canvasRef.current) {

            //todo вынести это в hoc
            this.drawFunctions = bindDrawFunctions(this.canvasRef.current);

            this.draw();
            // handleInteraction(this.canvasRef.current, this.curve).onupdate = this.handleUpdate
        }
    }

    componentDidUpdate(prevProps: Readonly<WaveProps>, prevState: Readonly<WaveState>, snapshot?: any): void {

        this.drawFunctions.reset();
        this.draw();
        // this.canvasRef.current.canvasRef.setImageData(crea)
    }

    render() {
        const {W = 120, H = 100} = this.props;
        return (
            <canvas
                className={"grid-bezier-curve-canvas"}
                width={W}
                height={H}
                ref={this.canvasRef}/>
        );
    }
}
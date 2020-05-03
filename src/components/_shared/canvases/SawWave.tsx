import * as React from "react";
import {bindDrawFunctions, handleInteraction} from "../../../utils/bezier";
import '../../../styles/waveCanvas.scss';

export interface SawWaveProps {
    start: number
    end: number
    t: number
    W: number
    H: number
}

export interface SawWaveState {

}

export class SawWave extends React.PureComponent<SawWaveProps, SawWaveState> {

    canvasRef;
    drawFunctions;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    draw = () => {
        const {start, end, t, W, H} = this.props;
        const ctx = this.canvasRef.current.getContext("2d");


        const N = 150;

        ctx.strokeStyle = "black";

        ctx.font = "28px";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = 'black';
        // ctx.fillText(Math.sqrt(Tmax / T) * 2, 120, Math.sqrt(Amax / A)*A / Amax * H / 2);
        // ctx.fillText(A, 20, -(Math.sqrt(Amax / A)*A / Amax * H / 2)+ H / 2);

        const ss = 40000/t;
        for (let p = 0; p <= N; p++) {



            // const deg = (pn) * (2 * Math.PI) * Tmax / T;
            const x = (p / N) * W;




            const pn = (p % (N / ss)) / N * ss;
            const y = H-(pn * (end - start) + start) * H;
            // const y = Math.sin(deg + O *2* Math.PI) *A / Amax * H / 2 * (-1) + H / 2;

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

    componentDidUpdate(prevProps: Readonly<SawWaveProps>, prevState: Readonly<SawWaveState>, snapshot?: any): void {

        this.drawFunctions.reset();
        this.draw();
        // this.canvasRef.current.canvasRef.setImageData(crea)
    }

    render() {
        const {W = 120, H = 100} = this.props;
        return (
            <canvas
                className={"saw-canvas"}
                width={W}
                height={H}
                ref={this.canvasRef}/>
        );
    }
}
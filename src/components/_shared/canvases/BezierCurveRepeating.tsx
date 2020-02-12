import * as React from "react";
import * as Bezier from "bezier-js";
import {bindDrawFunctions, handleInteraction} from "../../../utils/bezier";
import "../../../styles/bezierCurveRepeating.scss";

export type BezierPoints = { x: number, y: number }[];

export interface BezierCurveRepeatingProps {
    onChange(points: BezierPoints)

    xn: number
    yn: number
    value: BezierPoints
}

export interface BezierCurveRepeatingState {
    points: BezierPoints
}

const W = 210;
const H = 140;
const WW = 100;
const HH = 100;
const O = {x: 55, y: 17};


export class BezierCurveRepeating extends React.PureComponent<BezierCurveRepeatingProps, BezierCurveRepeatingState> {

    canvasRef;
    drawFunctions;
    curve;

    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();

        this.curve = new Bezier(props.value);
    }

    draw = () => {
        const ctx = this.canvasRef.current.getContext("2d");

        const N = this.props.xn, M = this.props.yn;

        const r = 1;


        // background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, W, H);

        // frame
        ctx.rect(O.x, O.y, WW, HH);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#595959";
        ctx.stroke();



        ctx.font = "8px arial";
        ctx.textBaseline = "hanging";
        ctx.textAlign = "center";
        ctx.fillStyle = 'white';

        const NN = 4, MM = 4;
        ctx.lineWidth = 1;
        for (let xi = 0; xi <= NN; xi++) {
            this.drawFunctions.drawLine({x: xi/NN * WW, y: HH+1}, {x: xi/NN * WW, y: HH + 5}, O);


            ctx.fillText(Math.round(xi/NN * 100), xi/NN * WW + O.x, HH + 7 + O.y);
            // ctx.fillText(A, 20, -(Math.sqrt(Amax / A)*A / Amax * H / 2)+ H / 2);
        }

        ctx.textBaseline = "middle";
        ctx.textAlign = "right";
        for (let yi = 0; yi <= MM; yi++) {
            this.drawFunctions.drawLine({y: yi/MM * HH, x: -1}, {y: yi/MM * HH, x: -5}, O);
            ctx.fillText(Math.round(100 - yi/MM * 100), -6 + O.x, yi/MM * HH + O.y);
        }




        // grid points
        ctx.lineWidth = 1.2;
        ctx.fillStyle = "white";
        for (let i = 0; i <= N; i++) {
            const ai = this.curve.get(i / N);
            for (let j = 0; j <= M; j++) {

                const aj = this.curve.get(j / M);

                ctx.fillRect(O.x + ai.x - r / 2, O.y + aj.y - r / 2, r, r);
            }
        }

        ctx.fillStyle = "transparent";
        ctx.closePath();

        // skeleton

        ctx.globalAlpha = .5;
        const offset = O;
        var pts = this.curve.points;
        ctx.strokeStyle = 'white';
        this.drawFunctions.drawLine(pts[0], pts[1], offset);
        if (pts.length === 3) {
            this.drawFunctions.drawLine(pts[1], pts[2], offset);
        } else {
            this.drawFunctions.drawLine(pts[2], pts[3], offset);
        }
        ctx.globalAlpha = 1;

        // curve
        this.drawFunctions.drawCurve(this.curve, {line: '#ffcd00'}, O);
        // points
        ctx.strokeStyle = "white";
        ctx.fillStyle="black";
        this.curve.points.forEach((p, i) => {
            if (i === 2 || i === 1) {
                this.drawFunctions.drawRect(p, 5,5, O);
            } else {

                this.drawFunctions.drawRect(p, 5,5, O);
            }
        });




    };

    handleUpdate = () => {
        this.drawFunctions.reset();
        this.draw();
        this.props.onChange(this.curve.points);
    };

    componentDidMount(): void {
        if (this.canvasRef.current) {

            this.drawFunctions = bindDrawFunctions(this.canvasRef.current);

            this.draw();
            handleInteraction(this.canvasRef.current, this.curve, O).onupdate = this.handleUpdate
        }
    }

    componentDidUpdate(prevProps: Readonly<BezierCurveRepeatingProps>, prevState: Readonly<BezierCurveRepeatingState>, snapshot?: any): void {
        if (prevProps.value !== this.props.value || prevProps.xn !== this.props.xn || prevProps.yn !== this.props.yn) {
            this.curve.points[0] = this.props.value[0];
            this.curve.points[1] = this.props.value[1];
            this.curve.points[2] = this.props.value[2];
            this.curve.points[3] = this.props.value[3];
            this.curve.update();

            this.drawFunctions.reset();
            this.draw();
        }
    }

    render() {
        return (
            <div>
                <canvas
                    className={"grid-bezier-curve-canvas"}
                    width={W}
                    height={H}
                    ref={this.canvasRef}/>
            </div>
        );
    }
}
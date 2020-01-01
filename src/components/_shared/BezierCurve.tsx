import * as React from "react";
import {Canvas} from "./Canvas";
import * as Bezier from "bezier-js";
import {bindDrawFunctions, handleInteraction} from "../../utils/bezier";
import "../../styles/gridBezierCurveCanvas.scss";

export type BezierPoints = { x: number, y: number }[];

export interface BezierCurveProps {
    onChange(points: BezierPoints)
    xn: number
    yn: number
    value: BezierPoints
}

export interface BezierCurveState {
    points: BezierPoints
}

const W = 100;
const H = 100;

export class BezierCurve extends React.PureComponent<BezierCurveProps, BezierCurveState> {

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

        const r = 3;

        this.drawFunctions.drawSkeleton(this.curve);
        this.drawFunctions.drawCurve(this.curve);

        for (let i = 0; i <= N; i++) {
            const ai = this.curve.get(i / N);
            for (let j = 0; j <= M; j++) {

                const aj = this.curve.get(j / M);

                ctx.fillStyle = "black";
                ctx.fillRect( ai.x - r / 2, aj.y - r / 2, r, r);
            }
        }

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
            handleInteraction(this.canvasRef.current, this.curve).onupdate = this.handleUpdate
        }
    }

    componentDidUpdate(prevProps: Readonly<BezierCurveProps>, prevState: Readonly<BezierCurveState>, snapshot?: any): void {
        if (prevProps.value !== this.props.value || prevProps.xn !== this.props.xn || prevProps.yn !== this.props.yn ) {
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
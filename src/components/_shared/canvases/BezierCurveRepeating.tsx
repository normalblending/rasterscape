import * as React from "react";
import * as Bezier from "bezier-js";
import {bindDrawFunctions, handleInteraction} from "../../../utils/bezier";
import "../../../styles/bezierCurveRepeating.scss";
import {SVG} from "../SVG";

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
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, W, H);

        // frame
        // ctx.rect(O.x, O.y, WW, HH);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#595959";
        ctx.stroke();


        ctx.font = "8px arial";
        ctx.textBaseline = "hanging";
        ctx.textAlign = "center";
        ctx.fillStyle = 'white';

        const NN = 4, MM = 4;
        // ctx.lineWidth = 1;
        // for (let xi = 0; xi <= NN; xi++) {
        //     this.drawFunctions.drawLine({x: xi / NN * WW, y: HH + 1}, {x: xi / NN * WW, y: HH + 5}, O);
        //
        //
        //     // ctx.fillText(Math.round(xi / NN * 100), xi / NN * WW + O.x, HH + 7 + O.y);
        //
        // }
        //
        // ctx.textBaseline = "middle";
        // ctx.textAlign = "right";
        // for (let yi = 0; yi <= MM; yi++) {
        //     this.drawFunctions.drawLine({y: yi / MM * HH, x: -1}, {y: yi / MM * HH, x: -5}, O);
        //     // ctx.fillText(Math.round(100 - yi / MM * 100), -6 + O.x, yi / MM * HH + O.y);
        // }


        // grid points
        // ctx.lineWidth = 1.2;
        // ctx.fillStyle = "white";
        // for (let i = 0; i <= N; i++) {
        //     const ai = this.curve.get(i / N);
        //     for (let j = 0; j <= M; j++) {
        //
        //         const aj = this.curve.get(j / M);
        //
        //         ctx.fillRect(O.x + ai.x - r / 2, O.y + aj.y - r / 2, r, r);
        //     }
        // }
        //
        // ctx.fillStyle = "transparent";
        // ctx.closePath();

        // skeleton

        // ctx.globalAlpha = .5;
        // const offset = O;
        // var pts = this.curve.points;
        // ctx.strokeStyle = 'white';
        // this.drawFunctions.drawLine(pts[0], pts[1], offset);
        // if (pts.length === 3) {
        //     this.drawFunctions.drawLine(pts[1], pts[2], offset);
        // } else {
        //     this.drawFunctions.drawLine(pts[2], pts[3], offset);
        // }
        // ctx.globalAlpha = 1;

        // curve
        // this.drawFunctions.drawCurve(this.curve, {line: '#ffcd00'}, O);
        // // points
        // ctx.strokeStyle = "white";
        // ctx.fillStyle = "black";
        // this.curve.points.forEach((p, i) => {
        //     if (i === 2 || i === 1) {
        //         this.drawFunctions.drawRect(p, 5, 5, O);
        //     } else {
        //
        //         this.drawFunctions.drawRect(p, 5, 5, O);
        //     }
        // });


    };

    handleUpdate = () => {
        this.forceUpdate()
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
            this.forceUpdate();
        }
    }

    render() {

        const points = this.curve.points;
        const point_w = 5;
        return (
            <div className={"grid-bezier-curve"}>

                <canvas
                    className={"grid-bezier-curve-canvas"}
                    width={W}
                    height={H}
                    ref={this.canvasRef}/>
                <SVG
                    className={"grid-bezier-curve-markers"}
                    width={W}
                    height={H}>
                    <rect
                        strokeWidth="0.3"
                        stroke="white"
                        fill="transparent"
                        x={O.x}
                        y={O.y}
                        width={WW}
                        height={HH}/>
                    {(() => {
                        const arx = [];
                        const ary = [];
                        const NN = 4, MM = 4;
                        for (let xi = 0; xi <= NN; xi++) {

                            arx.push({
                                y: HH + O.y,
                                x: xi / NN * WW + O.x,
                                text: Math.round(xi / NN * 100),
                            });

                        }

                        for (let yi = 0; yi <= MM; yi++) {
                            ary.push({
                                y: yi / MM * HH + O.y,
                                x: O.x,
                                text: Math.round(100 - yi / MM * 100),
                            });
                        }
                        return <>
                            {arx.map(({text, x, y}) =>
                                <text
                                    textAnchor="middle"
                                    className={'grid-bezier-curve-canvas-numbers'}
                                    x={x} y={y + 12}>{text}</text>)}
                            {ary.map(({text, x, y}) =>
                                <text
                                    textAnchor="end"
                                    className={'grid-bezier-curve-canvas-numbers'}
                                    x={x - 6} y={y + 2}>{text}</text>)}
                            {arx.map(({x, y}) =>
                                <path
                                    d={`M${x} ${y} L${x} ${y + 3} `}
                                    strokeWidth="0.3"
                                    stroke="white"
                                    fill="transparent"/>
                            )}
                            {ary.map(({x, y}) =>
                                <path
                                    d={`M${x} ${y} L${x - 4} ${y} `}
                                    strokeWidth="0.3"
                                    stroke="white"
                                    fill="transparent"/>
                            )}
                        </>;
                    })()}


                    {(() => {

                        const size = 1;
                        const cords = [];
                        for (let i = 0; i <= this.props.xn; i++) {
                            const ai = this.curve.get(i / this.props.xn);
                            for (let j = 0; j <= this.props.yn; j++) {

                                const aj = this.curve.get(j / this.props.yn);

                                cords.push({x: O.x + ai.x, y: O.y + aj.y});
                            }
                        }
                        return (
                            cords.map(({x, y}) =>
                                <rect
                                    fill='white'
                                    x={x - size/2} y={y-size/2} width={size} height={size}/>)
                        );
                    })()}

                    <path
                        d={`M${points[0].x + O.x} ${points[0].y + O.y} L${points[1].x + O.x} ${points[1].y + O.y} `}

                        stroke="white"
                        strokeWidth="0.3"
                        fill="transparent"/>
                    <path
                        d={`M${points[2].x + O.x} ${points[2].y + O.y} L${points[3].x + O.x} ${points[3].y + O.y} `}

                        stroke="white"
                        strokeWidth="0.4"
                        fill="transparent"/>
                    <path
                        d={`M${points[0].x + O.x} ${points[0].y + O.y} C ${points[1].x + O.x} ${points[1].y + O.y}, ${points[2].x + O.x} ${points[2].y + O.y}, ${points[3].x + O.x} ${points[3].y + O.y}`}
                        stroke="#ffcd00"
                        fill="transparent"/>
                    {points.map(({x, y}) =>
                        <rect
                            stroke="white"
                            fill="black"
                            x={x - point_w / 2 + O.x}
                            y={y - point_w / 2 + O.y}
                            width={point_w}
                            height={point_w}/>)}
                </SVG>

            </div>
        );
    }
}
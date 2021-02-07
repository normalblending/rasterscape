import * as React from "react";
import * as Bezier from "bezier-js";
import "./styles.scss";
import {SVG} from "../SVG";
import {CrossSVG} from "./_utils";
import {createVector, Vector, vectorAdd, vectorMul} from "../../../utils/vector";
import {RepeatingGridParams} from "../../../store/patterns/repeating/types";
import {useState} from "react";
import {readFile} from "fs";
import {setDefaults} from "react-i18next";
import {coordHelper} from "../../Area/canvasPosition.servise";

export type BezierPoints = { x: number, y: number }[];

export interface BezierCurveRepeatingProps {
    onChange(points: BezierPoints)

    onParamsChange(params: Partial<RepeatingGridParams>)

    xd: number
    yd: number
    xn0: number
    yn0: number
    xn1: number
    yn1: number

    value: BezierPoints

    disabled?: boolean
}

export interface BezierCurveRepeatingState {
    points: BezierPoints
}

const W = 210;
const H = 140;
const WW = 100;
const HH = 100;
const O = {x: 0, y: 0};

const SCALE = 0.5;

const scaleVec = (vec: Vector) => {
    return createVector(vec.x * SCALE, vec.y * SCALE);
};


type UseMoveHandler = (vec: Vector, e: MouseEvent) => void;

const useMove = (
    onMove: UseMoveHandler,
    onUp?: UseMoveHandler,
) => {
    const [startPoint, setStartPoint] = React.useState<Vector>(null);

    React.useEffect(() => {
        if (startPoint) {

            const moveHandler = (e) => {
                onMove(createVector(e.pageX - startPoint.x, e.pageY - startPoint.y), e);
            };

            const upHandler = (e) => {
                onUp?.(createVector(e.pageX - startPoint.x, e.pageY - startPoint.y), e);
                setStartPoint(null);
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
            return () => {
                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);
            };
        }
    }, [startPoint, onMove, onUp]);

    const startMove = React.useCallback((e) => {
        setStartPoint({x: e.pageX, y: e.pageY});
    }, []);

    return startMove;
};

type UseDragHandler = (vec: Vector, e: MouseEvent) => void;


const useDragPoint = (
    onChange: UseDragHandler
) => {
    const [startValue, setStartValue] = React.useState<Vector>(null);

    const movePointHandler = React.useCallback((vec: Vector, e: MouseEvent) => {
        onChange(vectorAdd(startValue, vec), e);
    }, [startValue, onChange]);

    const upPointHandler = React.useCallback(() => {
        setStartValue(null);
    }, []);

    const startMove = useMove(
        movePointHandler,
        upPointHandler,
    );

    const startDragPoint = React.useCallback((e, value) => {
        startMove(e)

        setStartValue(value);
    }, []);

    return startDragPoint;
};


export const BezierCurveRepeating: React.FC<BezierCurveRepeatingProps> = (props) => {

    const {
        value,
        disabled,
        onChange,
        onParamsChange
    } = props;

    const [scale, setScale] = React.useState<number>(0.5);

    const offset: Vector = React.useMemo(() => {
        return createVector(0, 0);
    }, [scale]);

    // CURVE
    const curve = React.useRef(new Bezier(value));

    React.useEffect(() => {
        curve.current = new Bezier(value);
    }, [value]);


    // DRAG POINT
    const [draggedPoint, setDraggedPoint] = React.useState<number>(-1);

    const onPointChange = React.useCallback((v: Vector) => {
        const points = curve.current.points;
        points[draggedPoint] = v;
        onChange(points);
    }, [curve.current, draggedPoint]);

    const startPointChange = useDragPoint(onPointChange);

    const handleChangePoint = React.useCallback((e) => {
        const {index} = e.target.dataset;

        setDraggedPoint(index);
        startPointChange(e, value[index]);
    }, [startPointChange, value]);





    const {xd, yd, xn0, yn0, xn1, yn1} = props;

    // BORDER OF CANVAS
    const border = React.useMemo(() => {
        const v = vectorMul(vectorAdd(offset, createVector(0, 0)), scale);
        return (
            <>
                <rect
                    strokeWidth={0.1}
                    stroke="white"
                    fill="transparent"
                    x={v.x}
                    y={v.y}
                    width={WW}
                    height={HH}
                    pointerEvents="none"
                />
            </>
        );
    }, [offset, scale]);


    const [changingCrosses, setChangingCrosses] = React.useState<Vector>(null);

    const handleChangeCross = React.useCallback((v: Vector) => {
        const {x: i, y: j} = v;
        const params = {};

        if (i) {
            const xf = i < 0 ? 'xn0' : 'xn1';
            params[xf] = Math.abs(i);
        } else {
            params['xn0'] = 0;
            params['xn1'] = 0;
        }
        if (j) {
            const yf = j < 0 ? 'yn0' : 'yn1';
            params[yf] = Math.abs(j);
        } else {
            params['yn0'] = 0;
            params['yn1'] = 0;
        }

        onParamsChange(params);
    }, [onParamsChange]);

    const handleItemEnter = React.useCallback((e) => {

        if (changingCrosses) {
            const i = +e.target.dataset.i;
            const j = +e.target.dataset.j;

            handleChangeCross(createVector(i, j));

        }
    }, [changingCrosses, onParamsChange, xn0, xn1, yn0, yn1]);

    const handleItemDown = React.useCallback((e) => {
        const startCross = createVector(+e.target.dataset.i, +e.target.dataset.j);
        setChangingCrosses(startCross);

        handleChangeCross(startCross);
        const handleMouseUp = () => {
            setChangingCrosses(null);
            document.removeEventListener('mouseup', handleMouseUp)
        };
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const i0 = curve.current.get(1 / (2 * xd)).x + O.x;
    const j0 = curve.current.get(1 / (2 * yd)).y + O.y;

    const handleXdChange = React.useCallback((v: Vector) => {
        onParamsChange({
            xd: Math.max(1, Math.round(v.x / 10))
        });
    }, []);
    const startChangeXd = useDragPoint(handleXdChange);
    const handleChangeXdStart = React.useCallback((e) => {
        startChangeXd(e, createVector(xd, 0));
    }, [startChangeXd, xd]);

    const handleYdChange = React.useCallback((v: Vector) => {
        onParamsChange({
            yd: Math.max(1, Math.round(v.y / 10))
        });
    }, []);
    const startChangeYd = useDragPoint(handleYdChange);
    const handleChangeYdStart = React.useCallback((e) => {
        startChangeYd(e, createVector(0, yd));
    }, [startChangeYd, yd]);

    const grid = React.useMemo(() => {
        const size = 1;
        const cords = [];


        if (disabled) {
            for (let i = -10; i <= 10 + xn1; i++) {
                const ai = WW / xd * i;
                for (let j = -10; j <= 10 + yn1; j++) {

                    const aj = HH / yd * j;

                    cords.push({x: O.x + ai, y: O.y + aj, i, j});
                }
            }
        } else {

            for (let i = -xn0 - 1; i <= xd + xn1 + 1; i++) {
                const ai = curve.current.get(i / xd + 1 / (2 * xd));
                for (let j = -yn0 - 1; j <= yd + yn1 + 1; j++) {

                    const aj = curve.current.get(j / yd + 1 / (2 * yd));

                    cords.push({
                        x: O.x + ai.x,
                        y: O.y + aj.y,
                        i,
                        j,
                        out: i < 0 || i > xd || j < 0 || j > yd
                    });
                }
            }
        }



        return (<>
            {/* CrossSVG dotted */}
            <line
                x1={i0}
                y1={j0 - 150}
                x2={i0}
                y2={j0 + 150}
                strokeWidth={0.2}
                strokeDasharray={2}
                strokeDashoffset={2}
                stroke={'white'}
                pointerEvents="none"
            />
            <line
                x1={i0 - 150}
                y1={j0}
                x2={i0 + 150}
                y2={j0}
                strokeWidth={0.2}
                strokeDasharray={2}
                strokeDashoffset={2}
                stroke={'white'}
                pointerEvents="none"
            />
            <line
                x1={i0}
                y1={j0 - 150}
                x2={i0}
                y2={j0 + 150}
                strokeWidth={10}
                stroke={'transparent'}
                cursor={'col-resize'}
                onMouseDown={handleChangeXdStart}
            />
            <line
                x1={i0 - 150}
                y1={j0}
                x2={i0 + 150}
                y2={j0}
                strokeWidth={10}
                stroke={'transparent'}
                onMouseDown={handleChangeYdStart}
                cursor={'row-resize'}
            />

            {cords.map(({x, y, i, j, out}) => (<>
                <rect
                    opacity={out ? 0.3 : 1}
                    fill={'white'}
                    x={x - size / 2}
                    y={out ? (y - size *3/2) : (y - size/2)}
                    width={size}
                    height={out ? (size * 3) : size}
                    pointerEvents="none"
                />
                <rect
                    fill='transparent'
                    x={x - 10 / 2}
                    y={y - 10 / 2}
                    width={10}
                    height={10}
                    data-id={`${i},${j}`}
                    data-i={i}
                    data-j={j}
                    cursor={'crosshair'}
                    onMouseDown={handleItemDown}
                    onMouseEnter={handleItemEnter}
                />
            </>))}




            {/* edges */}
            <line
                x1={O.x + Math.min(value[0].x, value[3].x)}
                y1={O.y + Math.min(value[0].y, value[3].y)}
                x2={O.x}
                y2={O.y}
                strokeWidth={0.2}
                stroke={'white'}
                pointerEvents="none"
            />
            <line
                x1={O.x + Math.max(value[0].x, value[3].x)}
                y1={O.y + Math.max(value[0].y, value[3].y)}
                x2={O.x + WW}
                y2={O.y + HH}
                strokeWidth={0.2}
                stroke={'white'}
                pointerEvents="none"
            />

            <line
                x1={O.x + Math.min(value[0].x, value[3].x)}
                y1={O.y + Math.max(value[0].y, value[3].y)}
                x2={O.x}
                y2={O.y + HH}
                strokeWidth={0.2}
                stroke={'white'}
                pointerEvents="none"
            />
            <line
                x1={O.x + Math.max(value[0].x, value[3].x)}
                y1={O.y + Math.min(value[0].y, value[3].y)}
                x2={O.x + WW}
                y2={O.y}
                strokeWidth={0.2}
                stroke={'white'}
                pointerEvents="none"
            />
            <rect
                x={O.x + Math.min(value[0].x, value[3].x)}
                y={O.y + Math.min(value[0].y, value[3].y)}
                width={Math.max(value[0].x, value[3].x) - Math.min(value[0].x, value[3].x)}
                height={Math.max(value[0].y, value[3].y) - Math.min(value[0].y, value[3].y)}
                strokeWidth={0.2}
                stroke={'white'}
                fillOpacity={0}
                pointerEvents="none"
            />


        </>);
    }, [disabled, xd, yd, xn0, yn0, xn1, yn1, curve.current, i0, j0, value, handleItemEnter, handleItemDown]);

    const crosses = React.useMemo(() => {
        const crosses = [];

        if (disabled) {

        } else {
            for (let i = -xn0; i <= xn1; i++) {
                const ai = curve.current.get((i + 0.5) / xd);
                for (let j = -yn0; j <= yn1; j++) {

                    const aj = curve.current.get((j + 0.5) / yd);

                    crosses.push({x: O.x + ai.x, y: O.y + aj.y, i, j, o: !i && !j});
                }
            }
        }
        return (<>
            {crosses.map(({x, y, i, j}) => (
                <CrossSVG
                    x={x} y={y}
                    size={6}
                    stroke={'white'}
                    strokeWidth={0.5}
                    pointerEvents='none'
                    // onMouseDown={handleChangeCross}
                    data={`${i}-${j}`}
                    // onMouseEnter={(e, data) => {
                    //     console.log(data)
                    // }}
                />
            ))}
        </>);
    }, [disabled, xd, yd, xn0, yn0, xn1, yn1, curve.current, i0, j0]);

    const line = React.useMemo(() => {
        const points = value;
        return (
            <>
                <path
                    d={`M${points[0].x + O.x} ${points[0].y + O.y} L${points[1].x + O.x} ${points[1].y + O.y} `}

                    stroke="white"
                    strokeWidth="0.3"
                    pointerEvents="none"
                    fill="transparent"/>
                <path
                    d={`M${points[2].x + O.x} ${points[2].y + O.y} L${points[3].x + O.x} ${points[3].y + O.y} `}

                    stroke="white"
                    strokeWidth="0.4"
                    pointerEvents="none"
                    fill="transparent"/>
                <path
                    d={`M${points[0].x + O.x} ${points[0].y + O.y} C ${points[1].x + O.x} ${points[1].y + O.y}, ${points[2].x + O.x} ${points[2].y + O.y}, ${points[3].x + O.x} ${points[3].y + O.y}`}
                    stroke={disabled ? 'grey' : "#ffcd00"}
                    pointerEvents="none"
                    fill="transparent"/>
            </>
        )
    }, [value]);

    const points = React.useMemo(() => {
        const point_w = 5;
        return value.map(({x, y}, index) =>
            <rect
                className={'bezier-point'}
                data-index={index}
                onMouseDown={handleChangePoint}
                stroke="white"
                fill="black"
                x={x - point_w / 2 + O.x}
                y={y - point_w / 2 + O.y}
                width={point_w}
                height={point_w}/>)
    }, [value]);


    return (
        <div className={"grid-bezier-curve"}>

            <SVG
                className={"grid-bezier-curve-markers"}
                width={W}
                height={H}
                currentScale={0.1}

            >

                {border}

                {grid}

                {line}


                {crosses}

                {points}
            </SVG>
        </div>
    );
}
